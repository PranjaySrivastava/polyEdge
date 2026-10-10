# PolyEdge — Product Requirements Document (PRD)

**Project Name:** PolyEdge  
**Category:** FinTech, Prediction Markets, Quantitative Analysis, Explainable AI-Assisted Terminal  
**Product Type:** Quantitative Web Application / Research Terminal  
**Primary Objective:** Deliver an explainable prediction-market intelligence terminal with probability-discrepancy screening, cross-market relationship validation, a deterministic natural-language copilot, and a risk-free paper-trading simulator.  
**Built With:** Voice-driven development via Wispr Flow  
**Target Submission:** GitHub Repository + Live Vercel Deployment + 2–3 Minute Voice Development Demo Video + Submission Form  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
Prediction markets (such as Polymarket) represent some of the fastest-growing financial primitives in decentralized and probabilistic finance. Market prices reflect collective consensus probabilities for real-world binary outcomes (e.g., elections, Federal Reserve rate cuts, macro-economic releases, tech launches, cryptocurrency thresholds).

However, retail participants and quantitative beginners face severe cognitive and technical barriers:
1. **Misleading Price Differences:** Users see a 7¢ spread between two seemingly related contracts and mistake it for risk-free arbitrage, ignoring subtle resolution rules, expiration mismatches, or platform fees.
2. **Opaque Resolution Criteria:** Contracts that look identical often settle based on different data oracles (e.g., Associated Press vs. Official Election Certification, Bloomberg vs. CoinGecko).
3. **Execution Friction & Capital Risk:** Transaction fees, slippage, and thin order book liquidity frequently eliminate theoretical margins. Beginners risk real capital trying to test basic probabilistic models.
4. **Information Fragmentation:** Analyzing an edge requires jumping between market order books, historical charts, spreadsheets, and settlement documentation.

**PolyEdge resolves these barriers** by acting as an **Explainable Prediction Market Intelligence Terminal**. PolyEdge scans contract relationships, isolates candidate pricing discrepancies, calculates true net spreads with execution costs, clearly labels all underlying assumptions and settlement risks, and enables instant risk-free paper-trading validation.

### 1.2 Core Value Proposition
- **Explainability First:** Every discrepancy flagged includes mathematical derivation, logical classification (`equivalent`, `subset`, `mutually_exclusive`, `conditional`), and explicit risk warnings.
- **Risk-Free Proving Ground:** Integrated Paper Trading simulator allows users to test probabilistic hypotheses with $10,000 in virtual capital, tracking live mark-to-market P&L.
- **Deterministic Copilot:** An intelligent query interface that runs deterministic financial equations and state queries rather than hallucinating financial advice.
- **Voice-Driven Engineering:** Purpose-built via Wispr Flow, showcasing how complex financial interfaces and quantitative engines can be built through voice dictation.

---

## 2. Target Audience & Personas

### 2.1 The Prediction Market Novice (Alex, 24)
- **Background:** Interested in macro events and crypto prediction markets, but intimidated by CLOB order books and ambiguous resolution clauses.
- **Needs:** Plain-English explanations of implied probabilities, clear warnings when a price gap is not genuine arbitrage, and a paper-trading account to learn without losing money.
- **PolyEdge Solution:** The Market Explorer and Paper Trading Simulator with step-by-step risk breakdowns.

### 2.2 The Active Market Participant / Semi-Pro Arbitrageur (Elena, 31)
- **Background:** Trades election and economic markets actively across Polymarket and Kalshi.
- **Needs:** Rapid discrepancy screening, liquidity filtering, spread and fee deduction estimates, and quick cross-contract relationship verification.
- **PolyEdge Solution:** The Edge Scanner table with real-time discrepancy sorting, relationship badges, and net payoff calculation.

### 2.3 The Quantitative Researcher / Hackathon Judge
- **Background:** Evaluates system architecture, mathematical rigor, UI execution, and adherence to voice-driven development principles.
- **Needs:** Clean codebase, deterministic calculation engine, responsive Bloomberg-style quantitative UX, and tangible evidence of voice-driven workflow using Wispr Flow.

---

## 3. Product Scope & Functional Requirements

### 3.1 Feature Matrix (MVP vs. Stretch)

