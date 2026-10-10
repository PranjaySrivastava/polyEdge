import { PaperPosition, PaperTradeHistory, PortfolioState } from '../types/portfolio';
import { Market } from '../types/market';

export const INITIAL_VIRTUAL_BALANCE = 10000.00;

export const INITIAL_PORTFOLIO_STATE: PortfolioState = {
  virtualCash: INITIAL_VIRTUAL_BALANCE,
  startingBalance: INITIAL_VIRTUAL_BALANCE,
  openPositions: [],
  tradeHistory: [],
  realizedPnL: 0.00,
};

/**
 * Calculates current valuation and unrealized P&L for a position against current market price.
 */
export function calculatePositionValuation(
  position: PaperPosition,
  currentPrice: number
): PaperPosition {
  const currentValue = Number((position.shares * currentPrice).toFixed(2));
  const unrealizedPnL = Number((currentValue - position.totalCost).toFixed(2));
  const unrealizedPnLPercent = position.totalCost > 0
    ? Number(((unrealizedPnL / position.totalCost) * 100).toFixed(2))
    : 0;

  return {
    ...position,
    currentPrice,
    currentValue,
    unrealizedPnL,
    unrealizedPnLPercent,
  };
}

/**
 * Simulates purchasing shares of a prediction contract.
 */
export function executeBuyOrder(
  portfolio: PortfolioState,
  market: Market,
  outcome: 'YES' | 'NO',
  shares: number,
  executionPrice: number
): { success: boolean; error?: string; newState?: PortfolioState } {
  if (shares <= 0 || !Number.isFinite(shares)) {
    return { success: false, error: 'Share quantity must be greater than zero.' };
  }
  if (executionPrice <= 0 || executionPrice >= 1 || !Number.isFinite(executionPrice)) {
    return { success: false, error: 'Execution price must be between $0.01 and $0.99.' };
  }

  const orderCost = Number((shares * executionPrice).toFixed(2));
  if (orderCost > portfolio.virtualCash) {
    return {
      success: false,
      error: `Insufficient virtual cash. Required: $${orderCost.toFixed(2)}, Available: $${portfolio.virtualCash.toFixed(2)}`,
    };
  }

  const newVirtualCash = Number((portfolio.virtualCash - orderCost).toFixed(2));

  // Check if position already exists for this market and outcome
  const existingIdx = portfolio.openPositions.findIndex(
    (p) => p.marketId === market.id && p.outcome === outcome
  );

  let updatedPositions = [...portfolio.openPositions];

  if (existingIdx >= 0) {
    const existing = updatedPositions[existingIdx];
    const newShares = existing.shares + shares;
    const newTotalCost = Number((existing.totalCost + orderCost).toFixed(2));
    const newEntryPrice = Number((newTotalCost / newShares).toFixed(4));
    const currentValue = Number((newShares * executionPrice).toFixed(2));
    const unrealizedPnL = Number((currentValue - newTotalCost).toFixed(2));
    const unrealizedPnLPercent = Number(((unrealizedPnL / newTotalCost) * 100).toFixed(2));

    updatedPositions[existingIdx] = {
      ...existing,
      shares: newShares,
      entryPrice: newEntryPrice,
      totalCost: newTotalCost,
      currentPrice: executionPrice,
      currentValue,
      unrealizedPnL,
      unrealizedPnLPercent,
    };
  } else {
    const newPosition: PaperPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      marketId: market.id,
      marketQuestion: market.question,
      outcome,
      shares,
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      totalCost: orderCost,
      currentValue: orderCost,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      openedAt: new Date().toISOString(),
    };
    updatedPositions.push(newPosition);
  }

  const tradeRecord: PaperTradeHistory = {
    id: `trade-${Date.now()}`,
    marketId: market.id,
    marketQuestion: market.question,
    outcome,
    action: 'BUY',
    shares,
    price: executionPrice,
    timestamp: new Date().toISOString(),
  };

  return {
    success: true,
    newState: {
      ...portfolio,
      virtualCash: newVirtualCash,
      openPositions: updatedPositions,
      tradeHistory: [tradeRecord, ...portfolio.tradeHistory],
    },
  };
}

/**
 * Closes an open position at the current market valuation price.
 */
export function executeClosePosition(
  portfolio: PortfolioState,
  positionId: string,
  closingPrice: number
): { success: boolean; error?: string; newState?: PortfolioState } {
  const position = portfolio.openPositions.find((p) => p.id === positionId);
  if (!position) {
    return { success: false, error: 'Position not found.' };
  }

  const proceeds = Number((position.shares * closingPrice).toFixed(2));
  const realizedPnL = Number((proceeds - position.totalCost).toFixed(2));

  const newVirtualCash = Number((portfolio.virtualCash + proceeds).toFixed(2));
  const newRealizedTotal = Number((portfolio.realizedPnL + realizedPnL).toFixed(2));
  const remainingPositions = portfolio.openPositions.filter((p) => p.id !== positionId);

  const tradeRecord: PaperTradeHistory = {
    id: `trade-${Date.now()}`,
    marketId: position.marketId,
    marketQuestion: position.marketQuestion,
    outcome: position.outcome,
    action: 'SELL',
    shares: position.shares,
    price: closingPrice,
    realizedPnL,
    timestamp: new Date().toISOString(),
  };

  return {
    success: true,
    newState: {
      ...portfolio,
      virtualCash: newVirtualCash,
      realizedPnL: newRealizedTotal,
      openPositions: remainingPositions,
      tradeHistory: [tradeRecord, ...portfolio.tradeHistory],
    },
  };
}

/**
 * Computes aggregate summary metrics for the virtual portfolio.
 */
export function computePortfolioSummary(portfolio: PortfolioState) {
  const totalPositionsValue = Number(
    portfolio.openPositions.reduce((acc, p) => acc + p.currentValue, 0).toFixed(2)
  );
  const totalUnrealizedPnL = Number(
    portfolio.openPositions.reduce((acc, p) => acc + p.unrealizedPnL, 0).toFixed(2)
  );
  const totalEquity = Number((portfolio.virtualCash + totalPositionsValue).toFixed(2));
  const totalNetPnL = Number((portfolio.realizedPnL + totalUnrealizedPnL).toFixed(2));
  const returnOnCapital = Number(
    (((totalEquity - portfolio.startingBalance) / portfolio.startingBalance) * 100).toFixed(2)
  );

  return {
    virtualCash: portfolio.virtualCash,
    totalPositionsValue,
    totalUnrealizedPnL,
    totalRealizedPnL: portfolio.realizedPnL,
    totalEquity,
    totalNetPnL,
    returnOnCapital,
    openPositionsCount: portfolio.openPositions.length,
    tradesCount: portfolio.tradeHistory.length,
  };
}
