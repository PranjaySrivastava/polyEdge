# PolyEdge — App Flow & Interaction Specifications

**Product Name:** PolyEdge  
**Document Purpose:** Complete map of user flows, state transitions, interactive routing, and modal lifecycles across the PolyEdge quantitative terminal.

---

## 1. High-Level Navigation & Routing Map

PolyEdge operates as an ultra-responsive Single Page Application (SPA) with tabbed navigation:

```
                          ┌───────────────────────────┐
                          │   TERMINAL LANDING / BOOT │
                          └─────────────┬─────────────┘
                                        │
                         Load Market Cache & Portfolio
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
    ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
    │   OVERVIEW    │           │    MARKETS    │           │  EDGE SCANNER │
    │   DASHBOARD   │           │   EXPLORER    │           │  & ARBITRAGE  │
    └───────┬───────┘           └───────┬───────┘           └───────┬───────┘
            │                           │                           │
            │                           ▼                           ▼
            │                   ┌───────────────┐           ┌───────────────┐
            │                   │ Market Detail │           │  Explanation  │
            │                   │     Modal     │           │  Risk Panel   │
            │                   └───────┬───────┘           └───────┬───────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        ▼
                        ┌───────────────────────────────┐
                        │   PAPER TRADING ORDER SLIP    │
                        └───────────────┬───────────────┘
                                        │
                          Execute Simulated Position
                                        │
            ┌───────────────────────────┴───────────────────────────┐
            ▼                                                       ▼
    ┌───────────────┐                                       ┌───────────────┐
    │  PAPER TRADING│                                       │ MARKET COPILOT│
    │   PORTFOLIO   │◄──────────────────────────────────────┤  QUERY & CHAT │
    └───────────────┘                                       └───────────────┘
```

---

## 2. Core User Flows & State Machines

### 2.1 Flow 1: Terminal Boot & Initial Load
1. **Trigger:** User opens application URL.
2. **Step 1 (State Hydration):**
   - App checks `localStorage` for `polyedge_portfolio_v1`. If empty, initializes with `$10,000.00` virtual cash, 0 positions, and empty trade history.
   - App checks `localStorage` for data source preference (defaults to `live` with automatic fallback).
3. **Step 2 (Data Ingestion):**
   - App triggers `fetchMarkets()`.
   - If Polymarket API succeeds $\rightarrow$ loads records, computes last updated timestamp, displays `LIVE FEED` status in green.
   - If Polymarket API fails/times out/CORS blocks $\rightarrow$ automatically loads `demoMarkets.ts`, displays toast *"Switched to High-Fidelity Demo Dataset"*, sets topbar badge to `DEMO DATASET` in cyan.
4. **Step 3 (Analysis Engine Trigger):**
   - Analysis engine runs `scanRelationships(markets, definedRelationships)`.
   - Discrepancy metrics populate the global store.
   - Dashboard renders overview cards.

---

### 2.2 Flow 2: Market Explorer Navigation
1. **Entry Point:** User clicks `Markets` in sidebar.
2. **User Actions:**
   - **Search Input:** Types query (e.g., *"Bitcoin"* or *"Fed"*). Results filter instantaneously across questions and descriptions.
   - **Category Chips:** Selects `All`, `Politics`, `Crypto`, `Economics`, `Technology`.
   - **Sorting:** Toggles sort by `Volume 24h`, `Liquidity`, `YES Price`, or `Ending Soon`.
3. **Selecting a Market:**
   - User clicks any row or card.
   - **Market Detail Drawer/Modal opens:**
     - Displays question title, category, and outcome prices (YES/NO).
     - Displays volume, open interest, and liquidity pool metrics.
     - Displays official **Resolution Rules** and **Resolution Source / Oracle** (e.g. Associated Press, CME FedWatch, CoinGecko).
     - Provides two quick action buttons:
       - *"Find Related Markets in Scanner"* $\rightarrow$ jumps to Edge Scanner with market pre-filtered.
       - *"Simulate Paper Trade"* $\rightarrow$ opens Order Slip with market selected.

---

### 2.3 Flow 3: Edge Scanner & Discrepancy Inspection
1. **Entry Point:** User clicks `Edge Scanner` in sidebar.
2. **Scanner Filter Bar:**
   - Sliders/inputs for: `Min Discrepancy %` (default: 3%), `Min Liquidity` (default: $10,000), `Relationship Type` filter.
   - Status toggle: `All`, `Interesting Only`, `Needs Review`.
