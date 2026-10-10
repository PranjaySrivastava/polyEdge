import { useState, useEffect, useMemo, useCallback } from 'react';
import { Market } from '../types/market';
import { PortfolioState } from '../types/portfolio';
import {
  INITIAL_PORTFOLIO_STATE,
  executeBuyOrder,
  executeClosePosition,
  computePortfolioSummary,
  calculatePositionValuation,
} from '../engine/paperTrading';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'polyedge_portfolio_v1';

export function usePortfolio(markets: Market[]) {
  const [portfolio, setPortfolio] = useState<PortfolioState>(() => {
    return loadFromStorage<PortfolioState>(STORAGE_KEY, INITIAL_PORTFOLIO_STATE);
  });

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY, portfolio);
  }, [portfolio]);

  // Update open positions valuations whenever live market prices change
  useEffect(() => {
    if (markets.length === 0 || portfolio.openPositions.length === 0) return;

    const marketPriceMap = new Map<string, { yesPrice: number; noPrice: number }>();
    markets.forEach((m) => {
      const yesObj = m.outcomes.find((o) => o.name.toUpperCase() === 'YES') || m.outcomes[0];
      const noObj = m.outcomes.find((o) => o.name.toUpperCase() === 'NO') || m.outcomes[1];
      marketPriceMap.set(m.id, {
        yesPrice: yesObj?.price ?? 0.5,
        noPrice: noObj?.price ?? 0.5,
      });
    });

    let hasChange = false;
    const revaluedPositions = portfolio.openPositions.map((pos) => {
      const prices = marketPriceMap.get(pos.marketId);
      if (!prices) return pos;
      const currentPrice = pos.outcome === 'YES' ? prices.yesPrice : prices.noPrice;
      if (currentPrice !== pos.currentPrice) {
        hasChange = true;
        return calculatePositionValuation(pos, currentPrice);
      }
      return pos;
    });

    if (hasChange) {
      setPortfolio((prev) => ({
        ...prev,
        openPositions: revaluedPositions,
      }));
    }
  }, [markets, portfolio.openPositions]);

  const buyShares = useCallback(
    (market: Market, outcome: 'YES' | 'NO', shares: number, price: number) => {
      const result = executeBuyOrder(portfolio, market, outcome, shares, price);
      if (result.success && result.newState) {
        setPortfolio(result.newState);
      }
      return result;
    },
    [portfolio]
  );

  const closePosition = useCallback(
    (positionId: string, currentMarketPrice: number) => {
      const result = executeClosePosition(portfolio, positionId, currentMarketPrice);
      if (result.success && result.newState) {
        setPortfolio(result.newState);
      }
      return result;
    },
    [portfolio]
  );

  const resetPortfolio = useCallback(() => {
    setPortfolio(INITIAL_PORTFOLIO_STATE);
  }, []);

  const summary = useMemo(() => {
    return computePortfolioSummary(portfolio);
  }, [portfolio]);

  return {
    portfolio,
    summary,
    buyShares,
    closePosition,
    resetPortfolio,
  };
}
