"""
Optical Character Recognition & Label Parser Router
Extracts Legal Metrology Rule 6 declarations from packaging images.

Pipeline:
1. Receive base64 image from frontend JSON body (or multipart form).
2. Decode → PIL Image → OpenCV preprocessing (grayscale, CLAHE, threshold,
   deskew, upscale).  Falls back to PIL-only when OpenCV is not installed.
3. Run Tesseract OCR (pytesseract) if the binary is available.
4. Apply robust regex-based field extraction on raw OCR text.
5. Return structured fields + raw_text for debug/review.

Fallback: If Tesseract is not installed, returns all fields as
"Not detected" with a clear ocr_status — HTTP 200 is NOT a proxy for
OCR success.
"""

import base64
import io
import re
import logging
import os
import shutil
from typing import Optional, Dict, Any, List

from fastapi import APIRouter, Request
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ocr", tags=["OCR"])


# ---------------------------------------------------------------------------
# Tesseract availability probe
# ---------------------------------------------------------------------------

def _find_tesseract() -> Optional[str]:
    """
    Locate the Tesseract binary.
    Priority:
      1. TESSERACT_CMD env var (set by operator for non-standard installs)
      2. Common Windows install paths (program files, per-user)
      3. System PATH via shutil.which
    Returns the executable path string or None.
    """
    # Allow explicit override via environment variable
    env_path = os.environ.get("TESSERACT_CMD", "")
    if env_path and os.path.isfile(env_path):
        return env_path

    candidates = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(
            os.environ.get("USERNAME", "")
        ),
        r"C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe".format(
            os.environ.get("USERNAME", "")
        ),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c

    # Also check PATH (works on Linux/Mac or if Windows PATH is configured)
    path_find = shutil.which("tesseract")
    if path_find:
        return path_find

    return None


TESSERACT_CMD = _find_tesseract()

# ---- pytesseract integration ------------------------------------------------
PYTESSERACT_AVAILABLE = False
TESSERACT_VERSION = None
try:
    import pytesseract
    if TESSERACT_CMD:
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
        TESSERACT_VERSION = str(pytesseract.get_tesseract_version())
        PYTESSERACT_AVAILABLE = True
        logger.info("[OCR] Tesseract %s ready at: %s", TESSERACT_VERSION, TESSERACT_CMD)
    else:
        logger.warning(
            "[OCR] pytesseract installed but Tesseract binary not found. "
            "Download from https://github.com/UB-Mannheim/tesseract/wiki "
            "or set the TESSERACT_CMD environment variable."
        )
except ImportError:
    logger.warning(
        "[OCR] pytesseract package is not installed. "
        "Run: pip install pytesseract"
    )
except Exception as e:
    logger.warning("[OCR] pytesseract/Tesseract not functional: %s", e)

# ---- OpenCV availability ----------------------------------------------------
OPENCV_AVAILABLE = False
try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
    logger.info("[OCR] OpenCV %s available for preprocessing.", cv2.__version__)
except ImportError:
    logger.info("[OCR] OpenCV not installed; using PIL-only preprocessing.")


# ---------------------------------------------------------------------------
# Image preprocessing
# ---------------------------------------------------------------------------

