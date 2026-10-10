"""
Legal Metrology Compliance Rule Engine Router
Rule 6 Declarations under Legal Metrology (Packaged Commodities) Rules, 2011.
"""

from typing import Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/compliance", tags=["Compliance"])

RULE_CITATIONS = {
    "MRP": "Rule 6(1)(e) - Retail Sale Price Declaration",
    "USP": "Rule 6(11) - Unit Sale Price Mandate",
    "NET_QTY": "Rule 6(1)(c) - Net Quantity SI Unit Declaration",
    "MANUFACTURER": "Rule 6(1)(a) & (b) - Manufacturer / Packer / Importer Identity",
    "MFG_DATE": "Rule 6(1)(d) - Month & Year of Packing / Manufacture",
    "CONSUMER_CARE": "Rule 6(1)(n) - Consumer Care Helpline & Redressal Mechanism",
    "GENERIC_NAME": "Rule 6(1)(f) - Common or Generic Commodity Name",
    "COUNTRY_OF_ORIGIN": "Rule 6(10) - Country of Origin Declaration",
}

class ComplianceRequest(BaseModel):
    productName: str = ""
    genericName: str = ""
    manufacturer: str = ""
    mrp: str = ""
    mrpIncludesTaxes: bool = False
    netQuantity: str = ""
    unitSalePrice: str = ""
    mfgDate: str = ""
    consumerCare: str = ""
    countryOfOrigin: str = ""

def is_detected(val: Any) -> bool:
    if not val:
        return False
    s = str(val).strip().lower()
    return s not in ["", "not detected", "unknown", "null", "none"]

