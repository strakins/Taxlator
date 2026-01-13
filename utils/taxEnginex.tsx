export type PAYEOptions = {
includePension: boolean;
includeNHF: boolean;
includeNHIS: boolean;
rentPaid: number;
otherDeductions: number;
is2026: boolean;
};

export interface TaxBreakdown {
range: string;
rate: string;
taxableAmount: number;
tax: number;
}

export function calculateNigeriaPAYE(
  grossIncome: number,
  options: PAYEOptions
) {
  const {
    includePension,
    includeNHF,
    includeNHIS,
    rentPaid,
    otherDeductions,
    is2026,
  } = options;

  /* ================= RELIEFS & DEDUCTIONS ================= */
  // 2026 LAW: CRA is abolished. Only statutory reliefs apply.
  const CRA = is2026 ? 0 : Math.max(200_000, grossIncome * 0.01) + (grossIncome * 0.2);

  const pension = includePension ? grossIncome * 0.08 : 0;
  const nhf = includeNHF ? grossIncome * 0.025 : 0;
  const nhis = includeNHIS ? grossIncome * 0.05 : 0;

  // Rent Relief: 20% of actual rent paid, capped at ₦500,000
  const rentRelief = Math.min(rentPaid * 0.2, 500_000);

  const totalDeductions =
    CRA +
    pension +
    nhf +
    nhis +
    rentRelief +
    otherDeductions;

  /* ================= TAXABLE INCOME ================= */
  const taxableIncome = Math.max(grossIncome - totalDeductions, 0);

  /* ================= 2026 OFFICIAL BANDS ================= */
  const bands = [
    { limit: 800_000, rate: 0 },
    { limit: 3_000_000, rate: 0.15 },
    { limit: 12_000_000, rate: 0.18 },
    { limit: 25_000_000, rate: 0.21 },
    { limit: 50_000_000, rate: 0.23 },
    { limit: Infinity, rate: 0.25 },
  ];

  let remaining = taxableIncome;
  let annualTax = 0;
  const breakdown: TaxBreakdown[] = [];
  let lowerBound = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    const bandRange = band.limit - lowerBound;
    const taxableAtBand = Math.min(remaining, bandRange);
    const tax = taxableAtBand * band.rate;

    if (taxableAtBand > 0 || band.rate === 0) {
      breakdown.push({
        range: `₦${lowerBound.toLocaleString()} - ₦${(band.limit === Infinity ? 'Above' : band.limit).toLocaleString()}`,
        rate: `${band.rate * 100}%`,
        taxableAmount: taxableAtBand,
        tax: Math.round(tax * 100) / 100,
      });
    }

    annualTax += tax;
    remaining -= taxableAtBand;
    lowerBound = band.limit;
  }

  // Minimum Tax Provision: 1% of Gross (Nigerian law safeguard)
  const minimumTax = grossIncome * 0.01;
  const finalAnnualTax = Math.max(annualTax, minimumTax);

  return {
    annualGross: grossIncome,
    CRA,
    deductions: {
      pension,
      nhf,
      nhis,
      rentRelief,
      otherDeductions,
      total: totalDeductions,
    },
    taxableIncome,
    annualTax: finalAnnualTax,
    monthlyTax: finalAnnualTax / 12,
    annualNet: grossIncome - finalAnnualTax - (pension + nhf + nhis + otherDeductions),
    breakdown,
  };
}