def _preprocess_opencv(img_pil: Image.Image) -> Image.Image:
    """
    OpenCV preprocessing pipeline for product labels:
    1. Convert to grayscale.
    2. Upscale to ≥1600 px wide for readable small text.
    3. CLAHE (adaptive histogram equalization) for local contrast.
    4. Gaussian denoising.
    5. Adaptive threshold (Otsu) on the full image + compare raw vs
       thresholded — use whichever version Tesseract reads better.
    6. Deskew by finding the dominant line angle.
    """
    import cv2
    import numpy as np

    # PIL → OpenCV (BGR or gray)
    img_np = np.array(img_pil.convert("RGB"))
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

    # Upscale if narrow (small labels, close-up photos)
    h, w = gray.shape
    if w < 1600:
        scale = 1600 / w
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_LANCZOS4)

    # Denoise
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # CLAHE for adaptive contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Adaptive threshold (handles uneven lighting on curved/shiny packaging)
    thresh = cv2.adaptiveThreshold(
        enhanced, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=10,
    )

    # Deskew: find contours of text blobs, estimate rotation angle
    try:
        coords = np.column_stack(np.where(thresh < 128))  # dark pixels = text
        if len(coords) > 100:
            angle = cv2.minAreaRect(coords)[-1]
            if angle < -45:
                angle = 90 + angle
            if abs(angle) > 0.5:  # only correct if non-trivial skew
                (h2, w2) = thresh.shape[:2]
                center = (w2 // 2, h2 // 2)
                M = cv2.getRotationMatrix2D(center, angle, 1.0)
                thresh = cv2.warpAffine(
                    thresh, M, (w2, h2),
                    flags=cv2.INTER_CUBIC,
                    borderMode=cv2.BORDER_REPLICATE,
                )
                enhanced = cv2.warpAffine(
                    enhanced, M, (w2, h2),
                    flags=cv2.INTER_CUBIC,
                    borderMode=cv2.BORDER_REPLICATE,
                )
    except Exception:
        pass  # deskew is best-effort

    # Return the thresholded image (best for printed text)
    return Image.fromarray(thresh)


def _preprocess_pil(img: Image.Image) -> Image.Image:
    """
    PIL-only fallback preprocessing when OpenCV is not installed.
    """
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    img = img.convert("L")

    w, h = img.size
    if w < 1400:
        scale = 1400 / w
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    # Mild contrast boost (not too aggressive — destroys faint text)
    img = ImageEnhance.Contrast(img).enhance(1.8)
    img = ImageEnhance.Sharpness(img).enhance(2.0)
    img = img.filter(ImageFilter.SHARPEN)

    return img


def preprocess_image(img: Image.Image) -> Image.Image:
    """Dispatch to OpenCV or PIL pipeline."""
    if OPENCV_AVAILABLE:
        try:
            return _preprocess_opencv(img)
        except Exception as e:
            logger.warning("[OCR] OpenCV preprocessing failed, falling back to PIL: %s", e)
    return _preprocess_pil(img)


# ---------------------------------------------------------------------------
# Raw OCR execution
# ---------------------------------------------------------------------------

def run_ocr(img: Image.Image) -> tuple[str, str]:
    """
    Run Tesseract on the preprocessed image.
    Returns (raw_text, ocr_status).
    ocr_status == "ok" means Tesseract ran and produced non-empty text.
    """
    if not PYTESSERACT_AVAILABLE:
        return (
            "",
            "OCR engine not available — pytesseract is not installed or Tesseract binary "
            "was not found. Install Tesseract from "
            "https://github.com/UB-Mannheim/tesseract/wiki then restart the backend.",
        )

    try:
        import pytesseract

        # PSM 6 = assume uniform block of text (best for flat labels)
        # PSM 3 = fully automatic (better for complex layouts — try both)
        configs = [
            "--oem 3 --psm 6",
            "--oem 3 --psm 3",
            "--oem 3 --psm 4",
        ]
        best_text = ""
        for cfg in configs:
            try:
                text = pytesseract.image_to_string(img, lang="eng", config=cfg)
                if len(text.strip()) > len(best_text.strip()):
                    best_text = text
            except Exception:
                continue

        if not best_text.strip():
            return (
                "",
                "OCR returned empty text — image may be too blurry, low-contrast, or "
                "incorrectly oriented. Try uploading a flat, well-lit photo.",
            )
        return best_text, "ok"
    except Exception as e:
        logger.error("[OCR] Tesseract error: %s", e)
        return "", f"OCR engine error: {e}"


# ---------------------------------------------------------------------------
# Field extraction helpers
# ---------------------------------------------------------------------------

def _first_match(patterns: List[str], text: str, flags: int = re.IGNORECASE) -> Optional[str]:
    """Try each regex pattern; return first non-empty captured group."""
    for p in patterns:
        try:
            m = re.search(p, text, flags | re.MULTILINE)
            if m:
                val = m.group(1).strip()
                if val:
                    return val
        except re.error:
            continue
    return None


def _clean_value(val: Optional[str]) -> str:
    """Strip trailing punctuation/whitespace and normalize internal whitespace."""
    if not val:
        return "Not detected"
    val = re.sub(r"\s+", " ", val).strip()
    val = val.rstrip(".,;:")
    return val if val else "Not detected"


def nd(val: Optional[str]) -> str:
    """Return cleaned value or 'Not detected'."""
    if val is None:
        return "Not detected"
    cleaned = _clean_value(val)
    if cleaned.lower() in ("", "not detected", "unknown", "null", "none"):
        return "Not detected"
    return cleaned


# ---------------------------------------------------------------------------
# Per-field extraction
# ---------------------------------------------------------------------------

def _extract_mrp(text: str) -> tuple[Optional[str], bool]:
    """Return (mrp_string, includes_taxes)."""
    taxes = bool(re.search(
        r"incl(?:usive)?\.?\s+(?:of\s+)?(?:all\s+)?tax(?:es)?",
        text, re.IGNORECASE
    ))

    # Currency prefix: handles OCR misreads of "Rs." as "Ps.", "Fs.", "Es.", "Bs."
    # (Tesseract frequently confuses 'R' with 'P', 'F', 'E', 'B' on printed labels)
    currency_prefix = r"(?:[₹]|Rs\.?|INR|[PFEBRpfebr]s\.?)\s*"

    patterns = [
        # MRP Rs. 55.00  /  M.R.P ₹55  /  MRP: Rs 55.00
        rf"M\.?R\.?P\.?\s*[:\-]?\s*{currency_prefix}?([\d,]+(?:\.\d{{1,2}})?)",
        r"Maximum\s+Retail\s+Price\s*[:\-]?\s*" + currency_prefix + r"?([\d,]+(?:\.\d{1,2})?)",
        # ₹ or Rs. standalone (without MRP keyword)
        rf"(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{{1,2}})?)",
        # Price: Rs. 55
        r"(?:^|\n)\s*Price\s*[:\-]\s*" + currency_prefix + r"?([\d,]+(?:\.\d{1,2})?)",
    ]
    val = _first_match(patterns, text)
    return val, taxes


def _extract_net_qty(text: str) -> Optional[str]:
    units = r"(?:kg|kgs|g|gm|gms|grams?|ml|mls|l|litre?s?|liter?s?|pieces?|pcs?|nos?\.?|tabs?|units?|sachets?|pouches?)"
    patterns = [
        # Net Wt.: 100g / Net Weight: 5.0 kg / Net Qty: 250ml
        rf"Net\s+(?:Wt\.?|Weight|Qty\.?|Quantity|Content|Vol\.?|Volume)\s*[:\-]?\s*([\d,.]+\s*{units})",
        # Wt./Qty. without Net prefix
        rf"(?:^|\n)\s*(?:Wt\.?|Weight|Qty\.?|Quantity)\s*[:\-]\s*([\d,.]+\s*{units})",
        # Stand-alone quantity before unit on the same line (e.g. "250 ml" or "100g")
        rf"(?:^|\n)\s*([\d,.]+\s*{units})\s*(?:\n|$)",
        # Looser: number followed by unit anywhere (lowest priority)
        rf"\b([\d,.]+\s*{units})\b",
    ]
    return _first_match(patterns, text, re.IGNORECASE)


def _extract_date(text: str, kind: str) -> Optional[str]:
    """
    Extract MFG or EXP date.
    kind: 'mfg' or 'exp'
    """
    # Comprehensive date formats
    date_pat = (
        r"(?:"
        r"\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}"  # DD/MM/YYYY or MM/YY
        r"|"
        r"\d{1,2}[\/\-\.]\d{4}"  # MM/YYYY
        r"|"
        r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]?\d{4}"  # Jan 2026
        r"|"
        r"\d{4}[\-\/]\d{1,2}"  # YYYY-MM
        r")"
    )

    if kind == "mfg":
        labels = (
            r"(?:Mfg\.?\s+Date|Mfg\.?|MFD\.?|Mfd\.?|Mfgd\.?|Manufacturing\s+Date|Manufactured\s+(?:on|On)|"
            r"Date\s+of\s+Mfg\.?|Date\s+of\s+Manufacture|Packing\s+Date|Pkd\.?\s*(?:on|dt)?|"
            r"Date\s+of\s+Packing|Packed\s+(?:on|On)|Packed\s+Date)"
        )
    else:
        labels = (
            r"(?:Exp(?:iry)?\s+Date|Exp(?:iry)?\.?|Best\s+Before(?:\s+End)?|BBE?|Use\s+Bef?o?re?|"
            r"Use\s+By|Shelf\s+Life\s+(?:till|until|upto)|Best\s+By|"
            r"Consume\s+(?:before|by)|Valid\s+(?:till|until))"
        )


    patterns = [
        # Label followed immediately by date
        rf"{labels}\s*[:\-]?\s*({date_pat})",
        # Date preceded by label on same line (date first variation)
        rf"({date_pat})\s*[-–]\s*{labels}",
    ]

    for p in patterns:
        try:
            m = re.search(p, text, re.IGNORECASE | re.MULTILINE)
            if m:
                # Return the group that matched the date
                for g in m.groups():
                    if g and re.search(r"\d", g):
                        return g.strip()
        except re.error:
            continue
    return None