@router.post("/evaluate")
@router.post("/verify")
def evaluate_compliance(payload: ComplianceRequest):
    data = payload.dict()
    findings: List[Dict[str, Any]] = []

    # 1. MRP - Rule 6(1)(e)
    mrp_val = data.get("mrp", "")
    if not is_detected(mrp_val):
        findings.append({
            "field": "Maximum Retail Price (MRP)",
            "rule": RULE_CITATIONS["MRP"],
            "status": "NEEDS REVIEW",
            "reason": "MRP declaration could not be detected from the scanned package.",
            "severity": "medium",
            "statutoryDetails": "Mandatory declaration of retail sale price inclusive of all taxes."
        })
    else:
        mrp_str = str(mrp_val).lower()
        has_tax = any(t in mrp_str for t in ["tax", "incl", "inclusive"]) or data.get("mrpIncludesTaxes")
        has_currency = any(c in mrp_str for c in ["₹", "rs", "inr"])
        
        if not has_currency:
            findings.append({
                "field": "Maximum Retail Price (MRP)",
                "rule": RULE_CITATIONS["MRP"],
                "status": "POTENTIAL VIOLATION",
                "reason": "Price was identified without standard currency symbol (₹ / Rs.).",
                "severity": "high",
                "statutoryDetails": "Rule 6(1)(e) requires unambiguous currency specification."
            })
        elif not has_tax:
            findings.append({
                "field": "Maximum Retail Price (MRP)",
                "rule": RULE_CITATIONS["MRP"],
                "status": "POTENTIAL VIOLATION",
                "reason": "Mandatory phrase 'Inclusive of all taxes' was not identified adjacent to MRP.",
                "severity": "high",
                "statutoryDetails": "Rule 6(1)(e) mandates explicit inclusion of all local and central taxes."
            })
        else:
            findings.append({
                "field": "Maximum Retail Price (MRP)",
                "rule": RULE_CITATIONS["MRP"],
                "status": "COMPLIANT",
                "reason": "MRP is clearly declared with currency and mandatory tax inclusion declaration.",
                "severity": "low",
                "statutoryDetails": f"Declared: {mrp_val}"
            })

    # 2. Net Quantity - Rule 6(1)(c)
    net_qty = data.get("netQuantity", "")
    if not is_detected(net_qty):
        findings.append({
            "field": "Net Quantity",
            "rule": RULE_CITATIONS["NET_QTY"],
            "status": "NEEDS REVIEW",
            "reason": "Net quantity declaration could not be confidently identified.",
            "severity": "medium",
            "statutoryDetails": "Mandatory declaration in standard SI metric units."
        })
    else:
        qty_str = str(net_qty).lower()
        prohibited = any(p in qty_str for p in ["approx", "when packed", "minimum", "min"])
        if prohibited:
            findings.append({
                "field": "Net Quantity",
                "rule": RULE_CITATIONS["NET_QTY"],
                "status": "POTENTIAL VIOLATION",
                "reason": "Contains non-standard or prohibited qualifying words (e.g. 'approximate').",
                "severity": "high",
                "statutoryDetails": "Prohibited qualification of statutory net weight."
            })
        else:
            findings.append({
                "field": "Net Quantity",
                "rule": RULE_CITATIONS["NET_QTY"],
                "status": "COMPLIANT",
                "reason": "Standard metric measurement units detected without prohibited qualifying expressions.",
                "severity": "low",
                "statutoryDetails": f"Declared: {net_qty}"
            })

    # 3. Unit Sale Price - Rule 6(11)
    usp = data.get("unitSalePrice", "")
    if not is_detected(usp):
        findings.append({
            "field": "Unit Sale Price (USP)",
            "rule": RULE_CITATIONS["USP"],
            "status": "NEEDS REVIEW",
            "reason": "Unit Sale Price not detected. Mandatory if net weight > 1 unit/kg/L.",
            "severity": "medium",
            "statutoryDetails": "Rule 6(11) mandate for price per unit measurement transparency."
        })
    else:
        findings.append({
            "field": "Unit Sale Price (USP)",
            "rule": RULE_CITATIONS["USP"],
            "status": "COMPLIANT",
            "reason": "Unit Sale Price declared for easy consumer price comparability.",
            "severity": "low",
            "statutoryDetails": f"Declared: {usp}"
        })

    # 4. Manufacturer - Rule 6(1)(a) & (b)
    mfr = data.get("manufacturer", "")
    if not is_detected(mfr):
        findings.append({
            "field": "Manufacturer / Packer Details",
            "rule": RULE_CITATIONS["MANUFACTURER"],
            "status": "NEEDS REVIEW",
            "reason": "Manufacturer, packer, or importer name and address could not be identified.",
            "severity": "medium",
            "statutoryDetails": "Mandatory declaration of corporate entity and registered manufacturing premises."
        })
    else:
        findings.append({
            "field": "Manufacturer / Packer Details",
            "rule": RULE_CITATIONS["MANUFACTURER"],
            "status": "COMPLIANT",
            "reason": "Manufacturer or packer entity identified on package label.",
            "severity": "low",
            "statutoryDetails": f"Declared: {mfr}"
        })

    # 5. Date of Packing / Manufacture - Rule 6(1)(d)
    mfg = data.get("mfgDate", "")
    if not is_detected(mfg):
        findings.append({
            "field": "Date of Packing / Manufacture",
            "rule": RULE_CITATIONS["MFG_DATE"],
            "status": "NEEDS REVIEW",
            "reason": "Date of packing or manufacture could not be read clearly.",
            "severity": "medium",
            "statutoryDetails": "Rule 6(1)(d) requires Month & Year (MM/YYYY) declaration."
        })
    else:
        findings.append({
            "field": "Date of Packing / Manufacture",
            "rule": RULE_CITATIONS["MFG_DATE"],
            "status": "COMPLIANT",
            "reason": "Month and year of packaging/manufacture clearly detected on package.",
            "severity": "low",
            "statutoryDetails": f"Declared: {mfg}"
        })

    # 6. Consumer Care Contact Details - Rule 6(1)(n)
    care = data.get("consumerCare", "")
    if not is_detected(care):
        findings.append({
            "field": "Consumer Care Contact Details",
            "rule": RULE_CITATIONS["CONSUMER_CARE"],
            "status": "NEEDS REVIEW",
            "reason": "Consumer grievance contact helpline (telephone / email / address) could not be identified.",
            "severity": "medium",
            "statutoryDetails": "Mandatory grievance redressal coordinates for consumer care."
        })
    else:
        findings.append({
            "field": "Consumer Care Contact Details",
            "rule": RULE_CITATIONS["CONSUMER_CARE"],
            "status": "COMPLIANT",
            "reason": "Consumer care contact points (helpline and/or email) detected on packaging.",
            "severity": "low",
            "statutoryDetails": f"Declared: {care}"
        })

    compliant_count = sum(1 for f in findings if f["status"] == "COMPLIANT")
    violation_count = sum(1 for f in findings if f["status"] == "POTENTIAL VIOLATION")
    review_count = sum(1 for f in findings if f["status"] == "NEEDS REVIEW")

    overall = "COMPLIANT"
    if violation_count > 0:
        overall = "POTENTIAL VIOLATION"
    elif review_count >= 3:
        overall = "NEEDS REVIEW"

    return {
        "overallStatus": overall,
        "findings": findings,
        "compliantCount": compliant_count,
        "violationCount": violation_count,
        "reviewCount": review_count,
        "isPreliminary": True
    }
