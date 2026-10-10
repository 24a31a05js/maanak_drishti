/**
 * Age Suitability Assessment Engine for Maanak Drishti
 * Evaluates product packaging declarations against age-appropriate safety criteria
 * using available product category, ingredients, warnings, and intended usage.
 *
 * Age Groups in 5-Year Intervals:
 * - 0–5 years (Infants & Toddlers)
 * - 5–10 years (Young Children)
 * - 10–15 years (Pre-Teens & Adolescents)
 * - 15–20 years (Teens & Young Adults)
 * - 20–25 years (Young Adults)
 * - 25–30 years (Adults)
 * - 30–35 years (Adults)
 * - 35–40 years (Adults)
 * - 40–45 years (Adults)
 * - 45–50 years (Adults)
 * - 50–55 years (Adults)
 * - 55–60 years (Adults)
 * - 60–65 years (Mature Adults)
 * - 65+ years (Senior Citizens / Final Group)
 *
 * Status Options:
 * - 'Suitable': Available evidence supports age suitability.
 * - 'Not Suitable': Available evidence indicates a relevant safety concern or restriction.
 * - 'Insufficient Information': Not enough reliable information to determine suitability.
 */

export const AGE_INTERVALS = [
  { id: '0-5', label: '0–5 years', stage: 'Infants & Toddlers' },
  { id: '5-10', label: '5–10 years', stage: 'Young Children' },
  { id: '10-15', label: '10–15 years', stage: 'Adolescents & Pre-Teens' },
  { id: '15-20', label: '15–20 years', stage: 'Teens & Young Adults' },
  { id: '20-25', label: '20–25 years', stage: 'Young Adults' },
  { id: '25-30', label: '25–30 years', stage: 'Adults' },
  { id: '30-35', label: '30–35 years', stage: 'Adults' },
  { id: '35-40', label: '35–40 years', stage: 'Adults' },
  { id: '40-45', label: '40–45 years', stage: 'Adults' },
  { id: '45-50', label: '45–50 years', stage: 'Adults' },
  { id: '50-55', label: '50–55 years', stage: 'Mature Adults' },
  { id: '55-60', label: '55–60 years', stage: 'Mature Adults' },
  { id: '60-65', label: '60–65 years', stage: 'Older Adults' },
  { id: '65-70', label: '65–70 years', stage: 'Senior Adults' },
  { id: '70-75', label: '70–75 years', stage: 'Senior Adults' },
  { id: '75-80', label: '75–80 years', stage: 'Elderly' },
  { id: '80-85', label: '80–85 years', stage: 'Elderly' },
  { id: '85-90', label: '85–90 years', stage: 'Advanced Age' },
  { id: '90-95', label: '90–95 years', stage: 'Advanced Age' },
];

/**
 * Identify product risk archetype from product name and declared attributes
 * @param {object} labelData
 */