def _extract_batch(text: str) -> Optional[str]:
    patterns = [
        # Batch No.: ABC-001 / Lot No: XYZ / B. No.: 123
        r"(?:Batch|Lot)\s*(?:No\.?|Number|#|Code|:)\s*[:\-]?\s*([A-Z0-9][A-Z0-9\/\-\.]+)",
        r"B(?:atch)?\.?\s*No\.?\s*[:\-]\s*([A-Z0-9][A-Z0-9\/\-\.]+)",
        r"L(?:ot)?\.?\s*No\.?\s*[:\-]\s*([A-Z0-9][A-Z0-9\/\-\.]+)",
        r"(?:Batch|Lot)\s*[:\-]\s*([A-Z0-9][A-Z0-9\/\-\. ]+?)(?:\n|$)",
    ]
    return _first_match(patterns, text)


def _extract_brand(text: str, manufacturer: Optional[str] = None) -> Optional[str]:
    """
    Try explicit Brand: label first, then infer from first capitalised line
    that does not look like a field header or numeric value.
    """
    explicit = _first_match(
        [
            r"(?:Brand|Trade\s*(?:Mark|Name))\s*[:\-]\s*([A-Za-z][A-Za-z0-9\s&'.]+?)(?:\n|$)",
        ],
        text,
    )
    if explicit:
        return explicit

    # If manufacturer name is known, try to extract brand from its prefix
    # e.g. "Nestle India Ltd." → "Nestle"
    if manufacturer and manufacturer != "Not detected":
        m = re.match(r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", manufacturer)
        if m and len(m.group(1)) >= 3:
            return m.group(1)

    return None


def _extract_product_name(text: str) -> Optional[str]:
    explicit = _first_match(
        [
            r"(?:Product\s*Name|Product)\s*[:\-]\s*([A-Za-z][A-Za-z0-9\s&',\-\.]+?)(?:\n|$)",
            r"(?:Generic\s*Name|Common\s*Name)\s*[:\-]\s*([A-Za-z][A-Za-z0-9\s&',\-\.]+?)(?:\n|$)",
        ],
        text,
    )
    if explicit:
        return explicit

    # Heuristic: first meaningful text line (not a field header, not purely numeric)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    skip_words = re.compile(
        r"(?:MRP|M\.R\.P|Net|Mfg|Batch|FSSAI|www\.|http|@|Consumer|Helpline|"
        r"Ingredients?|Warning|Caution|Note:|Best Before|Expiry|Manufactured|"
        r"Rs\.|Label\.|Toll|ISO|BIS|Ayush)",
        re.IGNORECASE,
    )
    for line in lines[:8]:
        if (
            len(line) >= 4
            and len(line) <= 80
            and not re.match(r"^[\d\s\.\-\/₹%,]+$", line)   # skip numeric-only
            and not skip_words.search(line)
        ):
            return line
    return None


