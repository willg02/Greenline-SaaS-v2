export type QuoteInput = {
  wagePerHour: number;
  plantsPerHour: Record<number, number>; // {3: 12, 7: 7, 10: 5, 15: 3.5, 25: 2}
  multipliers: Record<number, number>;   // {3: 15, 7: 15, 10: 16, 15: 20, 25: 18}
  counts: Record<number, number>;        // e.g., {3: 10, 7: 8, 15: 20}
  volumeTiers?: { threshold: number; discountPct: number }[];
};

export type QuoteResult = {
  lineLaborCost: number;
  grossTotal: number;
  discountedTotal: number;
  margin: number; // 0..1
  summary: { totalPlants: number; discountPct: number };
};