3. **Table Interaction:**
   - Table displays pairs: Market A vs Market B, prices, gross delta, estimated fees, and net edge.
   - User clicks on a finding row $\rightarrow$ **Explanation Modal** opens.
4. **Explanation Modal Flow:**
   - **View Math Breakdown:** Shows how $P_A - P_B = \text{Gross Edge}$ was calculated.
   - **View Fee & Friction Deductions:** Shows $2.0\%$ estimated platform fee + slippage allowance deducted to reveal true Net Edge.
   - **Review Oracle Discrepancy Warning:** Flags if Market A settles on a different date or data source than Market B.
   - **Action Choice:**
     - User clicks *"Simulate Trade on Market A (YES)"* or *"Simulate Trade on Market B (NO)"*.
     - Modal closes, Order Slip appears pre-filled with the selected market, outcome, and current market price.

---

### 2.4 Flow 4: Paper Trading & Position Lifecycle
1. **Entry Point:** User clicks *"Trade"* from any market/scanner card OR opens `Paper Portfolio` $\rightarrow$ *"New Trade"*.
2. **Order Slip Interaction:**
   - Selects Outcome: `YES` or `NO`.
   - Selects Order Type: `Market Buy`.
   - Enters Number of Shares: e.g. `100`.
   - System computes:
     - $\text{Execution Price} = \$0.62$
     - $\text{Required Cash} = 100 \times \$0.62 = \$62.00$
     - $\text{Max Potential Payout if Won} = 100 \times \$1.00 = \$100.00$
     - $\text{Max Potential Profit} = \$100.00 - \$62.00 = +\$38.00$ ($+61.3\%$)
     - $\text{Max Risk} = -\$62.00$
3. **Order Execution:**
   - User clicks *"Execute Simulated Order"*.
   - **Validation Check:** If $\text{Required Cash} > \text{Available Cash}$, disables button and displays *"Insufficient Virtual Cash"*.
   - If valid:
     - Deducts $\$62.00$ from `virtualCash`.
     - Appends new `PaperPosition` to portfolio.
     - Appends entry to `tradeHistory`.
     - Syncs state to `localStorage`.
     - Triggers toast: *"Simulated purchase of 100 YES shares executed at $0.62"*.
4. **Position Monitoring & Closing:**
   - In `Paper Portfolio`, user views table of open positions.
   - Each position displays: Shares, Entry Price, Live Valuation Price, Total Cost, Current Value, and Unrealized P&L ($ / %).
   - User clicks *"Close Position"*:
     - Modal asks confirmation: *"Close 100 shares at current market price of $0.68? Realized P&L: +$6.00"*.
     - On confirm:
       - Position is removed from `openPositions`.
       - Cash credited: $100 \times 0.68 = \$68.00$.
       - Realized P&L updated: $+\$6.00$.
       - Portfolio equity curve recalculates.

---

### 2.5 Flow 5: Voice-Ready Market Copilot
1. **Entry Point:** User clicks `Copilot` in sidebar (or uses keyboard shortcut `/`).
2. **Query Input Options:**
   - User types freeform query OR clicks one of 4 suggested prompt chips:
     - *"Explain highest discrepancy"*
     - *"Compare Fed Rate Cut contracts"*
     - *"Simulate $100 YES trade on Bitcoin $100k"*
     - *"Summarize my portfolio performance"*
3. **Intent Execution & Response:**
   - Copilot runs `parseCopilotQuery(input, context)`.
   - Returns structured assistant message containing:
     - Natural-language explanation.
     - Embedded analytical metrics (e.g., Discrepancy delta, Net margin, Win probability).
     - One-click CTA chip (e.g. *"Inspect Fed Edge"* or *"Execute $100 Paper Trade"*).

---

## 3. Global Interaction & Error Handling Matrix

| Event / Trigger | System Action | UI Feedback |
| :--- | :--- | :--- |
| **User toggles Data Source to "Live"** | Attempts Polymarket API call | Shows loading spinner; on success switches badge to `LIVE FEED`; on failure keeps `DEMO` and displays friendly error toast. |
| **User clicks "Reset Simulation"** | Displays confirmation modal | Resets cash to $10,000, deletes positions and history, confirms via green toast. |
| **User clicks outside an open modal** | Closes modal | Smooth opacity fade-out; preserves any partially entered form state. |
| **Search query produces 0 results** | Renders Empty State component | Displays icon, *"No matching markets found"*, and a *"Clear Filters"* button. |