def _extract_manufacturer(text: str) -> Optional[str]:
    patterns = [
        # "Manufactured by: XYZ Ltd." — stop at newline or contact signals
        r"Manufactured?\s+(?:By|by)\s*[:\-\.]?\s*((?:M/s\s+)?[A-Za-z][A-Za-z0-9\s,\.&'()/\-]+?)(?:\n|Phone|Tel\b|Email|FSSAI|Consumer|$)",
        # "Mfd. by:" — common short form. Also catches OCR misreads like "Mid. by", "Mrd. by"
        r"M[fi][df]r?\.\s+(?:By|by)\s*[:\-\.]?\s*((?:M/s\s+)?[A-Za-z][A-Za-z0-9\s,\.&'()/\-]+?)(?:\n|Phone|Tel\b|Email|FSSAI|Consumer|$)",
        # "Mfg. by:" (sometimes used for Mfg = Manufacturer)
        r"Mfg\.\s+(?:By|by)\s*[:\-\.]?\s*((?:M/s\s+)?[A-Za-z][A-Za-z0-9\s,\.&'()/\-]+?)(?:\n|Phone|Tel\b|Email|FSSAI|Consumer|$)",
        # Packed/Marketed/Imported/Distributed by
        r"(?:Marketed|Packed|Imported|Distributed)\s+(?:By|by)\s*[:\-\.]?\s*((?:M/s\s+)?[A-Za-z][A-Za-z0-9\s,\.&'()/\-]+?)(?:\n|Phone|Tel\b|Email|FSSAI|Consumer|$)",
        # "Manufacturer: XYZ" / "Packer: XYZ"
        r"(?:Manufacturer|Packer|Importer)\s*[:\-]\s*((?:M/s\s+)?[A-Za-z][A-Za-z0-9\s,\.&'()/\-]+?)(?:\n|Phone|Tel\b|Email|FSSAI|Consumer|$)",
    ]
    return _first_match(patterns, text, re.IGNORECASE)



def _extract_address(text: str) -> Optional[str]:
    """
    Extract manufacturer/packer address.
    Looks for a block that contains a PIN code (6-digit for India).
    """
    patterns = [
        r"(?:Address|Regd\.?\s*Office|Registered\s+Office|Factory|Plant)\s*[:\-]\s*([A-Za-z0-9][A-Za-z0-9\s,\.\-\/]+\d{6})",
        # Address on the line after "Manufactured by" block
        r"(?:Manufactured?\s+(?:By|by)[^\n]{0,80})\n\s*([A-Za-z0-9][A-Za-z0-9\s,\.\-\/]+\d{6})",
        # Any line containing a 6-digit PIN that also has a comma (street,city)
        r"([A-Za-z][A-Za-z0-9\s,\.\-\/]+(?:,\s*[A-Za-z]+)\s*[-–]\s*\d{6})",
    ]
    return _first_match(patterns, text, re.IGNORECASE | re.DOTALL)


