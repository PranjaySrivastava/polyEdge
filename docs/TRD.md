# PolyEdge — Technical Requirements Document (TRD)

**Project Name:** PolyEdge  
**Target Environment:** Modern Web Browsers (Chrome, Firefox, Safari, Edge), Mobile & Desktop Responsive  
**Build & Runtime Stack:** React 18+, Vite, TypeScript 5+, Tailwind CSS 3+, Lucide React, Recharts  

---

## 1. System Architecture

PolyEdge is structured as a modular, pure client-side quantitative terminal with strict separation between **Data Ingestion**, **Analytical Engine**, **State Store**, and **Presentation Layer**.

```
+-----------------------------------------------------------------------------------+
|                                  POLYEDGE TERMINAL                                |
+-----------------------------------------------------------------------------------+
|  PRESENTATION LAYER (React + Tailwind CSS + Lucide + Recharts)                    |
|  - Dashboard Overview   - Market Explorer   - Edge Scanner    - Copilot           |
|  - Paper Portfolio      - Explain Modal     - Order Slip      - Metric Tickers    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|  APPLICATION STATE & HOOKS (React Context / Custom Hooks)                         |
|  - useMarkets: Active market feed, filters, search, live/demo toggle              |
|  - useScanner: Findings generator, delta calculator, relationship evaluator       |
|  - usePortfolio: Virtual ledger, orders, open positions, realized/unrealized P&L  |
|  - useCopilot: Deterministic intent parser, structured query dispatcher           |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|  DETERMINISTIC ANALYSIS ENGINE (Pure TypeScript Functions)                        |
|  - probability.ts: Implied probabilities, complement checks, clamping             |
|  - relationships.ts: Verification rules, relationship matrix, oracle compatibility|
|  - scanner.ts: Pairwise matrix scanner, fee/spread deduction, status classifier   |
|  - paperTrading.ts: Mark-to-market valuation, order execution, P&L formulas       |
+-----------------------------------------------------------------------------------+
                    │                                    │
                    ▼                                    ▼
+------------------------------------+  +-------------------------------------------+
|  DATA ACCESS LAYER                 |  |  PERSISTENCE LAYER (Browser LocalStorage) |
|  - Polymarket Gamma API Client     |  |  - `polyedge_portfolio_v1`                |
|  - Polymarket CLOB Book Client     |  |  - `polyedge_settings_v1`                 |
|  - Curated Demo Dataset Fallback   |  |  - Schema validation on boot via Zod      |
+------------------------------------+  +-------------------------------------------+
```

---

## 2. Technology Stack & Dependencies

| Tool / Library | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **Vite** | `^5.x` | Ultra-fast HMR and production bundle optimization. |
| **React** | `^18.x` | Component-based interactive UI with concurrent rendering. |
| **TypeScript** | `^5.x` | Strict type safety across financial structures and calculations. |
| **Tailwind CSS** | `^3.x` | Rapid utility-first styling for dark quantitative terminal aesthetic. |
| **Lucide React** | `^0.4x` | Modern, clean vector iconography for financial indicators. |
| **Recharts** | `^2.x` | Composable charting for probability comparisons and portfolio equity. |
| **Zod** | `^3.x` | Runtime validation for local storage and API responses. |
| **Vitest** | `^1.x` | Blazing-fast unit testing framework for analytical calculations. |

---

## 3. Data Ingestion & Polymarket API Integration

### 3.1 Polymarket Endpoints
1. **Gamma Markets API (Discovery & Metadata):**
   - URL: `https://gamma-api.polymarket.com/markets`
   - Parameters: `?limit=50&active=true&closed=false&order=volume24hr&ascending=false`
   - Data extracted: Market ID, Question, Description, Outcome tokens, 24h Volume, Liquidity, Resolution source, End date.
2. **Polymarket CLOB API (Order Books & Prices):**
   - URL: `https://clob.polymarket.com/midpoint?token_id={token_id}` or `price?token_id={token_id}&side=buy`
   - Data extracted: Midpoint price, best bid, best ask, current spread.

### 3.2 Dual-Mode Architecture & CORS Fallback
Public web applications calling Polymarket directly from browser clients can experience CORS restrictions or API rate limits.
- **Live Mode:** PolyEdge attempts fetching from public endpoints.
- **Demo Mode Fallback:** If live calls fail, encounter network errors, or if the user toggles Demo Mode, PolyEdge instantly serves the high-fidelity pre-normalized dataset (`demoMarkets.ts`).
- **Transparency Rules:**
  - UI displays an unmistakable badge: `LIVE FEED (Synced: 15:42)` vs `DEMO DATASET (High Fidelity)`.
  - Zero mock data will ever be falsely labeled as live.

---

## 4. Domain Models & Type Specifications

### 4.1 Market Model
```typescript
export interface MarketOutcome {
  name: string;        // "YES" | "NO" | Outcome Title
  price: number;       // Implied probability price [0.00 - 1.00]
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
}
```

