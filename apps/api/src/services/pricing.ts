import type { QuoteInput, QuoteResult } from "@greenline/types";

export function calcQuote(input: QuoteInput): QuoteResult {
  let laborCostTotal = 0;
  let grossTotal = 0;

  for (const size of Object.keys(input.counts).map(Number)) {
    const count = input.counts[size] || 0;
    const pph = input.plantsPerHour[size];
    const mult = input.multipliers[size];

    const laborPerPlant = input.wagePerHour / pph; // dollars
    const flatRate = laborPerPlant * mult; // market-adjusted
    const lineLabor = laborPerPlant * count;
    const lineGross = flatRate * count;

    laborCostTotal += lineLabor;
    grossTotal += lineGross;
  }

  const totalPlants = Object.values(input.counts).reduce((a, b) => a + b, 0);
  const discountPct =
    input.volumeTiers?.sort((a, b) => a.threshold - b.threshold)
      .reduce((acc, t) => (totalPlants >= t.threshold ? t.discountPct : acc), 0) || 0;

  const discountedTotal = grossTotal * (1 - discountPct / 100);
  const margin = discountedTotal > 0 ? (discountedTotal - laborCostTotal) / discountedTotal : 0;

  return {
    lineLaborCost: laborCostTotal,
    grossTotal,
    discountedTotal,
    margin,
    summary: { totalPlants, discountPct }
  };
}