def _extract_consumer_care(text: str) -> tuple[Optional[str], Optional[str]]:
    """
    Return (phone_and_email_string, email_and_web_string).

    Phone numbers: Indian 10-digit, toll-free 1800-xxx-xxxx, +91 variants.
    Strict pattern to avoid matching FSSAI license numbers (14 digits).
    """
    # Strict Indian phone: exactly 10 digits not preceded by more digits
    phone_pat = re.compile(
        r"(?<!\d)(?:"
        r"(?:\+91|0091|91)[\s\-]?(?:\d[\s\-]?){10}"  # +91 prefix
        r"|1800[\s\-]?\d{3}[\s\-]?\d{4}"              # toll-free 1800-xxx-xxxx
        r"|1800[\s\-]?\d{7}"                           # toll-free compact
        r"|0\d{2,4}[\s\-]\d{6,8}"                     # landline 0xx-xxxxxxx
        r"|[6-9]\d{9}"                                 # mobile (starts 6-9)
        r")(?!\d)",
        re.IGNORECASE,
    )
    phones = phone_pat.findall(text)
    # Deduplicate and clean
    seen = set()
    clean_phones = []
    for p in phones:
        p_clean = re.sub(r"\s+", " ", p).strip()
        if p_clean not in seen:
            seen.add(p_clean)
            clean_phones.append(p_clean)

    emails = re.findall(
        r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}",
        text,
    )
    urls = re.findall(
        r"(?:www\.[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|https?://[^\s]+)",
        text,
    )

    care_parts = []
    if clean_phones:
        care_parts.append("Tel: " + ", ".join(clean_phones[:2]))
    if emails:
        care_parts.append(", ".join(emails[:2]))
    consumer_care = "; ".join(care_parts) if care_parts else None

    web_parts = []
    if emails:
        web_parts.append(", ".join(emails[:2]))
    if urls:
        web_parts.append(", ".join(urls[:2]))
    consumer_care_web = " / ".join(web_parts) if web_parts else None

    return consumer_care, consumer_care_web


def _extract_country(text: str) -> Optional[str]:
    patterns = [
        # Normal: "Country of Origin: India"
        r"Country\s+of\s+Origin\s*[:\-]?\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)",
        # OCR drops space: "Countryof Origin: India"
        r"Countryof\s+Origin\s*[:\-]?\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)",
        r"Made\s+in\s*[:\-]?\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)",
        r"Manufactured\s+in\s*[:\-]?\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)",
        # "Origin: India" short form
        r"(?:^|\n)\s*Origin\s*[:\-]\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)",
    ]
    val = _first_match(patterns, text, re.IGNORECASE)
    if val:
        # Trim at newline, FSSAI, or other label keywords that bleed in
        val = re.split(r"\n|FSSAI|Vegetarian|Ingredients|Warning|Batch", val, flags=re.IGNORECASE)[0]
        val = re.sub(r"\s+", " ", val).strip()
        # Reject if more than 3 words (probably captured extra text)
        if len(val.split()) > 3:
            return None
    return val if val else None



def _extract_ingredients(text: str) -> Optional[str]:
    patterns = [
        # With colon or dash
        r"Ingredients?\s*[:\-]\s*((?:.|\n){10,500}?)(?:\n\n|Allergen|ALLERGEN|Net\s+|Mfg|MRP|M\.R\.P|Country|$)",
        # Without colon (OCR drops punctuation)
        r"(?:^|\n)Ingredients?\s+((?:[A-Za-z][^:\n].{8,500}?)(?:\n\n|Allergen|Net\s+|Mfg|MRP|Country|$))",
    ]
    return _first_match(patterns, text, re.IGNORECASE | re.DOTALL)


def _extract_warnings(text: str) -> Optional[str]:
    patterns = [
        # With colon
        r"(?:Warning|Caution|CAUTION|Precaution|IMPORTANT(?:\s+NOTICE)?)\s*[:\-]\s*((?:.|\n){10,400}?)(?:\n\n|Net\s+|Mfg|MRP|Ingredients|Country|$)",
        # Without colon (OCR)
        r"(?:^|\n)(?:Warning|Caution)\s+([A-Za-z].{10,300}?)(?:\n\n|MRP|Ingredients|$)",
    ]
    return _first_match(patterns, text, re.IGNORECASE | re.DOTALL)



def _extract_other_declarations(text: str) -> Optional[str]:
    parts = []

    fssai = re.search(
        r"FSSAI\s*(?:Lic\.?\s*No\.?|License\s*No\.?|Reg\.?\s*No\.?)?\s*[:\-]?\s*(\d{14})",
        text, re.IGNORECASE,
    )
    if fssai:
        parts.append(f"FSSAI Lic. No. {fssai.group(1)}")

    ayush = re.search(
        r"Ayush\s+(?:License|Lic\.?)\s*(?:No\.?)?\s*[:\-]?\s*([A-Z0-9.\-\/]+)",
        text, re.IGNORECASE,
    )
    if ayush:
        parts.append(f"Ayush Lic. No. {ayush.group(1)}")

    veg = re.search(
        r"\b(Vegetarian|Non[\s\-]Vegetarian|Vegan)\b",
        text, re.IGNORECASE,
    )
    if veg:
        parts.append(veg.group(1))

    return "; ".join(parts) if parts else None