### 4.2 Relationship & Scanner Models
```typescript
export type RelationshipType = 
  | "equivalent"          // Identical event conditions across different platforms/contracts
  | "subset"              // Outcome A logically implies Outcome B (P(A) <= P(B))
  | "mutually_exclusive"  // Outcome A and Outcome B cannot both occur (P(A) + P(B) <= 1)
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
  | "insufficient_data"; // Missing order book spread or depth

export interface ScannerFinding {
  id: string;
  relationship: MarketRelationship;
  marketA: Market;
  marketB: Market;
  priceA: number;
  priceB: number;
  grossDifference: number; // |priceA - priceB|
  estimatedFees: number;   // estimated taker fee (e.g., 2% on Polymarket fees/gas)
  estimatedSlippage: number; // based on order book depth
  netEdge: number;         // grossDifference - (fees + slippage)
  status: FindingStatus;
  explanation: string;
  risks: string[];
  detectedAt: string;
}
```

### 4.3 Paper Trading & Portfolio Model
```typescript
export interface PaperPosition {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: "YES" | "NO";
  shares: number;
  entryPrice: number;     // Average price paid per share ($0.01 - $0.99)
  currentPrice: number;   // Current market price
  totalCost: number;      // shares * entryPrice
  currentValue: number;   // shares * currentPrice
  unrealizedPnL: number;  // currentValue - totalCost
  unrealizedPnLPercent: number; // (unrealizedPnL / totalCost) * 100
  openedAt: string;
}

export interface PaperTradeHistory {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: "YES" | "NO";
  action: "BUY" | "SELL" | "SETTLE";
  shares: number;
  price: number;
  realizedPnL?: number;
  timestamp: string;
}

export interface PortfolioState {
  virtualCash: number;       // Starts at $10,000.00
  startingBalance: number;   // $10,000.00
  openPositions: PaperPosition[];
  tradeHistory: PaperTradeHistory[];
  realizedPnL: number;
}
```

---

## 5. Mathematical & Algorithmic Formulations

### 5.1 Implied Probability & Clamping
For a binary outcome contract trading at price $P$:
$$\text{Implied Probability } \pi = \text{clamp}(P, 0.001, 0.999)$$
If $P$ is undefined, non-finite, or $< 0$, PolyEdge marks the probability as `Unavailable`.

### 5.2 Discrepancy & Opportunity Evaluation
For two related outcomes $A$ and $B$:
1. **Equivalent Contracts ($A \equiv B$):**
   $$\Delta_{\text{gross}} = |P_A - P_B|$$
   $$\text{Theoretical Edge} = \Delta_{\text{gross}} - (\text{Fee}_A + \text{Fee}_B + \text{Slippage})$$
   *Strategy:* Buy lower-priced contract ($P_{\text{low}}$), short or buy the opposite outcome on higher-priced contract if hedgeable.

2. **Subset / Inclusion Constraint ($A \subseteq B$):**
   Logically, if $A$ implies $B$, then $P(A) \le P(B)$.
   If market observations show $P(A) > P(B)$, a logical violation exists:
   $$\Delta_{\text{violation}} = P(A) - P(B)$$
   *Status:* Flagged as `interesting` if verified; `needs_review` if resolution dates differ.

3. **Mutually Exclusive ($A \cap B = \emptyset$):**
   Logically, $P(A) + P(B) \le 1.00$.
   If market prices sum to $P(A) + P(B) > 1.00 + \text{spread}$, the market is overpriced.
   If $P(A) + P(B) < 1.00 - \text{spread}$, an underpriced basket exists.

### 5.3 Mark-to-Market Portfolio Valuation
- **Total Position Value ($V_{\text{positions}}$):**
  $$V_{\text{positions}} = \sum_{i=1}^{N} (\text{shares}_i \times \text{currentPrice}_i)$$
- **Total Portfolio Equity ($E$):**
  $$E = \text{virtualCash} + V_{\text{positions}}$$
- **Total Unrealized P&L:**
  $$\text{UPnL} = V_{\text{positions}} - \sum_{i=1}^{N} (\text{shares}_i \times \text{entryPrice}_i)$$
- **Return on Capital (%):**
  $$\text{ROC} = \frac{E - 10000.00}{10000.00} \times 100$$

---

## 6. Copilot Intent Router Specification

The Copilot employs a client-side intent routing engine to guarantee deterministic, zero-hallucination quantitative calculations:

```typescript
export type CopilotIntentType = 
  | "EXPLAIN_TOP_EDGE"       // "Show/explain highest discrepancy"
  | "CALCULATE_RETURN"       // "Calculate return on $50 YES position"
  | "PORTFOLIO_STATUS"       // "How is my paper portfolio doing?"
  | "COMPARE_CONTRACTS"      // "Compare Fed rate cut contracts"
  | "EXPLAIN_CONCEPT"        // "What is implied probability vs arbitrage?"
  | "UNKNOWN";
```

### Execution Flow:
1. Regex & keyword tokenization extracts user intent and parameters (e.g. amount `$50`, market target, outcome).
2. Intent maps directly to live memory store (no remote LLM latency required for MVP).
3. Structured output produces text explanation + interactive UI data card with exact formulas.

---

## 7. Testing & Quality Assurance Plan

1. **Unit Tests (Vitest):**
   - Implied probability bounds and NaN handling.
   - Pairwise scanner calculations across all 5 relationship types.
   - Paper trading position entry, partial close, full close, cash balance validation.
2. **Local Storage Integrity:**
   - Schema validation with fallback to clean default state if corrupted.
3. **Build Target:**
   - Strict `tsc --noEmit` and `vite build` validation.