function identifyProductArchetype(labelData = {}) {
  const text = `${labelData.productName || ''} ${labelData.genericName || ''} ${
    labelData.ingredients || ''
  } ${labelData.warnings || ''}`.toLowerCase();

  // Energy drink / High caffeine
  if (
    text.includes('energy drink') ||
    text.includes('caffeine') ||
    text.includes('taurine') ||
    text.includes('high caffeine')
  ) {
    return 'energy_caffeine';
  }

  // Medications / Pain relief / Topical ointments
  if (
    text.includes('balm') ||
    text.includes('pain relief') ||
    text.includes('ointment') ||
    text.includes('camphor') ||
    text.includes('menthol') ||
    text.includes('analgesic') ||
    text.includes('ayurvedic medicine')
  ) {
    return 'topical_medicine';
  }

  // Toys / Small items
  if (
    text.includes('toy') ||
    text.includes('game') ||
    text.includes('blocks') ||
    text.includes('choking') ||
    text.includes('small parts')
  ) {
    return 'toy_small_parts';
  }

  // Infant / Baby Food
  if (
    text.includes('infant') ||
    text.includes('baby') ||
    text.includes('toddler') ||
    text.includes('cereal for baby') ||
    text.includes('formula')
  ) {
    return 'infant_nutrition';
  }

  // General staple food (e.g. Atta, Rice, Pulses, Spices)
  if (
    text.includes('atta') ||
    text.includes('flour') ||
    text.includes('rice') ||
    text.includes('dal') ||
    text.includes('wheat') ||
    text.includes('grain') ||
    text.includes('salt') ||
    text.includes('sugar') ||
    text.includes('oil') ||
    text.includes('pure foods')
  ) {
    return 'staple_food';
  }

  // Packaged snack / Confectionery
  if (
    text.includes('biscuit') ||
    text.includes('chocolate') ||
    text.includes('cookie') ||
    text.includes('chips') ||
    text.includes('wafer') ||
    text.includes('snack')
  ) {
    return 'packaged_snack';
  }

  // Cleaning / Household Chemical
  if (
    text.includes('cleaner') ||
    text.includes('detergent') ||
    text.includes('bleach') ||
    text.includes('disinfectant') ||
    text.includes('poison')
  ) {
    return 'household_chemical';
  }

  // Cosmetics / Personal Care
  if (
    text.includes('shampoo') ||
    text.includes('soap') ||
    text.includes('lotion') ||
    text.includes('cream') ||
    text.includes('cosmetic')
  ) {
    return 'cosmetic_personal_care';
  }

  // Unknown / Insufficient specific classification
  return 'general_unclassified';
}

/**
 * Assess age suitability across each 5-year bracket
 * @param {object} labelData - Extracted label attributes
 * @returns {object} Detailed age suitability assessment
 */