| Feature Module | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Market Explorer** | **MVP (P0)** | Search & filter active prediction markets; view YES/NO prices, 24h volume, liquidity depth, expiry dates; inspect official resolution rules. |
| **Edge Scanner** | **MVP (P0)** | Automated probability discrepancy detector; relationship validation (`equivalent`, `subset`, `mutually_exclusive`); net delta calculation with fee deduction; risk alerts. |
| **Explanation Modal** | **MVP (P0)** | Deep-dive panel for each finding: exact mathematical formulas, oracle verification, liquidity constraints, unverified assumption flags. |
| **Paper Trading Simulator** | **MVP (P0)** | $10,000 starting virtual balance; simulated BUY/SELL YES/NO contracts; average execution pricing; live unrealized/realized P&L calculation; position closing; local storage persistence. |
| **Market Copilot** | **MVP (P0)** | Natural-language query interface with intent router; deterministic execution for finding explanation, trade simulation, portfolio breakdown, and concept education. |
| **Dual Data Engine** | **MVP (P0)** | Hybrid Live API (Polymarket public endpoints) + curated high-fidelity Demo Dataset fallback with crystal-clear data source badges. |
| **Custom Watchlists** | Stretch (P2) | Save custom pairs of contracts to monitor live spread changes. |
| **Historical Discrepancy Charts** | Stretch (P2) | Time-series charting of spread convergence/divergence. |

### 3.2 Non-Functional Requirements
- **Performance:** Sub-100ms response time for local state updates, filter queries, and math calculations.
- **Reliability:** 100% resilient to external API timeouts or CORS blocks via seamless demo dataset fallback.
- **Transparency:** Zero fabricated data masquerading as live data. Stale, demo, and live records must carry explicit UI badges.
- **Precision:** Float-safe precision handling for probability ($0.000$ to $1.000$) and currency amounts ($0.01$).

---

## 4. User Journey & Workflow Scenarios

### Scenario A: Discovery to Simulated Arbitrage
1. User lands on **Overview Dashboard**, glancing at key metrics: Total Markets Loaded, Active Discrepancies, Virtual Portfolio Value, and Top Discrepancy Cards.
2. User clicks into **Edge Scanner** and filters for discrepancies with `Liquidity > $50,000` and `Status = Interesting`.
3. User selects the top finding: *Fed Rate Cut in November (Polymarket A) vs Fed Target Rate ≤ 4.75% (Polymarket B)* exhibiting a 7.2% probability discrepancy.
4. User opens the **Explanation Panel**, reviewing:
   - Implied Probability A: $0.680$ ($68.0\%$)
   - Implied Probability B: $0.608$ ($60.8\%$)
   - Gross Delta: $+7.2\%$
   - Estimated Fee & Slippage: $-1.8\%$
   - Net Potential Edge: $+5.4\%$
   - Risk Warning: Contract B resolves on CME FedWatch data; Contract A resolves on the Federal Reserve Board official statement.
5. User clicks **"Simulate Paper Trade"**, which pre-populates the Paper Trading order slip.
6. User enters 100 contracts ($60.80 investment) and clicks **"Execute Simulated Order"**.
7. The **Paper Portfolio** updates immediately, deducting cash and displaying the open position with dynamic P&L tracking.

### Scenario B: Copilot Querying
1. User types into the Copilot input: *"Explain the largest price discrepancy currently flagged."*
2. Copilot routes to `explain_finding` intent, queries state, and outputs structured analytical cards detailing the contracts, probability difference, relationship validity, and settlement oracles.
3. User clicks an interactive quick-action chip: *"Calculate return on a $100 YES position"*, receiving deterministic payout scenarios ($100 \times \text{settlement payout} - \text{entry cost}$).

---

## 5. Success Metrics & Definition of Done

1. **Functional Correctness:** 100% deterministic probability, delta, and P&L math validated by unit tests.
2. **Zero Runtime Crashes:** Flawless client-side execution with zero uncaught exceptions when switching between Live and Demo modes.
3. **Voice Development Evidence:** Screen recording clearly displays Wispr Flow transcribing natural speech into prompt instructions inside the IDE.
4. **Clean Deployment:** Production bundle deployed to Vercel with responsive mobile and desktop support.
