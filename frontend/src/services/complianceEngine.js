/**
 * Legal Metrology Compliance Engine for Maanak Drishti
 * Evaluates extracted product packaging declarations against the
 * Legal Metrology (Packaged Commodities) Rules, 2011 (as amended).
 *
 * Categorizes findings strictly into:
 * - COMPLIANT: Mandatory declaration criteria detected and properly formatted.
 * - POTENTIAL VIOLATION: Affirmative deviation, non-standard unit, or explicit violation found.
 * - NEEDS REVIEW: Declaration missing, partially obscured, or OCR confidence insufficient.
 */

export const RULE_CITATIONS = {
  MRP: 'Rule 6(1)(e) - Retail Sale Price Declaration',
  USP: 'Rule 6(11) - Unit Sale Price Mandate',
  NET_QTY: 'Rule 6(1)(c) - Net Quantity SI Unit Declaration',
  MANUFACTURER: 'Rule 6(1)(a) & (b) - Manufacturer / Packer / Importer Identity',
  MFG_DATE: 'Rule 6(1)(d) - Month & Year of Packing / Manufacture',
  CONSUMER_CARE: 'Rule 6(1)(n) - Consumer Care Helpline & Redressal Mechanism',
  GENERIC_NAME: 'Rule 6(1)(f) - Common or Generic Commodity Name',
  COUNTRY_OF_ORIGIN: 'Rule 6(10) - Country of Origin Declaration',
};

/**
 * Clean and normalize detected strings
 */
function isDetected(val) {
  if (!val) return false;
  const s = val.toString().trim().toLowerCase();
  return s !== '' && s !== 'not detected' && s !== 'unknown' && s !== 'null' && s !== 'none';
}

/**
 * Validate Legal Metrology Declarations
 * @param {object} labelData - Extracted label attributes
 * @returns {object} Full compliance report
 */
