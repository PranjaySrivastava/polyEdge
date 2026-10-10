export interface PaperPosition {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: "YES" | "NO";
  shares: number;
  entryPrice: number;           // Average purchase price ($0.01 - $0.99)
  currentPrice: number;         // Current valuation price
  totalCost: number;            // shares * entryPrice
  currentValue: number;         // shares * currentPrice
  unrealizedPnL: number;        // currentValue - totalCost
  unrealizedPnLPercent: number; // (unrealizedPnL / totalCost) * 100
  openedAt: string;
}

export interface PaperTradeHistory {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: "YES" | "NO";
  action: "BUY" | "SELL";
  shares: number;
  price: number;
  realizedPnL?: number;
  timestamp: string;
}

export interface PortfolioState {
  virtualCash: number;          // Default: $10,000.00
  startingBalance: number;      // $10,000.00
  openPositions: PaperPosition[];
  tradeHistory: PaperTradeHistory[];
  realizedPnL: number;
}
