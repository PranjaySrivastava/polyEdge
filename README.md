# PolyEdge — Explainable Prediction-Market Intelligence Terminal

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Wispr Flow](https://img.shields.io/badge/Built_With-Wispr_Flow-8B5CF6?logo=soundcharts&logoColor=white)](https://ref.wisprflow.ai/hhg)

**PolyEdge** is an explainable prediction-market intelligence terminal designed to help users understand market probabilities, compare related event contracts, screen for pricing discrepancies, and simulate paper trades without risking real capital.

Built from inception via **Voice-Driven Development using Wispr Flow**.

---

## 1. Executive Summary & Problem Statement

Prediction markets (such as Polymarket) allow participants to trade outcome contracts representing future events (e.g., Fed interest rate decisions, elections, macro indicators, and crypto asset milestones). Contract prices represent market-implied probabilities.

However, market participants encounter major friction points:
1. **Misleading Price Differences:** Two related contracts often trade at different prices without offering true arbitrage due to differing expiration dates, resolution clauses, or fee drag.
2. **Opaque Resolution Rules:** Contracts with similar questions frequently rely on conflicting settlement oracles (e.g., CME FedWatch vs. Federal Reserve Board press releases; Associated Press vs. Official Congressional certification).
3. **Execution Friction:** 2% taker fees and order-book illiquidity frequently erase theoretical spreads.
4. **Capital Risk for Learners:** Beginners need a realistic sandbox to test probabilistic models before committing funds.

**PolyEdge resolves these barriers** by bringing contract relationships, mathematical derivations, fee deductions, and paper execution together in a unified terminal.

---

## 2. Core Capabilities

### 🔍 Market Explorer
- Search and filter prediction contracts across **Economics**, **Crypto**, and **Politics**.
- Real-time implied probabilities, 24h volume, and liquidity depth.
- Direct inspection of official contract rules and settlement oracles.

### ⚡ Probability Discrepancy Scanner
- Pairwise contract analysis evaluating mathematical constraints:
  - **Equivalent (1:1):** Parity checks between identical events across venues.
  - **Subset Monotonicity:** Verifies $P(A) \le P(B)$ when outcome $A$ implies outcome $B$.
  - **Mutually Exclusive:** Ensures $P(A) + P(B) \le 1.00$ to prevent overpriced baskets.
- Filters for Minimum Delta, Liquidity Depth, and Verified Status.

### 📐 Mathematical Explanation Panel
- **Step-by-step mathematical derivation** for every flagged edge:
  $$\text{Net Edge} = |P(A) - P(B)| - [\text{Taker Fee } (2.0\%) + \text{Slippage}]$$
- Side-by-side settlement oracle comparison (Oracle A vs Oracle B).
- Explicit basis risk and execution warnings.

### 💼 Paper Trading Simulator
- Virtual starting capital of **$10,000.00**.
- Simulated **BUY / SELL** for YES and NO contracts with real-time balance deductions.
- Mark-to-market open position valuation with live Unrealized & Realized P&L.
- Persistent local browser state with one-click simulation reset.

### 🤖 Deterministic Market Copilot
- Natural language query interface powered by a zero-hallucination deterministic intent router:
  - *"Explain the largest price discrepancy"*
  - *"Calculate return on a $100 YES position"*
  - *"Show my paper portfolio status"*
  - *"What is implied probability vs real probability?"*
- Computes returns and state lookups with mathematical precision.

---

## 3. System Architecture & Tech Stack

```
POLYEDGE WEB TERMINAL
 ├── UI Layer (React 19 + Tailwind CSS 4 + Lucide React)
 │    ├── Overview Dashboard
 │    ├── Markets Explorer (Grid & Dense Table)
 │    ├── Edge Scanner & Arbitrage Matrix
 │    ├── Mathematical Explanation Modal
 │    ├── Paper Trading Order Slip & Portfolio
 │    └── Market Copilot Drawer
 ├── State & Data Ingestion
 │    ├── useMarkets: Polymarket Gamma API client + High-Fidelity Demo Dataset fallback
 │    ├── useScanner: Pairwise relation evaluator & fee friction model
 │    └── usePortfolio: Virtual ledger, mark-to-market pricing, localStorage persistence
 └── Deterministic Quantitative Engine
      ├── probability.ts: Implied probability & execution friction formulas
      ├── relationships.ts: Relational constraints (equivalent, subset, mutually_exclusive)
      ├── scanner.ts: Opportunity matrix & risk classifier
      ├── paperTrading.ts: Mark-to-market valuation, order engine, P&L
      └── copilotRouter.ts: Deterministic intent parser
```

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8.3
- **Styling:** Tailwind CSS 4 (Custom dark quantitative terminal design system)
- **Icons:** Lucide React
- **Data Source:** Polymarket Gamma Public API + Curated Offline Benchmark Dataset

---

## 4. Voice-Driven Development Process (Wispr Flow)

PolyEdge was engineered entirely through voice-driven development using [Wispr Flow](https://ref.wisprflow.ai/hhg). Key prompts dictated during development:

1. **Terminal Shell & Architecture:**
   > *"Build the main PolyEdge application shell with a premium quantitative trading-terminal aesthetic. Use a deep navy background, cyan and violet accents, clear typography, tabular numbers, and a responsive sidebar. Add navigation for Overview, Markets, Edge Scanner, Copilot, and Paper Portfolio."*

2. **Quantitative Engine & Discrepancies:**
   > *"Create the probability analysis engine in separate TypeScript modules. Implement functions to calculate implied probability from contract prices, compute gross differences, and validate relationship constraints for equivalent, subset, and mutually exclusive contracts. Deduct 2% taker fees and dynamic slippage."*

3. **Explainability & Risk Modeling:**
   > *"Build the Explanation Modal for the Edge Scanner. Show the exact mathematical formula for Net Edge, display a side-by-side comparison between Oracle A and Oracle B, flag settlement risks, and add a quick action to simulate a paper trade."*

4. **Paper Trading Simulator:**
   > *"Implement the Paper Trading state hook. Support buying YES and NO contracts with a $10,000 virtual balance deduction, tracking open positions, and calculating real-time unrealized and realized P&L."*

---

## 5. Local Setup & Quickstart

```bash
# Clone the repository
git clone https://github.com/your-username/polyedge.git
cd polyedge

# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build
```

---

## 6. Hackathon Submission Information

- **Task:** Wispr Flow Shortlisting Task
- **Referral Registration:** Account created via [https://ref.wisprflow.ai/hhg](https://ref.wisprflow.ai/hhg)
- **Submission Form:** [https://forms.gle/Lv9wF8gYVHdEqfJW8](https://forms.gle/Lv9wF8gYVHdEqfJW8)
- **Live Demo Video:** 2–3 minute demonstration showcasing voice-driven development with Wispr Flow driving the codebase creation and full terminal walkthrough.