export function evaluateLabelCompliance(labelData = {}) {
  const findings = [];

  // 1. MAXIMUM RETAIL PRICE (MRP) - Rule 6(1)(e)
  const mrpVal = labelData.mrp;
  if (!isDetected(mrpVal)) {
    findings.push({
      field: 'Maximum Retail Price (MRP)',
      rule: RULE_CITATIONS.MRP,
      status: 'NEEDS REVIEW',
      reason:
        'MRP declaration could not be detected from the scanned package. Requires manual verification to ensure retail price is printed.',
      severity: 'medium',
      statutoryDetails: 'Mandatory declaration of retail sale price inclusive of all taxes.',
    });
  } else {
    const mrpStr = mrpVal.toString().toLowerCase();
    const hasTaxPhrase =
      mrpStr.includes('tax') ||
      mrpStr.includes('incl') ||
      mrpStr.includes('inclusive') ||
      labelData.mrpIncludesTaxes;
    const hasCurrencySymbol =
      mrpStr.includes('₹') || mrpStr.includes('rs') || mrpStr.includes('inr');

    if (!hasCurrencySymbol) {
      findings.push({
        field: 'Maximum Retail Price (MRP)',
        rule: RULE_CITATIONS.MRP,
        status: 'POTENTIAL VIOLATION',
        reason:
          'Price was identified without standard Indian Rupee symbol (₹ / Rs.). Currency indicator is mandatory.',
        severity: 'high',
        statutoryDetails: 'Rule 6(1)(e) requires unambiguous currency specification.',
      });
    } else if (!hasTaxPhrase) {
      findings.push({
        field: 'Maximum Retail Price (MRP)',
        rule: RULE_CITATIONS.MRP,
        status: 'POTENTIAL VIOLATION',
        reason:
          'Mandatory statutory phrase "Inclusive of all taxes" (or "Incl. of all taxes") was not identified adjacent to MRP.',
        severity: 'high',
        statutoryDetails:
          'Rule 6(1)(e) mandates explicit inclusion of all local and central taxes.',
      });
    } else {
      findings.push({
        field: 'Maximum Retail Price (MRP)',
        rule: RULE_CITATIONS.MRP,
        status: 'COMPLIANT',
        reason:
          'MRP is clearly declared with currency and mandatory tax inclusion declaration.',
        severity: 'low',
        statutoryDetails: `Declared: ${mrpVal}`,
      });
    }
  }

  // 2. NET QUANTITY - Rule 6(1)(c)
  const netQtyVal = labelData.netQuantity;
  if (!isDetected(netQtyVal)) {
    findings.push({
      field: 'Net Quantity',
      rule: RULE_CITATIONS.NET_QTY,
      status: 'NEEDS REVIEW',
      reason:
        'Net quantity declaration could not be confidently identified from the package label image.',
      severity: 'medium',
      statutoryDetails: 'Mandatory declaration in standard SI metric units.',
    });
  } else {
    const qtyStr = netQtyVal.toString().toLowerCase();
    const hasProhibitedWords =
      qtyStr.includes('approx') ||
      qtyStr.includes('when packed') ||
      qtyStr.includes('min') ||
      qtyStr.includes('minimum');
    const validMetricUnits = ['g', 'kg', 'ml', 'l', 'ltr', 'litre', 'liter', 'gram', 'pieces', 'n', 'u'];
    const hasMetricUnit = validMetricUnits.some((u) => new RegExp(`\\b${u}\\b|\\d+${u}`).test(qtyStr));

    if (hasProhibitedWords) {
      findings.push({
        field: 'Net Quantity',
        rule: RULE_CITATIONS.NET_QTY,
        status: 'POTENTIAL VIOLATION',
        reason:
          'Contains non-standard or prohibited qualifying words such as "approximate" or "when packed", in violation of Rule 11.',
        severity: 'high',
        statutoryDetails: 'Prohibited qualification of statutory net weight.',
      });
    } else if (!hasMetricUnit) {
      findings.push({
        field: 'Net Quantity',
        rule: RULE_CITATIONS.NET_QTY,
        status: 'NEEDS REVIEW',
        reason:
          'Quantity detected but standard SI metric units (g, kg, ml, L, N) could not be verified with high confidence.',
        severity: 'medium',
        statutoryDetails: `Declared: ${netQtyVal}`,
      });
    } else {
      findings.push({
        field: 'Net Quantity',
        rule: RULE_CITATIONS.NET_QTY,
        status: 'COMPLIANT',
        reason: 'Standard metric measurement units detected without prohibited qualifying expressions.',
        severity: 'low',
        statutoryDetails: `Declared: ${netQtyVal}`,
      });
    }
  }

  // 3. UNIT SALE PRICE (USP) - Rule 6(11)
  const uspVal = labelData.unitSalePrice;
  if (!isDetected(uspVal)) {
    findings.push({
      field: 'Unit Sale Price (USP)',
      rule: RULE_CITATIONS.USP,
      status: 'NEEDS REVIEW',
      reason:
        'Unit Sale Price (e.g. ₹ per g / ₹ per ml) not detected. If package net quantity is > 1 unit, 1 kg, or 1 L, Unit Sale Price is mandatory.',
      severity: 'medium',
      statutoryDetails: 'Rule 6(11) mandate for price per unit measurement transparency.',
    });
  } else {
    findings.push({
      field: 'Unit Sale Price (USP)',
      rule: RULE_CITATIONS.USP,
      status: 'COMPLIANT',
      reason: 'Unit Sale Price declared for easy consumer price comparability.',
      severity: 'low',
      statutoryDetails: `Declared: ${uspVal}`,
    });
  }

  // 4. MANUFACTURER / PACKER / IMPORTER - Rule 6(1)(a) & (b)
  const mfrVal = labelData.manufacturer;
  if (!isDetected(mfrVal)) {
    findings.push({
      field: 'Manufacturer / Packer Details',
      rule: RULE_CITATIONS.MANUFACTURER,
      status: 'NEEDS REVIEW',
      reason:
        'Manufacturer, packer, or importer name and address could not be identified from the label.',
      severity: 'medium',
      statutoryDetails: 'Mandatory declaration of corporate entity and registered manufacturing premises.',
    });
  } else {
    const mfrStr = mfrVal.toString();
    const hasAddressKeywords =
      /pvt|ltd|mfd|packed|plot|road|industrial|nagar|state|pin|\b\d{6}\b/i.test(mfrStr);

    if (mfrStr.length < 5) {
      findings.push({
        field: 'Manufacturer / Packer Details',
        rule: RULE_CITATIONS.MANUFACTURER,
        status: 'NEEDS REVIEW',
        reason:
          'Manufacturer identifier appears incomplete or truncated. Full corporate address requires review.',
        severity: 'medium',
        statutoryDetails: `Detected: ${mfrVal}`,
      });
    } else {
      findings.push({
        field: 'Manufacturer / Packer Details',
        rule: RULE_CITATIONS.MANUFACTURER,
        status: 'COMPLIANT',
        reason: hasAddressKeywords
          ? 'Manufacturer or packer name and facility address identified.'
          : 'Manufacturer or packer entity identified on package label.',
        severity: 'low',
        statutoryDetails: `Declared: ${mfrVal}`,
      });
    }
  }

  // 5. DATE OF MANUFACTURE OR PACKING - Rule 6(1)(d)
  const mfgDateVal = labelData.mfgDate;
  if (!isDetected(mfgDateVal)) {
    findings.push({
      field: 'Date of Packing / Manufacture',
      rule: RULE_CITATIONS.MFG_DATE,
      status: 'NEEDS REVIEW',
      reason:
        'Date of packing or manufacture could not be read clearly. Month and year declaration is statutory.',
      severity: 'medium',
      statutoryDetails: 'Rule 6(1)(d) requires Month & Year (MM/YYYY) declaration.',
    });
  } else {
    findings.push({
      field: 'Date of Packing / Manufacture',
      rule: RULE_CITATIONS.MFG_DATE,
      status: 'COMPLIANT',
      reason: 'Month and year of packaging/manufacture clearly detected on package.',
      severity: 'low',
      statutoryDetails: `Declared: ${mfgDateVal}`,
    });
  }

  // 6. CONSUMER CARE HELPLINE & EMAIL - Rule 6(1)(n)
  const consumerCareVal = labelData.consumerCare;
  if (!isDetected(consumerCareVal)) {
    findings.push({
      field: 'Consumer Care Contact Details',
      rule: RULE_CITATIONS.CONSUMER_CARE,
      status: 'NEEDS REVIEW',
      reason:
        'Consumer grievance contact helpline (telephone / email / address) could not be identified.',
      severity: 'medium',
      statutoryDetails: 'Mandatory grievance redressal coordinates for consumer care.',
    });
  } else {
    const careStr = consumerCareVal.toString().toLowerCase();
    const hasPhone = /\d{8,12}|\b\d{4}-\d{3}-\d{4}\b/i.test(careStr) || careStr.includes('tel') || careStr.includes('phone') || careStr.includes('toll');
    const hasEmail = careStr.includes('@') || careStr.includes('email') || careStr.includes('care');

    if (hasPhone || hasEmail) {
      findings.push({
        field: 'Consumer Care Contact Details',
        rule: RULE_CITATIONS.CONSUMER_CARE,
        status: 'COMPLIANT',
        reason: 'Consumer care contact points (helpline and/or email) detected on packaging.',
        severity: 'low',
        statutoryDetails: `Declared: ${consumerCareVal}`,
      });
    } else {
      findings.push({
        field: 'Consumer Care Contact Details',
        rule: RULE_CITATIONS.CONSUMER_CARE,
        status: 'NEEDS REVIEW',
        reason: 'Consumer care contact text found, but phone/email could not be parsed with high confidence.',
        severity: 'medium',
        statutoryDetails: `Detected: ${consumerCareVal}`,
      });
    }
  }

  // 7. GENERIC / COMMON COMMODITY NAME - Rule 6(1)(f)
  const genericNameVal = labelData.genericName || labelData.productName;
  if (!isDetected(genericNameVal)) {
    findings.push({
      field: 'Common / Generic Commodity Name',
      rule: RULE_CITATIONS.GENERIC_NAME,
      status: 'NEEDS REVIEW',
      reason:
        'Generic commodity identity could not be isolated from packaging branding.',
      severity: 'medium',
      statutoryDetails: 'Rule 6(1)(f) requires explicit generic description of commodity.',
    });
  } else {
    findings.push({
      field: 'Common / Generic Commodity Name',
      rule: RULE_CITATIONS.GENERIC_NAME,
      status: 'COMPLIANT',
      reason: 'Commodity name or generic product description identified.',
      severity: 'low',
      statutoryDetails: `Declared: ${genericNameVal}`,
    });
  }

  // 8. COUNTRY OF ORIGIN - Rule 6(10)
  const originVal = labelData.countryOfOrigin;
  if (isDetected(originVal)) {
    findings.push({
      field: 'Country of Origin',
      rule: RULE_CITATIONS.COUNTRY_OF_ORIGIN,
      status: 'COMPLIANT',
      reason: 'Country of origin is declared on pre-packaged commodity.',
      severity: 'low',
      statutoryDetails: `Declared: ${originVal}`,
    });
  } else {
    findings.push({
      field: 'Country of Origin',
      rule: RULE_CITATIONS.COUNTRY_OF_ORIGIN,
      status: 'NEEDS REVIEW',
      reason:
        'Country of origin statement not identified. (Mandatory for imported pre-packaged goods).',
      severity: 'low',
      statutoryDetails: 'Rule 6(10) declaration checklist.',
    });
  }

  // Aggregate stats
  const compliantCount = findings.filter((f) => f.status === 'COMPLIANT').length;
  const violationCount = findings.filter((f) => f.status === 'POTENTIAL VIOLATION').length;
  const reviewCount = findings.filter((f) => f.status === 'NEEDS REVIEW').length;

  let overallStatus = 'COMPLIANT';
  if (violationCount > 0) {
    overallStatus = 'POTENTIAL VIOLATION';
  } else if (reviewCount >= 3) {
    overallStatus = 'NEEDS REVIEW';
  }

  return {
    overallStatus,
    findings,
    compliantCount,
    violationCount,
    reviewCount,
    evaluatedAt: new Date().toISOString(),
    isPreliminary: true,
  };
}

