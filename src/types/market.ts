export interface MarketOutcome {
  name: string;        // "YES" | "NO" | Title
  price: number;       // Implied probability [0.00 - 1.00]
  bestBid?: number;    // Highest buyer bid
  bestAsk?: number;    // Lowest seller ask
}

export interface Market {
  id: string;
  conditionId?: string;
  slug: string;
  question: string;
  description: string;
  category: "Politics" | "Crypto" | "Economics" | "Technology" | "Culture";
  outcomes: MarketOutcome[];
  volume24h: number;
  liquidity: number;
  endDate: string;
  resolutionSource: string;
  resolutionRules: string;
  source: "live" | "demo";
  updatedAt: string;
  sparkline?: number[]; // Recent price trend
}

export type RelationshipType = 
  | "equivalent"          // Identical settlement conditions across platforms/contracts
  | "subset"              // Outcome A logically implies Outcome B (P(A) <= P(B))
  | "mutually_exclusive"  // Outcome A and Outcome B cannot both happen (P(A) + P(B) <= 1)
  | "conditional"         // Outcome A depends on event B occurring
  | "unverified";         // Suggested correlation, not mathematically guaranteed

export interface MarketRelationship {
  id: string;
  marketAId: string;
  marketBId: string;
  outcomeA: string;
  outcomeB: string;
  type: RelationshipType;
  logicalConstraint: string; // e.g. "P(A) <= P(B)"
  oracleA: string;
  oracleB: string;
  verified: boolean;
  notes: string;
}

export type FindingStatus = 
  | "interesting"        // Positive edge after fees with verified relationship
  | "needs_review"       // Discrepancy detected but unverified relationship or oracle mismatch
  | "insufficient_data"; // Missing spread or depth

export interface ScannerFinding {
  id: string;
  relationship: MarketRelationship;
  marketA: Market;
  marketB: Market;
  priceA: number;
  priceB: number;
  grossDifference: number;   // |priceA - priceB|
  estimatedFees: number;     // estimated taker fee (e.g., 2% on Polymarket fees/gas)
  estimatedSlippage: number; // based on order book depth
  netEdge: number;           // grossDifference - (fees + slippage)
  status: FindingStatus;
  explanation: string;
  risks: string[];
  detectedAt: string;
}
