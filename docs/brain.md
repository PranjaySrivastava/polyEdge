# PolyEdge — Project Context & System Brain (`brain.md`)

> **AI Context Reference:** This file contains the complete system architecture, data models, quantitative algorithms, UI design systems, and workflow rules for **PolyEdge**. Read this file to understand the entire application without needing to recursively scan every code file.

---

## 1. Project Overview & Mission

- **Project Name:** PolyEdge
- **Tagline:** Explainable Prediction-Market Intelligence Terminal
- **Domain:** FinTech, Prediction Markets (Polymarket), Quantitative Arbitrage Screening, Explainable Decision Support, Voice-Driven Development.
- **Hackathon Objective:** Build a complete, functional web terminal using **Wispr Flow** voice dictation, featuring a probability discrepancy scanner, market explorer, paper trading simulator, and deterministic market copilot.
- **Mandatory Requirements:**
  - Wispr Flow account created via required referral link: `https://ref.wisprflow.ai/hhg`
  - Voice-driven development video demonstrating Wispr Flow in action.
  - Public GitHub repository + live Vercel deployment.
  - Final submission via form before deadline: `https://forms.gle/Lv9wF8gYVHdEqfJW8`

---

## 2. Directory Hierarchy & Architectural Layout

```
polyedge/
├── docs/
│   ├── PRD.md                 # Product Requirements Document
│   ├── TRD.md                 # Technical Requirements Document
│   ├── UI_UX_DESIGN_BRIEF.md  # Terminal Visual Design & Tokens
│   ├── APP_FLOW.md            # Interaction Lifecycles & State Transitions
│   └── brain.md               # Context documentation backup
├── brain.md                   # Primary AI context file
├── public/
│   ├── favicon.svg
│   └── sample-markets.json
├── src/
│   ├── types/
│   │   ├── market.ts          # Market, Outcome, Relationship, Scanner types
│   │   ├── portfolio.ts       # PaperPosition, TradeHistory, PortfolioState
│   │   └── copilot.ts         # CopilotIntent, CopilotMessage, IntentResponse
│   ├── engine/
│   │   ├── probability.ts     # Implied probability, clamping, complement checks
│   │   ├── relationships.ts   # Logical validation (equivalent, subset, mutually_exclusive)
│   │   ├── scanner.ts         # Pairwise discrepancy detection, fee/spread deduction
│   │   ├── paperTrading.ts    # Order execution, P&L formulas, cash ledger
│   │   └── copilotRouter.ts   # Deterministic intent parser and query response generator
│   ├── services/
│   │   ├── polymarketApi.ts   # Gamma & CLOB public API fetcher with error isolation
│   │   ├── demoMarkets.ts     # Curated high-fidelity fallback dataset
│   │   └── marketNormalizer.ts# Raw API to internal Market interface normalizer
│   ├── hooks/
│   │   ├── useMarkets.ts      # Market ingestion, live/demo toggle, search/filters
│   │   ├── useScanner.ts      # Reactive discrepancy findings generator
│   │   └── usePortfolio.ts    # Virtual cash, positions, trade history, localStorage sync
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Terminal navigation (Overview, Markets, Scanner, Copilot, Portfolio)
│   │   │   ├── Topbar.tsx     # Telemetry bar, live/demo status indicator, virtual cash badge
│   │   │   └── PageHeader.tsx # Consistent section headers with quick metrics
│   │   ├── common/
│   │   │   ├── MetricCard.tsx # Monospaced financial summary widget
│   │   │   ├── StatusBadge.tsx# Semantically colored pill (Interesting, Needs Review, Live, Demo)
│   │   │   └── Modal.tsx      # High-contrast glassmorphic dialog wrapper
│   │   ├── market/
│   │   │   ├── MarketCard.tsx # Market overview card with YES/NO probability bars
│   │   │   ├── MarketTable.tsx# Sortable tabular market explorer
│   │   │   └── MarketDetailModal.tsx # Detailed resolution rules and oracles
│   │   ├── scanner/
│   │   │   ├── DiscrepancyCard.tsx  # Pairwise comparison card with delta badges
│   │   │   ├── DiscrepancyTable.tsx # Dense quantitative matrix view
│   │   │   └── ExplanationModal.tsx # Step-by-step mathematical derivation & risk panel
│   │   ├── portfolio/
│   │   │   ├── OrderSlipModal.tsx   # Simulated BUY/SELL YES/NO ticket with dynamic cost/payout
│   │   │   ├── PositionTable.tsx    # Mark-to-market open position grid with Close button
│   │   │   └── PortfolioChart.tsx   # Recharts equity curve & cash breakdown
│   │   └── copilot/
│   │       ├── CopilotDrawer.tsx    # Natural language query interface
│   │       └── QuerySuggestions.tsx # One-click prompt chip shortcuts
│   ├── pages/
│   │   ├── OverviewPage.tsx   # Macro terminal dashboard with quick tickers
│   │   ├── MarketsPage.tsx    # Full market explorer with deep filters
│   │   ├── ScannerPage.tsx    # Probability discrepancy screening engine
│   │   ├── CopilotPage.tsx    # Conversational market analyst view
│   │   └── PortfolioPage.tsx  # Paper trading ledger and performance analytics
│   ├── utils/
│   │   ├── formatters.ts      # Currency ($), percentage (%), and volume formatters
│   │   └── storage.ts         # Safe localStorage read/write with fallback
│   ├── App.tsx                # Master terminal container with tabbed routing
│   ├── main.tsx               # React root entry
│   └── index.css              # Custom Tailwind tokens and scrollbar styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 3. Core Data Types & Schemas

### 3.1 Market & Scanner Types (`src/types/market.ts`)
```typescript
export interface MarketOutcome {
  name: string;
  price: number; // 0.00 to 1.00
  bestBid?: number;
  bestAsk?: number;
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

export type RelationshipType = 
  | "equivalent" 
  | "subset" 
  | "mutually_exclusive" 
  | "conditional" 
  | "unverified";

export interface MarketRelationship {
  id: string;
  marketAId: string;
  marketBId: string;
  outcomeA: string;
  outcomeB: string;
  type: RelationshipType;
  logicalConstraint: string;
  oracleA: string;
  oracleB: string;
  verified: boolean;
  notes: string;
}

export type FindingStatus = "interesting" | "needs_review" | "insufficient_data";

export interface ScannerFinding {
  id: string;
  relationship: MarketRelationship;
  marketA: Market;
  marketB: Market;
  priceA: number;
  priceB: number;
  grossDifference: number; // |priceA - priceB|
  estimatedFees: number;   // default 2.0%
  estimatedSlippage: number; // dynamic based on liquidity
  netEdge: number;         // grossDifference - (fees + slippage)
  status: FindingStatus;
  explanation: string;
  risks: string[];
  detectedAt: string;
}
```

### 3.2 Portfolio & Trading Types (`src/types/portfolio.ts`)
```typescript
export interface PaperPosition {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: "YES" | "NO";
  shares: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;     // shares * entryPrice
  currentValue: number;  // shares * currentPrice
  unrealizedPnL: number; // currentValue - totalCost
  unrealizedPnLPercent: number;
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
  virtualCash: number;       // default: $10,000.00
  startingBalance: number;   // $10,000.00
  openPositions: PaperPosition[];
  tradeHistory: PaperTradeHistory[];
  realizedPnL: number;
}
```

---

## 4. Quantitative Engine & Mathematical Formulas

1. **Implied Probability:**
   $$\pi(P) = \begin{cases} P & \text{if } 0.001 \le P \le 0.999 \\ \text{null} & \text{otherwise} \end{cases}$$
2. **Gross Discrepancy ($\Delta_{\text{gross}}$):**
   $$\Delta_{\text{gross}} = |P_A - P_B|$$
3. **Net Edge with Execution Friction:**
   $$\Delta_{\text{net}} = \Delta_{\text{gross}} - (\text{Fee}_{\text{taker}} + \text{Slippage})$$
   *(Where $\text{Fee}_{\text{taker}} = 0.020$ (2%) and $\text{Slippage} = \max(0.005, \frac{\$1,000}{\text{Liquidity}})$)*
4. **Mark-to-Market Valuation:**
   $$\text{Portfolio Value} = \text{virtualCash} + \sum (\text{shares}_i \times P_{\text{current}, i})$$
   $$\text{Unrealized P\&L} = \sum (\text{shares}_i \times (P_{\text{current}, i} - P_{\text{entry}, i}))$$
   $$\text{Realized P\&L on Close} = \text{shares} \times (P_{\text{close}} - P_{\text{entry}})$$

---

## 5. UI Design Tokens & Theme Specification

- **Base Colors:** Background `#0B0F17` (Deep Slate), Surfaces `#111827` (Charcoal Slate), Borders `#1F2937` (Muted Steel).
- **Accents:** Cyan `#06B6D4` (Primary actions, metrics), Violet `#8B5CF6` (AI & Analytical relationships).
- **Financial Status Colors:** Profit `#10B981` (Emerald), Loss `#EF4444` (Crimson), Warning `#F59E0B` (Amber).
- **Typography:** Sans-serif for navigation & body text (`Inter`), Monospace for all financial numbers (`font-mono`, `tabular-nums`).

---

## 6. Voice-Driven Development Workflow (Wispr Flow)

PolyEdge was engineered specifically to be dictated using **Wispr Flow**. Prompts are organized modularly:
1. Shell & Models $\rightarrow$ *“Create the React TypeScript models for Market, MarketRelationship, and ScannerFinding...”*
2. Quantitative Engine $\rightarrow$ *“Implement the probability calculation module with implied probability clamping and net delta equations...”*
3. Scanner & UI $\rightarrow$ *“Build the Edge Scanner table with sorting by net edge and detailed explanation modal...”*
4. Paper Trading $\rightarrow$ *“Create the paper trading reducer with simulated $10,000 virtual balance and live P&L...”*
5. Copilot $\rightarrow$ *“Build a deterministic intent router handling query intents like explain top discrepancy and simulate trade...”*