/**
 * Generate a clear, plain-language explanation of the extracted product declarations
 * and legal compliance determination under Legal Metrology Rules, 2011.
 *
 * @param {object} labelData - Extracted label attributes
 * @param {object} [compliance] - Optional pre-computed compliance report
 * @returns {object} Simple language explanation
 */
export function explainLabelInSimpleTerms(labelData = {}, compliance = null) {
  const comp = compliance || evaluateLabelCompliance(labelData);

  // Status mapping
  let status = 'Needs Review';
  if (comp.overallStatus === 'COMPLIANT') status = 'Compliant';
  else if (comp.overallStatus === 'POTENTIAL VIOLATION') status = 'Potential Violation';
  else status = 'Needs Review';

  // Gather what is declared vs missing
  const detectedList = [];
  const missingList = [];

  const check = (fieldName, val, ruleDesc) => {
    if (isDetected(val)) {
      detectedList.push({ name: fieldName, value: val });
    } else {
      missingList.push({ name: fieldName, rule: ruleDesc });
    }
  };

  check('Product Name', labelData.productName, 'Statutory identification of commodity');
  check('Brand', labelData.brand, 'Commercial brand identity');
  check('Net Quantity', labelData.netQuantity, 'Rule 6(1)(c) - Net weight or volume in standard metric units');
  check('Maximum Retail Price (MRP)', labelData.mrp, 'Rule 6(1)(e) - Retail price inclusive of all taxes');
  check('Date of Packing/Mfg', labelData.mfgDate, 'Rule 6(1)(d) - Month & Year of packing');
  check('Expiry / Best-Before Date', labelData.expiryDate, 'Consumer safety shelf-life declaration');
  check('Batch / Lot Number', labelData.batchNumber, 'Traceability coding');
  check('Manufacturer / Packer', labelData.manufacturer, 'Rule 6(1)(a) - Name and address of responsible packer');
  check('Consumer Care Helpline', labelData.consumerCare, 'Rule 6(1)(n) - Grievance redressal phone & address');

  // Reason for status
  let reasonExplanation = '';
  if (status === 'Compliant') {
    reasonExplanation =
      'All key statutory packaging declarations (MRP inclusive of all taxes, standard metric net quantity, packing date, and manufacturer coordinates) were clearly detected on the label and appear to conform with Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011.';
  } else if (status === 'Potential Violation') {
    const violations = comp.findings.filter((f) => f.status === 'POTENTIAL VIOLATION');
    const vReasons = violations.map((v) => v.reason).join(' ');
    reasonExplanation = `One or more statutory deviations were detected on the label: ${vReasons}. Under Indian Legal Metrology regulations, non-standard units, unstated tax inclusions, or missing mandatory manufacturer addresses represent potential legal non-compliance.`;
  } else {
    reasonExplanation = `Several mandatory declarations could not be detected with confidence by the optical scanner (${missingList
      .map((m) => m.name)
      .slice(0, 3)
      .join(', ')}). This indicates that the photo was blurry, partially obscured, or cropped. This is an OCR reading limitation and must be distinguished from an actual legal violation until physically confirmed on the product.`;
  }

  return {
    status,
    productSummary: {
      name: isDetected(labelData.productName) ? labelData.productName : 'Packaged Commodity (Unreadable Name)',
      brand: isDetected(labelData.brand) ? labelData.brand : 'Not detected',
      category: isDetected(labelData.category) ? labelData.category : 'Packaged Consumer Good',
      netQuantity: isDetected(labelData.netQuantity) ? labelData.netQuantity : 'Not detected',
      mrp: isDetected(labelData.mrp) ? labelData.mrp : 'Not detected',
      mrpIncludesTaxes: Boolean(labelData.mrpIncludesTaxes),
      mfgDate: isDetected(labelData.mfgDate) ? labelData.mfgDate : 'Not detected',
      expiryDate: isDetected(labelData.expiryDate) ? labelData.expiryDate : 'Not detected',
      batchNumber: isDetected(labelData.batchNumber) ? labelData.batchNumber : 'Not detected',
      manufacturer: isDetected(labelData.manufacturer) ? labelData.manufacturer : 'Not detected',
      manufacturerAddress: isDetected(labelData.manufacturerAddress) ? labelData.manufacturerAddress : 'Not detected',
      consumerCare: isDetected(labelData.consumerCare) ? labelData.consumerCare : 'Not detected',
      consumerCareEmailWeb: isDetected(labelData.consumerCareEmailWeb) ? labelData.consumerCareEmailWeb : 'Not detected',
      ingredients: isDetected(labelData.ingredients) ? labelData.ingredients : 'Not detected',
      warnings: isDetected(labelData.warnings) ? labelData.warnings : 'Not detected',
      otherDeclarations: isDetected(labelData.otherDeclarations) ? labelData.otherDeclarations : 'Not detected',
    },
    missingDetails: missingList,
    detectedDetails: detectedList,
    reasonExplanation,
    isOcrLimitation: status === 'Needs Review',
    statutoryFindings: comp.findings,
  };
}
