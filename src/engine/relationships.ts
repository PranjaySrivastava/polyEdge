import { MarketRelationship, RelationshipType } from '../types/market';

/**
 * Validates whether two prices satisfy a theoretical relationship constraint.
 */
export function validateRelationshipConstraint(
  type: RelationshipType,
  priceA: number,
  priceB: number
): {
  isViolated: boolean;
  delta: number;
  reason: string;
} {
  switch (type) {
    case 'equivalent': {
      // Equivalent contracts should trade at parity: P(A) = P(B)
      const diff = Math.abs(priceA - priceB);
      return {
        isViolated: diff > 0.02, // 2% tolerance for spread/fees
        delta: diff,
        reason: `Equivalent contracts observed with a ${(diff * 100).toFixed(1)}% price gap.`,
      };
    }
    case 'subset': {
      // If A is a subset of B (A implies B), then P(A) <= P(B).
      // Violation if P(A) > P(B)
      const violation = priceA - priceB;
      const isViolated = violation > 0.01;
      return {
        isViolated,
        delta: Math.max(0, violation),
        reason: isViolated
          ? `Subset outcome A is priced higher than parent outcome B by ${(violation * 100).toFixed(1)}%, violating logical inclusion.`
          : `Prices satisfy subset monotonicity constraint: P(A) <= P(B).`,
      };
    }
    case 'mutually_exclusive': {
      // If A and B cannot both occur, then P(A) + P(B) <= 1.00
      const sum = priceA + priceB;
      const isViolated = sum > 1.02; // Overpriced basket
      return {
        isViolated,
        delta: Math.abs(sum - 1.0),
        reason: isViolated
          ? `Mutually exclusive probabilities sum to ${(sum * 100).toFixed(1)}% (> 100%), presenting a potential overpriced short basket.`
          : `Probabilities sum to ${(sum * 100).toFixed(1)}% (within theoretical 100% boundary).`,
      };
    }
    case 'conditional': {
      return {
        isViolated: false,
        delta: Math.abs(priceA - priceB),
        reason: 'Conditional event dependency requires settlement state of underlying catalyst.',
      };
    }
    case 'unverified':
    default: {
      return {
        isViolated: false,
        delta: Math.abs(priceA - priceB),
        reason: 'Relationship between contracts has not been independently verified.',
      };
    }
  }
}

/**
 * Curated list of verified contractual relationships across benchmark prediction markets.
 * PolyEdge requires explicit verification rather than hallucinating relationship validity.
 */
export const VERIFIED_RELATIONSHIPS: MarketRelationship[] = [
  {
    id: 'rel-fed-rate-nov-2024',
    marketAId: 'poly-fed-rate-cut-nov',
    marketBId: 'poly-fed-rate-target-475',
    outcomeA: 'YES',
    outcomeB: 'YES',
    type: 'subset',
    logicalConstraint: 'P(Fed Rate Cut >= 50bps) <= P(Target Rate <= 4.75%)',
    oracleA: 'Federal Reserve FOMC Official Statement',
    oracleB: 'CME FedWatch Benchmark Settlement',
    verified: true,
    notes: 'A 50bps cut mechanically implies the target band falls to or below 4.75%. Market A price cannot exceed Market B without arbitrage friction.',
  },
  {
    id: 'rel-btc-100k-eoy',
    marketAId: 'poly-btc-100k-dec31',
    marketBId: 'poly-btc-reach-100k-2024',
    outcomeA: 'YES',
    outcomeB: 'YES',
    type: 'equivalent',
    logicalConstraint: 'P(BTC touches $100k before 2025) == P(BTC >= $100k in 2024)',
    oracleA: 'Binance / Coinbase Pro 1-Minute Midpoint Index',
    oracleB: 'CoinGecko Daily Close Index',
    verified: true,
    notes: 'Both contracts settle to YES if Bitcoin trades at or above $100,000 USD before January 1, 2025. Minor oracle index difference.',
  },
  {
    id: 'rel-us-pres-winner-popular',
    marketAId: 'poly-pres-electoral-dem',
    marketBId: 'poly-pres-popular-vote-dem',
    outcomeA: 'YES',
    outcomeB: 'YES',
    type: 'subset',
    logicalConstraint: 'Electoral College outcome correlates heavily with Popular Vote distribution',
    oracleA: 'Joint Session Congressional Certification',
    oracleB: 'Associated Press Official Popular Vote Count',
    verified: false,
    notes: 'Electoral victory does not guarantee winning the popular vote. Historical divergences exist (2000, 2016). High divergence flagged for review.',
  },
  {
    id: 'rel-eth-sol-flip',
    marketAId: 'poly-sol-flip-eth-cap-2024',
    marketBId: 'poly-sol-market-cap-250b',
    outcomeA: 'YES',
    outcomeB: 'YES',
    type: 'conditional',
    logicalConstraint: 'Flipping ETH requires SOL market cap >= ETH market cap',
    oracleA: 'CoinMarketCap Total Diluted Market Cap',
    oracleB: 'CoinMarketCap Circulating Market Cap',
    verified: true,
    notes: 'Conditionality: SOL cannot flip ETH without reaching substantial market cap milestones based on ETH baseline valuation.',
  },
];
