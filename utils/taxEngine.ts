// utils/taxEngine.ts

export interface TaxResult {
  annualTax: number;
  monthlyTax: number;
  netIncome: number;
  taxableIncome: number;
  reliefAmount: number;
}

export const calculateNigeriaTax = (
  grossIncome: number,
  isPost2026: boolean,
  rentPaid: number = 0
): TaxResult => {

  // 1. Statutory Deduction: Pension (8% of Gross) - PRD Section 6.3
  const pension = grossIncome * 0.08;
  let remainingIncome = grossIncome - pension;
  let reliefAmount = 0;
  let taxableIncome = 0;

  if (isPost2026) {
    // NEW REGIME (2026 Nigeria Tax Act) - PRD Section 5.2 & 5.3
    // Rent Relief: 20% of rent, capped at 500k
    reliefAmount = Math.min(rentPaid * 0.20, 500000);

    // ₦800,000 annual tax-free threshold
    taxableIncome = remainingIncome - 800000 - reliefAmount;
  } else {
    // OLD REGIME (PITA) - PRD Section 6.2
    // CRA: 20% of gross + (Higher of 200k or 1% of gross)
    const cra = (grossIncome * 0.20) + Math.max(200000, grossIncome * 0.01);
    reliefAmount = cra;
    taxableIncome = remainingIncome - cra;
  }

  // Ensure taxable income doesn't go below zero
  taxableIncome = Math.max(0, taxableIncome);

  // 2. Apply Progressive Bands - PRD Section 5.3
  const annualTax = isPost2026
    ? apply2026Bands(taxableIncome)
    : applyOldBands(taxableIncome);

  return {
    annualTax,
    monthlyTax: annualTax / 12,
    netIncome: grossIncome - annualTax - pension,
    taxableIncome,
    reliefAmount
  };
};

// BAND LOGIC: 2026 REGIME
function apply2026Bands(amount: number): number {
  let tax = 0;
  if (amount <= 0) return 0;

  const bands = [
    { limit: 2200000, rate: 0.15 },  // 800k to 3m range
    { limit: 9000000, rate: 0.18 },  // 3m to 12m range
    { limit: 13000000, rate: 0.21 }, // 12m to 25m range
    { limit: 25000000, rate: 0.23 }, // 25m to 50m range
    { limit: Infinity, rate: 0.25 }  // Above 50m
  ];

  let remaining = amount;
  for (const band of bands) {
    const taxableAtThisRate = Math.min(remaining, band.limit);
    tax += taxableAtThisRate * band.rate;
    remaining -= taxableAtThisRate;
    if (remaining <= 0) break;
  }
  return tax;
}

// BAND LOGIC: PRE-2026 REGIME
function applyOldBands(amount: number): number {
  let tax = 0;
  const bands = [
    { limit: 300000, rate: 0.07 },
    { limit: 300000, rate: 0.11 },
    { limit: 500000, rate: 0.15 },
    { limit: 500000, rate: 0.19 },
    { limit: 1600000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 }
  ];

  let remaining = amount;
  for (const band of bands) {
    const taxableAtThisRate = Math.min(remaining, band.limit);
    tax += taxableAtThisRate * band.rate;
    remaining -= taxableAtThisRate;
    if (remaining <= 0) break;
  }
  return tax;
}