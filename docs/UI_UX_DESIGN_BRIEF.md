# PolyEdge — UI/UX Design Brief

**Product Aesthetic:** Institutional Quantitative Terminal (Bloomberg / TradingView meets Modern Glassmorphism)  
**Theme:** High-Contrast Deep Navy / Charcoal Dark Mode  
**Tone:** Analytical, Precise, Explainable, Confident, Modern  

---

## 1. Design Philosophy

PolyEdge is designed as a **high-performance financial intelligence terminal**. It explicitly rejects generic, cookie-cutter dashboard templates with low information density.

### Key Principles:
1. **High Information Density with Visual Breathing Room:** Dense data grids paired with crisp borders, subtle dividers, and contextual badges.
2. **Tabular Precision:** Every price, percentage, volume, and cash balance uses monospaced tabular numerals (`font-mono` / `tabular-nums`) to prevent layout shifting and ensure instant visual scanning.
3. **Restrained, Meaningful Color:** Colors are not decorative; they convey mathematical status:
   - **Cyan / Teal:** Primary terminal accents and primary actions.
   - **Violet / Purple:** Analytical relationships and AI copilot interactions.
   - **Emerald Green:** Positive P&L, verified relationships, and active edges.
   - **Amber / Yellow:** Needs review, oracle discrepancies, and warnings.
   - **Crimson Red:** Negative P&L, high risk, and failed validations.
4. **Transparent Data Provenance:** Users always know whether data is `LIVE` or `DEMO` via glowing topbar telemetry indicators.

---

## 2. Color Palette & Design Tokens

```
Backgrounds:
  - Base Deep Navy:        #0B0F17  (bg-slate-950 / custom #0B0F17)
  - Card / Panel Surface:  #111827  (bg-gray-900 / #111827)
  - Elevated Card Hover:   #1E293B  (bg-slate-800 / #1E293B)
  - Border Subdued:        #1F2937  (border-gray-800)
  - Border Active/Focus:   #38BDF8  (border-sky-400 / cyan)

Brand & Accents:
  - Cyan Primary:          #06B6D4  (cyan-500)
  - Cyan Glow / Hover:     #22D3EE  (cyan-400)
  - Violet Secondary:      #8B5CF6  (violet-500)
  - Violet Subtle BG:      rgba(139, 92, 246, 0.12)

Semantic Financial Indicators:
  - Profit / Positive:     #10B981  (emerald-500)
  - Loss / High Risk:      #EF4444  (red-500)
  - Warning / Review:      #F59E0B  (amber-500)
  - Informational:         #3B82F6  (blue-500)

Typography Colors:
  - Text Primary (Headers): #F9FAFB (gray-50)
  - Text Secondary (Body):  #9CA3AF (gray-400)
  - Text Muted (Labels):    #6B7280 (gray-500)
```

---

## 3. Typography System

| Style | Font Family | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | Sans-Serif (Inter / System) | 24px - 30px | 700 (Bold) | -0.02em | Terminal Title, Page Headers |
| **Section Heading**| Sans-Serif | 18px - 20px | 600 (Semibold)| -0.01em | Module headers, Card titles |
| **Card Label** | Sans-Serif | 12px - 13px | 500 (Medium) | +0.05em (Caps)| Metric subtitles, status chips |
| **Financial Numeral**| Monospace (JetBrains/Fira Mono)| 14px - 24px | 600 (Semibold)| 0.00em (Tabular)| Prices ($0.62), Edge (+7.4%), Balances |
| **Body Text** | Sans-Serif | 14px | 400 (Regular)| normal | Explanations, Copilot output |

---

## 4. Key Components & Wireframe Specs

