import React, { useState } from 'react';
import { PortfolioState } from '../types/portfolio';
import { computePortfolioSummary } from '../engine/paperTrading';
import { MetricCard } from '../components/common/MetricCard';
import { PositionTable } from '../components/portfolio/PositionTable';
import { TradeHistoryTable } from '../components/portfolio/TradeHistoryTable';
import { formatUSD } from '../utils/formatters';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Activity,
  RotateCcw,
  History,
  Layers,
} from 'lucide-react';

interface PortfolioPageProps {
  portfolio: PortfolioState;
  onClosePosition: (positionId: string, currentPrice: number) => { success: boolean; error?: string };
  onResetPortfolio: () => void;
  onExploreMarkets: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  portfolio,
  onClosePosition,
  onResetPortfolio,
  onExploreMarkets,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');
  const summary = computePortfolioSummary(portfolio);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Paper Trading Portfolio</h1>
          <p className="text-xs text-gray-400 mt-1">
            Track virtual account equity, mark-to-market valuations, and hypothetical trading performance.
          </p>
        </div>
        <button
          onClick={onResetPortfolio}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-900 hover:bg-rose-950/40 border border-gray-800 hover:border-rose-800 text-gray-300 hover:text-rose-300 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Equity"
          value={formatUSD(summary.totalEquity)}
          subValue={`Starting: ${formatUSD(portfolio.startingBalance)}`}
          icon={Briefcase}
        />
        <MetricCard
          label="Available Virtual Cash"
          value={formatUSD(summary.virtualCash)}
          subValue="Ready for new paper orders"
          icon={DollarSign}
        />
        <MetricCard
          label="Open Position Value"
          value={formatUSD(summary.totalPositionsValue)}
          subValue={`${summary.openPositionsCount} active contracts`}
          icon={Layers}
        />
        <MetricCard
          label="Total Net P&L"
          value={`${summary.totalNetPnL >= 0 ? '+' : ''}${formatUSD(summary.totalNetPnL)}`}
          subValue={`${summary.returnOnCapital >= 0 ? '+' : ''}${summary.returnOnCapital.toFixed(2)}% Return on Capital`}
          trend={summary.totalNetPnL >= 0 ? 'positive' : 'negative'}
          icon={Activity}
        />
      </div>

      {/* Tabs & Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'positions'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-800/60'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Positions ({summary.openPositionsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-800/60'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Execution History ({summary.tradesCount})</span>
          </button>
        </div>

        {activeTab === 'positions' ? (
          <PositionTable
            positions={portfolio.openPositions}
            onClosePosition={onClosePosition}
          />
        ) : (
          <TradeHistoryTable history={portfolio.tradeHistory} />
        )}
      </div>
    </div>
  );
};
