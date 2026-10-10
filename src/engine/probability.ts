/**
 * Probability analysis engine for PolyEdge.
 * Pure mathematical functions for converting market prices to probabilities,
 * calculating gross price differences, and validating boundary conditions.
 */

/**
 * Validates and clamps a price to a valid implied probability.
 * For a binary prediction contract, price $0.62 represents ~62% implied probability.
 */
export function impliedProbability(price: number): number | null {
  if (!Number.isFinite(price)) return null;
  if (price < 0 || price > 1) return null;
  return Number(price.toFixed(4));
}

/**
 * Calculates absolute gross price difference between two outcome prices.
 */
export function calculateGrossDifference(priceA: number, priceB: number): number {
  const pA = impliedProbability(priceA) ?? 0;
  const pB = impliedProbability(priceB) ?? 0;
  return Number(Math.abs(pA - pB).toFixed(4));
}

/**
 * Estimates execution friction (taker fees + dynamic slippage penalty based on liquidity).
 * Standard Polymarket taker fee is ~2.0% (0.02).
 * Slippage penalty scales inversely with market liquidity depth.
 */
export function calculateExecutionFriction(liquidity: number, baseFee: number = 0.020): {
  fee: number;
  slippage: number;
  totalFriction: number;
} {
  // Conservative dynamic slippage: higher penalty for thin books (< $25k)
  let slippage = 0.005; // 0.5% default baseline
  if (liquidity < 15000) {
    slippage = 0.025; // 2.5% slippage on illiquid books
  } else if (liquidity < 50000) {
    slippage = 0.012; // 1.2% slippage on moderate books
  } else if (liquidity > 250000) {
    slippage = 0.002; // 0.2% slippage on deep books
  }

  const totalFriction = Number((baseFee + slippage).toFixed(4));
  return {
    fee: baseFee,
    slippage,
    totalFriction,
  };
}

/**
 * Calculates net edge after accounting for platform fees and slippage.
 */
export function calculateNetEdge(grossDiff: number, totalFriction: number): number {
  return Number((grossDiff - totalFriction).toFixed(4));
}