export function assessAgeSuitability(labelData = {}) {
  const archetype = identifyProductArchetype(labelData);
  const productName = labelData.productName || 'Scanned Packaged Commodity';
  const hasSpecificWarnings = Boolean(labelData.warnings);

  const evaluations = AGE_INTERVALS.map((interval) => {
    switch (archetype) {
      case 'energy_caffeine': {
        if (interval.id === '0-5' || interval.id === '5-10' || interval.id === '10-15') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'High caffeine and stimulant content pose cardiovascular and neurological risks in children and pre-teens.',
            warnings: ['Statutory Warning: Not recommended for children under 18 years.'],
          };
        }
        if (interval.id === '15-20') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Dietary guidelines restrict energy beverages for adolescents under 18 due to cardiac stress and sleep disruption.',
            warnings: ['Consult pediatric or healthcare guidance before use.'],
          };
        }
        if (['65-70', '70-75', '75-80', '80-85', '85-90', '90-95'].includes(interval.id)) {
          return {
            interval,
            status: 'Insufficient Information',
            reason:
              'High stimulant load requires cardiovascular evaluation for senior adults with hypertension or underlying health conditions.',
            warnings: ['Senior caution: Potential interaction with prescription cardiovascular medications.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Formulated for adult consumption within daily recommended caffeine limits.',
          warnings: ['Do not exceed recommended daily serving. Do not mix with alcohol.'],
        };
      }

      case 'topical_medicine': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Contains active ingredients (camphor, menthol, or methyl salicylate) that are toxic if absorbed through infant skin or ingested.',
            warnings: ['Contraindicated for infants and children under 5 years.', 'Keep out of reach of children.'],
          };
        }
        if (interval.id === '5-10') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Risk of dermal irritation and accidental ingestion. Requires explicit pediatric prescription.',
            warnings: ['Do not apply to nostrils, broken skin, or mucous membranes.'],
          };
        }
        if (interval.id === '10-15') {
          return {
            interval,
            status: 'Insufficient Information',
            reason:
              'Suitability depends on active ingredient concentration and pediatric dosing instructions on package.',
            warnings: ['Use under adult supervision only.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Intended for external adult symptomatic pain relief per directions for use.',
          warnings: ['For external topical application only. Wash hands after use.'],
        };
      }

      case 'toy_small_parts': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Small detachable parts present acute choking hazard for children under 3 to 5 years (BIS / IS 9873 Safety Standard).',
            warnings: ['Choking Hazard: Small parts. Not suitable for children under 3 years.'],
          };
        }
        if (interval.id === '5-10' || interval.id === '10-15') {
          return {
            interval,
            status: 'Suitable',
            reason: 'Meets cognitive and developmental safety profile for school-age children.',
            warnings: ['Adult supervision recommended during assembly.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Safe for general handling; poses no developmental hazard for mature users.',
          warnings: [],
        };
      }

      case 'infant_nutrition': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Suitable',
            reason:
              'Specifically formulated for infant/toddler nutritional requirements (complies with IMS Act guidance for complementary feeding).',
            warnings: ['Mother’s milk is best for baby. Introduce solid/cereal foods only after 6 months.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Safe for consumption by older groups, though nutritionally tailored for infants.',
          warnings: ['Nutritional profile optimized for infant metabolic requirements.'],
        };
      }

      case 'staple_food': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Suitable',
            reason:
              'Safe for toddler diet when properly cooked and prepared as age-appropriate complementary food (from 6+ months).',
            warnings: ['Ensure thorough cooking. Raw grain flours should not be consumed.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Universal dietary staple suitable for general household population.',
          warnings: labelData.allergens ? [`Allergen notice: ${labelData.allergens}`] : [],
        };
      }

      case 'household_chemical': {
        if (interval.id === '0-5' || interval.id === '5-10' || interval.id === '10-15') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Toxic or corrosive household chemical substance. Severe poisoning and dermal hazard.',
            warnings: ['POISON / HAZARD: Keep out of reach of children.', 'Lock securely away from minors.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Intended for adult domestic handling following manufacturer protective safety directions.',
          warnings: ['Wear protective gloves. Use in well-ventilated area.'],
        };
      }

      case 'packaged_snack': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'High sodium, refined sugar, or choking shape (hard candies/nuts) unsuitable for infant/toddler digestive tracts.',
            warnings: ['Choking risk with hard snack pieces. Consult pediatric dietary guidelines.'],
          };
        }
        if (interval.id === '5-10') {
          return {
            interval,
            status: 'Suitable',
            reason: 'Suitable for occasional consumption under parental portion control.',
            warnings: ['Excess sugar or salt may contribute to pediatric dietary concerns.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'General consumer snack product.',
          warnings: labelData.allergens ? [`Contains: ${labelData.allergens}`] : [],
        };
      }

      case 'cosmetic_personal_care': {
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Not Suitable',
            reason:
              'Standard adult personal care formulations contain fragrances and surfactants not dermatologically tested for delicate infant skin.',
            warnings: ['Use specialized pediatric tear-free formulations for infants.'],
          };
        }
        if (interval.id === '5-10') {
          return {
            interval,
            status: 'Insufficient Information',
            reason:
              'Insufficient clinical data on dermal sensitivity for young children without dedicated pediatric testing label.',
            warnings: ['Perform patch test prior to full application on children.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Standard adult personal care application.',
          warnings: ['For external use only. Avoid contact with eyes.'],
        };
      }

      default: {
        // Unclassified / General commodity
        if (interval.id === '0-5') {
          return {
            interval,
            status: 'Insufficient Information',
            reason:
              'Label does not declare certified pediatric suitability or ingredient safety testing for infants and toddlers under 5 years.',
            warnings: ['Do not assume infant safety without explicit pediatric declaration.'],
          };
        }
        if (interval.id === '5-10') {
          return {
            interval,
            status: 'Insufficient Information',
            reason:
              'Packaging does not contain sufficient verified data regarding child usage, materials, or allergen disclosures.',
            warnings: ['Review physical package instructions before giving to children.'],
          };
        }
        return {
          interval,
          status: 'Suitable',
          reason: 'Standard consumer pre-packaged commodity intended for general adult handling.',
          warnings: hasSpecificWarnings ? [labelData.warnings] : [],
        };
      }
    }
  });

  return {
    productName,
    archetype,
    evaluations,
    disclaimer:
      'Legal Metrology compliance evaluates statutory label declarations and does not constitute a clinical, pediatric, or medical safety certification. Age suitability is determined based on declared category, ingredients, and standard safety precautions.',
    evaluatedAt: new Date().toISOString(),
  };
}