### 4.1 Top Navigation Bar (Telemetry Header)
- **Left:** PolyEdge Logo (Cyan delta icon + stylized modern wordmark) + Category navigation breadcrumb.
- **Center:** Quick Search input (`cmd+k` placeholder) to rapidly find markets by ticker or keyword.
- **Right:**
  - Data Feed Status Badge (`LIVE FEED` pulse in emerald OR `DEMO MODE` badge in cyan).
  - Data Source Switcher toggle (`Live API` / `High-Fidelity Demo`).
  - Virtual Cash Indicator: `$10,000.00 Available` with instant wallet link.

### 4.2 Sidebar Navigation (Collapsible)
- **Terminal Modules:**
  1. `Overview` (Icon: `LayoutDashboard`) — Macro market stats, quick discrepancies, mini portfolio.
  2. `Markets Explorer` (Icon: `TrendingUp`) — Filterable table/grid of active prediction markets.
  3. `Edge Scanner` (Icon: `Zap` / `ScanSearch`) — Core discrepancy screening engine & relationship matrix.
  4. `Market Copilot` (Icon: `Bot` / `Sparkles`) — Voice & text-driven query interface.
  5. `Paper Portfolio` (Icon: `Briefcase` / `PieChart`) — Simulated trade positions, cash balance, P&L graph.
- **Bottom Sidebar:**
  - Wispr Flow development badge with referral banner link.
  - Reset Virtual Simulation button.

### 4.3 Edge Scanner Table & Finding Cards
- **Compact Data Rows:**
  - `Market Pair`: Left contract question vs Right contract question with category pills.
  - `Prices`: Outcome A ($0.68) vs Outcome B ($0.61).
  - `Gross Delta`: Highlighted badge (e.g., `+7.0%`).
  - `Relationship`: Verified badge (`Equivalent`, `Subset`, `Mutually Exclusive`).
  - `Estimated Net Edge`: Cyan monospace badge accounting for taker fees and slippage (e.g., `+5.2% Net`).
  - `Status`: `Interesting` (Emerald), `Needs Review` (Amber), `Insufficient Data` (Gray).
  - `Actions`: `Inspect Edge` (opens Explanation Modal) and `Simulate Trade` (pre-fills paper trading ticket).

### 4.4 The Explanation Modal (Mathematical Derivation Panel)
The hallmark feature of PolyEdge:
- **Header:** Contract Pair and Verified Relationship Badge.
- **Step 1: Raw Observation:** Implied probabilities derived from contract prices ($P_A$ vs $P_B$).
- **Step 2: Mathematical Formula Display:** Syntax-highlighted formula block (e.g. $\Delta = |P_A - P_B| - (\text{fees} + \text{slippage})$).
- **Step 3: Oracle & Settlement Comparison:** Side-by-side card comparing settlement source A (e.g. Associated Press) vs settlement source B (e.g. State Election Board).
- **Step 4: Liquidity & Execution Risk Analysis:** Depth assessment, maximum recommended position size before slippage degrades the edge.
- **Step 5: Direct Action:** Primary button: *"Simulate Position with $500"* which switches to Paper Trading with filled fields.

### 4.5 Paper Trading Order Slip
- Interactive modal or drawer on the right side:
  - Market selector with toggle for `YES` or `NO` outcome.
  - Number of contracts counter (stepper or quick buttons: 10, 50, 100, 500).
  - Dynamic cost calculator: $\text{Shares} \times \text{Current Price} = \text{Total Cash Required}$.
  - Potential payout calculator: If settles at $1.00 $\rightarrow \text{Profit} = \$(\text{Shares} \times (1.00 - \text{Price}))$.
  - "Execute Simulated Order" primary button with confirmation toast.

---

## 5. Micro-Interactions & Responsive Behavior

1. **Card Hover States:** 1px border gradient transition from `border-gray-800` to `border-cyan-500/40` with subtle elevation.
2. **Number Ticker Transitions:** Smooth color flash (green flash on positive delta change, red on negative).
3. **Data Source Toggle:** Instant state transition without page reload; toast notification confirming data source switch.
4. **Mobile Layout:** Collapsible hamburger drawer, stacked table cards with horizontal scroll for numeric columns.