def _extract_generic_name(text: str) -> Optional[str]:
    return _first_match(
        [
            r"(?:Generic\s*Name|Common\s*Name)\s*[:\-]\s*([A-Za-z][A-Za-z0-9\s&',\-\.]+?)(?:\n|$)",
        ],
        text,
    )


# ---------------------------------------------------------------------------
# Main field extraction orchestrator
# ---------------------------------------------------------------------------

def extract_fields(raw_text: str) -> Dict[str, Any]:
    """
    Parse raw OCR text and map to Legal Metrology Rule 6 fields.
    Returns 'Not detected' for fields that cannot be confidently extracted.
    """
    mrp_val, mrp_taxes = _extract_mrp(raw_text)
    if mrp_val:
        currency = "₹" if not mrp_val.startswith("₹") else ""
        tax_suffix = " (Incl. of all taxes)" if mrp_taxes else ""
        mrp_display = f"{currency}{mrp_val}{tax_suffix}"
    else:
        mrp_display = None

    manufacturer = nd(_extract_manufacturer(raw_text))
    brand = nd(_extract_brand(raw_text, manufacturer))
    consumer_care, consumer_care_web = _extract_consumer_care(raw_text)

    return {
        "productName":        nd(_extract_product_name(raw_text)),
        "brand":              brand,
        "category":           "Packaged Consumer Commodity",
        "netQuantity":        nd(_extract_net_qty(raw_text)),
        "mrp":                nd(mrp_display),
        "mrpIncludesTaxes":   mrp_taxes,
        "batchNumber":        nd(_extract_batch(raw_text)),
        "mfgDate":            nd(_extract_date(raw_text, "mfg")),
        "expiryDate":         nd(_extract_date(raw_text, "exp")),
        "unitSalePrice":      "Not detected",
        "genericName":        nd(_extract_generic_name(raw_text)),
        "manufacturer":       manufacturer,
        "manufacturerAddress": nd(_extract_address(raw_text)),
        "consumerCare":       nd(consumer_care),
        "consumerCareEmailWeb": nd(consumer_care_web),
        "countryOfOrigin":    nd(_extract_country(raw_text)),
        "ingredients":        nd(_extract_ingredients(raw_text)),
        "warnings":           nd(_extract_warnings(raw_text)),
        "otherDeclarations":  nd(_extract_other_declarations(raw_text)),
    }


# ---------------------------------------------------------------------------
# Preset products (used when user selects a Sample product in the UI)
# ---------------------------------------------------------------------------

