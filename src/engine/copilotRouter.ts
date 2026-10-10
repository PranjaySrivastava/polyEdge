import { Market, ScannerFinding } from '../types/market';
import { PortfolioState } from '../types/portfolio';
import { CopilotMessage, CopilotIntentType } from '../types/copilot';
import { computePortfolioSummary } from './paperTrading';

/**
 * Parses user text query and generates deterministic structured market analysis.
 */
export function processCopilotQuery(
  query: string,
  markets: Market[],
  findings: ScannerFinding[],
  portfolio: PortfolioState
): CopilotMessage {
  const normalized = query.trim().toLowerCase();
  const summary = computePortfolioSummary(portfolio);

  // Intent 1: Explain Top Discrepancy / Edge
  if (
    normalized.includes('discrepancy') ||
    normalized.includes('top edge') ||
    normalized.includes('highest') ||
    normalized.includes('best opportunity') ||
    normalized.includes('scanner')
  ) {
    const topFinding = findings[0];
    if (!topFinding) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'copilot',
        text: 'No active discrepancies meet the current criteria. Ensure markets are loaded.',
        timestamp: new Date().toISOString(),
        intent: 'EXPLAIN_TOP_EDGE',
      };
    }

    const netPercent = (topFinding.netEdge * 100).toFixed(1);
    const grossPercent = (topFinding.grossDifference * 100).toFixed(1);
    const text = `The largest detected discrepancy is between "${topFinding.marketA.question}" ($${topFinding.priceA}) and "${topFinding.marketB.question}" ($${topFinding.priceB}).\n\nGross observed spread is ${grossPercent}%. After deducting ~${(topFinding.estimatedFees * 100).toFixed(1)}% in taker fees and ${(topFinding.estimatedSlippage * 100).toFixed(1)}% estimated slippage, the theoretical Net Edge is +${netPercent}%.\n\nRelationship: ${topFinding.relationship.type.toUpperCase()} (${topFinding.relationship.verified ? 'Verified' : 'Unverified'}).`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toISOString(),
      intent: 'EXPLAIN_TOP_EDGE',
      relatedFinding: topFinding,
      suggestedActions: [
        {
          label: `Inspect "${topFinding.marketA.question.substring(0, 30)}..."`,
          actionType: 'inspect_finding',
          payload: topFinding.id,
        },
        {
          label: 'Open Edge Scanner Tab',
          actionType: 'switch_tab',
          payload: 'scanner',
        },
      ],
    };
  }

  // Intent 2: Calculate hypothetical return (e.g., "$100 YES position" or "simulate 50 dollars")
  const calcMatch = normalized.match(/(?:calculate|simulate|return|profit|invest)\s*(?:on|for)?\s*(?:\$)?(\d+)/);
  if (calcMatch || normalized.includes('calculate') || normalized.includes('return') || normalized.includes('simulate')) {
    const amount = calcMatch ? parseFloat(calcMatch[1]) : 100;
    const samplePrice = 0.62; // 62 cents benchmark
    const shares = Math.floor(amount / samplePrice);
    const totalCost = Number((shares * samplePrice).toFixed(2));
    const potentialPayout = shares * 1.0;
    const potentialProfit = Number((potentialPayout - totalCost).toFixed(2));
    const returnPercentage = Number(((potentialProfit / totalCost) * 100).toFixed(1));

    const text = `Hypothetical Calculation for a $${amount} investment at benchmark price $${samplePrice} (62% implied probability):\n\n- Purchased Shares: ${shares} contracts\n- Capital Allocated: $${totalCost.toFixed(2)}\n- Settlement Payout if YES: $${potentialPayout.toFixed(2)}\n- Net Potential Profit: +$${potentialProfit.toFixed(2)} (+${returnPercentage}% ROI)\n- Maximum Risk: -$${totalCost.toFixed(2)} if contract settles to NO ($0.00).`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toISOString(),
      intent: 'CALCULATE_RETURN',
      calculationBreakdown: {
        shares,
        entryPrice: samplePrice,
        investment: totalCost,
        potentialPayout,
        potentialProfit,
        returnPercentage,
      },
      suggestedActions: [
        {
          label: 'Simulate in Paper Trading',
          actionType: 'switch_tab',
          payload: 'portfolio',
        },
      ],
    };
  }

  // Intent 3: Portfolio status & performance
  if (
    normalized.includes('portfolio') ||
    normalized.includes('p&l') ||
    normalized.includes('balance') ||
    normalized.includes('cash') ||
    normalized.includes('positions')
  ) {
    const text = `Your Paper Trading Portfolio status:\n\n- Virtual Equity: $${summary.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n- Available Cash: $${summary.virtualCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n- Open Positions: ${summary.openPositionsCount} active ($${summary.totalPositionsValue.toLocaleString(undefined, { minimumFractionDigits: 2 })})\n- Unrealized P&L: ${summary.totalUnrealizedPnL >= 0 ? '+' : ''}$${summary.totalUnrealizedPnL.toFixed(2)}\n- Realized P&L: ${summary.totalRealizedPnL >= 0 ? '+' : ''}$${summary.totalRealizedPnL.toFixed(2)}\n- Total ROC: ${summary.returnOnCapital >= 0 ? '+' : ''}${summary.returnOnCapital.toFixed(2)}%`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toISOString(),
      intent: 'PORTFOLIO_STATUS',
      suggestedActions: [
        {
          label: 'View Open Positions',
          actionType: 'switch_tab',
          payload: 'portfolio',
        },
      ],
    };
  }

  // Intent 4: Concept explanation (implied probability vs true probability / arbitrage)
  if (
    normalized.includes('implied') ||
    normalized.includes('probability') ||
    normalized.includes('arbitrage') ||
    normalized.includes('how does') ||
    normalized.includes('what is')
  ) {
    const text = `Implied Probability vs Real Probability:\n\nIn prediction markets, a contract price of $0.65 reflects a 65% market-implied probability, derived from current supply and demand.\n\nKey nuances:\n1. It is not an objective forecast; it is a liquidity-weighted market consensus.\n2. Prices rarely sum to exactly 1.00 due to order-book bid-ask spreads and exchange taker fees.\n3. True arbitrage requires matching resolution oracles and guaranteed payout coverage across all states. A price difference between contracts with different settlement dates or clauses is basis risk, not pure arbitrage.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'copilot',
      text,
      timestamp: new Date().toISOString(),
      intent: 'EXPLAIN_CONCEPT',
      suggestedActions: [
        {
          label: 'Explore Active Markets',
          actionType: 'switch_tab',
          payload: 'markets',
        },
      ],
    };
  }

  // Default Fallback
  return {
    id: `msg-${Date.now()}`,
    sender: 'copilot',
    text: `I can assist with real-time prediction market queries:\n- "Explain the highest price discrepancy"\n- "Calculate return on a $250 YES position"\n- "Show my paper trading portfolio status"\n- "What is the difference between implied probability and true probability?"`,
    timestamp: new Date().toISOString(),
    intent: 'UNKNOWN',
    suggestedActions: [
      {
        label: 'Explain Top Discrepancy',
        actionType: 'switch_tab',
        payload: 'scanner',
      },
      {
        label: 'Show Portfolio Status',
        actionType: 'switch_tab',
        payload: 'portfolio',
      },
    ],
  };
}
