type PAYEOptions = {
  includePension: boolean;
  includeNHF: boolean;
  includeNHIS: boolean;
  rentPaid: number;
  otherDeductions: number;
  is2026: boolean;
};

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
  } = options;

  /* ================= CRA ================= */
  const cra20Percent = grossIncome * 0.2;
  const craFixed = Math.max(200_000, grossIncome * 0.01);
  const CRA = cra20Percent + craFixed;

  /* ================= STATUTORY DEDUCTIONS ================= */
  const pension = includePension ? grossIncome * 0.08 : 0;
  const nhf = includeNHF ? grossIncome * 0.025 : 0;
  const nhis = includeNHIS ? grossIncome * 0.05 : 0;

  const rentRelief = Math.min(rentPaid * 0.2, 500_000);

  const totalDeductions =
    CRA +
    pension +
    nhf +
    nhis +
    rentRelief +
    otherDeductions;

  /* ================= TAXABLE INCOME ================= */
  const taxableIncome = Math.max(
    grossIncome - totalDeductions,
    0
  );

  /* ================= PAYE BANDS ================= */
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
  const breakdown: any[] = [];

  let lowerBound = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    const bandRange = band.limit - lowerBound;
    const taxableAtBand = Math.min(remaining, bandRange);
    const tax = taxableAtBand * band.rate;

    breakdown.push({
      range: `₦${lowerBound.toLocaleString()} - ₦${(
        lowerBound + taxableAtBand
      ).toLocaleString()}`,
      rate: `${band.rate * 100}%`,
      taxableAmount: taxableAtBand,
      tax,
    });

    annualTax += tax;
    remaining -= taxableAtBand;
    lowerBound = band.limit;
  }

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
    annualTax,
    monthlyTax: annualTax / 12,
    annualNet:
      grossIncome -
      annualTax -
      (pension + nhf + nhis + otherDeductions),
    breakdown,
  };
}