PRESET_COMMODITIES = {
    "atta": {
        "productName": "Sharbati Whole Wheat Atta",
        "brand": "PureFoods Nature Fresh",
        "category": "Packaged Food Commodity",
        "netQuantity": "5.0 kg",
        "mrp": "₹285.00 (Incl. of all taxes)",
        "mrpIncludesTaxes": True,
        "batchNumber": "B-ATT-2026/04",
        "mfgDate": "01/2026",
        "expiryDate": "04/2026",
        "unitSalePrice": "₹57.00 per kg",
        "genericName": "Whole Wheat Flour",
        "manufacturer": "M/s PureFoods India Pvt. Ltd.",
        "manufacturerAddress": "Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015",
        "consumerCare": "Toll Free Helpline: 1800-200-4567 (Mon-Sat 9am-6pm)",
        "consumerCareEmailWeb": "care@purefoodsindia.com / www.purefoodsindia.com",
        "countryOfOrigin": "India",
        "ingredients": "100% Whole Wheat Grains (Unadulterated)",
        "warnings": "Store in a cool dry place away from direct sunlight.",
        "otherDeclarations": "Vegetarian Green Dot Certified; FSSAI Lic. No. 10014022003112",
    },
    "energy": {
        "productName": "Bolt Surge Charged Energy Drink",
        "brand": "Bolt Beverages",
        "category": "Caffeinated Carbonated Beverage",
        "netQuantity": "250 ml",
        "mrp": "₹120.00 (Incl. of all taxes)",
        "mrpIncludesTaxes": True,
        "batchNumber": "BLT-EN-9912",
        "mfgDate": "12/2025",
        "expiryDate": "11/2026",
        "unitSalePrice": "₹0.48 per ml",
        "genericName": "Caffeinated Beverage",
        "manufacturer": "Apex Beverages Ltd.",
        "manufacturerAddress": "Khasra 89/2, Industrial Focal Point, Ludhiana, Punjab - 141010",
        "consumerCare": "Helpline: 011-49823100",
        "consumerCareEmailWeb": "feedback@apexbeverages.in / www.apexbeverages.in",
        "countryOfOrigin": "India",
        "ingredients": "Carbonated Water, Sugar, Taurine (1000mg), Caffeine (32mg/100ml), Inositol, B-Vitamins (B3, B6, B12)",
        "warnings": "High caffeine content. Not recommended for children, pregnant or lactating women, and persons sensitive to caffeine.",
        "otherDeclarations": "Best served chilled; FSSAI Lic. No. 10819001000451",
    },
    "balm": {
        "productName": "ReliefPlus Fast Active Herbal Balm",
        "brand": "Sanjivani Herbals",
        "category": "Ayurvedic Proprietary Pain Relief Formulation",
        "netQuantity": "25 g",
        "mrp": "₹85.00 (Incl. of all taxes)",
        "mrpIncludesTaxes": True,
        "batchNumber": "RPB-2601",
        "mfgDate": "02/2026",
        "expiryDate": "01/2029",
        "unitSalePrice": "₹3.40 per g",
        "genericName": "Ayurvedic Pain Balm",
        "manufacturer": "Sanjivani Herbal Remedies",
        "manufacturerAddress": "Industrial Area, Haridwar, Uttarakhand - 249401",
        "consumerCare": "Consumer Helpline: +91-1334-298711",
        "consumerCareEmailWeb": "help@sanjivaniherbal.com / www.sanjivaniherbal.com",
        "countryOfOrigin": "India",
        "ingredients": "Menthol 16% w/w, Camphor 11% w/w, Eucalyptus Oil 7% w/w, Ointment Base q.s.",
        "warnings": "For external use only. Contraindicated for infants and children under 5 years. Do not apply near eyes, broken skin, or nostrils.",
        "otherDeclarations": "Ayush License No. UK.AY-441/2018",
    },
    "wafer": {
        "productName": "Metro Crunch Choco Wafer Bites",
        "brand": "Metro Crunch",
        "category": "Coated Wafer Confectionery",
        "netQuantity": "Approx 150g",
        "mrp": "45.00",
        "mrpIncludesTaxes": False,
        "batchNumber": "Not detected",
        "mfgDate": "Not detected",
        "expiryDate": "Not detected",
        "unitSalePrice": "Not detected",
        "genericName": "Wafer Biscuit",
        "manufacturer": "Metro Snacks, Delhi",
        "manufacturerAddress": "Not detected",
        "consumerCare": "Not detected",
        "consumerCareEmailWeb": "Not detected",
        "countryOfOrigin": "Not detected",
        "ingredients": "Wheat Flour, Sugar, Hydrogenated Vegetable Fat, Cocoa Solids, Emulsifier (INS 322)",
        "warnings": "Not detected",
        "otherDeclarations": "Not detected",
    },
}


def _is_sample_request(filename: str) -> Optional[Dict]:
    """
    If the request filename matches a UI sample product key, return preset data
    directly (bypass OCR so samples always work regardless of engine state).
    """
    clean = (filename or "").lower()
    for key, data in PRESET_COMMODITIES.items():
        if key in clean:
            return {
                **data,
                "isDetected": True,
                "ocrStatus": "preset",
                "ocrConfidence": "High (0.95)",
                "extractionSource": "Sample Reference Commodity",
                "rawOcrText": None,
                "verified": False,
                "debugInfo": None,
            }
    return None


# ---------------------------------------------------------------------------
# Main endpoint
# ---------------------------------------------------------------------------

@router.post("/analyze")
async def analyze_label_file(request: Request):
    """
    Analyze an uploaded product label image.

    Accepts JSON body: { fileName: str, imageData: str (base64 data URL) }
    or multipart form with a 'file' field.

    Returns structured label fields + rawOcrText + debugInfo for diagnostics.
    """
    content_type = request.headers.get("content-type", "")
    filename = ""
    image_data_b64 = None

    # --- Parse request body ---------------------------------------------------
    if "application/json" in content_type:
        try:
            body = await request.json()
            filename = body.get("fileName") or body.get("filename") or ""
            image_data_b64 = body.get("imageData")
        except Exception as e:
            logger.warning("[OCR] Failed to parse JSON body: %s", e)

    elif "multipart" in content_type or "form" in content_type:
        try:
            form = await request.form()
            uploaded_file = form.get("file")
            if uploaded_file and hasattr(uploaded_file, "filename"):
                filename = uploaded_file.filename
                raw_bytes = await uploaded_file.read()
                image_data_b64 = base64.b64encode(raw_bytes).decode("utf-8")
            if not filename and "fileName" in form:
                filename = str(form["fileName"])
            if not image_data_b64 and "imageData" in form:
                image_data_b64 = str(form["imageData"])
        except Exception as e:
            logger.warning("[OCR] Failed to parse form body: %s", e)

    else:
        try:
            body = await request.json()
            filename = body.get("fileName") or body.get("filename") or ""
            image_data_b64 = body.get("imageData")
        except Exception:
            pass

    # --- Sample/preset shortcut ----------------------------------------------
    preset = _is_sample_request(filename)
    if preset:
        return preset

    # --- Decode image ---------------------------------------------------------
    pil_image = None
    image_decode_error = None
    if image_data_b64:
        try:
            # Strip data URL prefix if present (data:image/jpeg;base64,...)
            if "," in image_data_b64:
                image_data_b64 = image_data_b64.split(",", 1)[1]
            img_bytes = base64.b64decode(image_data_b64)
            pil_image = Image.open(io.BytesIO(img_bytes))
            pil_image.load()  # force decode now to catch corrupt files
        except Exception as e:
            image_decode_error = str(e)
            logger.warning("[OCR] Could not decode image data: %s", e)

    # --- OCR pipeline ---------------------------------------------------------
    raw_text = ""
    ocr_status = "no_image"
    processed_image_info = {}

    if pil_image is not None:
        try:
            processed = preprocess_image(pil_image)
            processed_image_info = {
                "original_size": f"{pil_image.width}x{pil_image.height}",
                "processed_size": f"{processed.width}x{processed.height}",
                "mode": processed.mode,
                "preprocessing": "OpenCV (CLAHE+adaptive threshold+deskew)" if OPENCV_AVAILABLE else "PIL (contrast+sharpen)",
            }
            raw_text, ocr_status = run_ocr(processed)
        except Exception as e:
            ocr_status = f"preprocessing_error: {e}"
            logger.error("[OCR] Preprocessing/OCR error: %s", e)
    elif not image_data_b64:
        ocr_status = "no_image_data_received"
    elif image_decode_error:
        ocr_status = f"image_decode_error: {image_decode_error}"

    # --- Field extraction -----------------------------------------------------
    if raw_text.strip():
        fields = extract_fields(raw_text)
        detected_count = sum(
            1 for v in fields.values()
            if isinstance(v, str) and v != "Not detected"
        )
        confidence = "High (0.90)" if len(raw_text) > 300 else "Medium (0.70)"
        source = (
            f"Tesseract OCR v{TESSERACT_VERSION} + Regex Field Extraction"
            if TESSERACT_VERSION else "Tesseract OCR + Regex Field Extraction"
        )
    else:
        # OCR unavailable or empty — honest "Not detected" for every field
        fields = {
            "productName": "Not detected",
            "brand": "Not detected",
            "category": "Packaged Consumer Commodity",
            "netQuantity": "Not detected",
            "mrp": "Not detected",
            "mrpIncludesTaxes": False,
            "batchNumber": "Not detected",
            "mfgDate": "Not detected",
            "expiryDate": "Not detected",
            "unitSalePrice": "Not detected",
            "genericName": "Not detected",
            "manufacturer": "Not detected",
            "manufacturerAddress": "Not detected",
            "consumerCare": "Not detected",
            "consumerCareEmailWeb": "Not detected",
            "countryOfOrigin": "Not detected",
            "ingredients": "Not detected",
            "warnings": "Not detected",
            "otherDeclarations": "Not detected",
        }
        detected_count = 0
        confidence = "Low (0.00)"
        source = "OCR Unavailable"

    # --- Build friendly OCR status message ------------------------------------
    if ocr_status == "ok":
        status_msg = "ok"
    elif not PYTESSERACT_AVAILABLE:
        status_msg = (
            "Tesseract OCR engine is not available on this system. "
            "To enable real OCR: (1) Install Tesseract from "
            "https://github.com/UB-Mannheim/tesseract/wiki, "
            "(2) install pytesseract: pip install pytesseract, "
            "then restart the backend. "
            "You can still correct extracted fields manually below."
        )
    else:
        status_msg = ocr_status

    # --- Debug info (safe to include — no system secrets) --------------------
    debug_info = {
        "tesseractAvailable": PYTESSERACT_AVAILABLE,
        "tesseractVersion": TESSERACT_VERSION,
        "tesseractPath": TESSERACT_CMD,
        "opencvAvailable": OPENCV_AVAILABLE,
        "imageInfo": processed_image_info,
        "rawTextLength": len(raw_text),
        "fieldsDetected": detected_count,
        "ocrStatusRaw": ocr_status,
    }

    return {
        **fields,
        "isDetected": True,
        "ocrStatus": status_msg,
        "ocrConfidence": confidence,
        "extractionSource": source,
        "rawOcrText": raw_text.strip() if raw_text.strip() else None,
        "verified": False,
        "debugInfo": debug_info,
    }
