import React from 'react';
import { Market, ScannerFinding } from '../types/market';
import { PortfolioState } from '../types/portfolio';
import { MetricCard } from '../components/common/MetricCard';
import { DiscrepancyCard } from '../components/scanner/DiscrepancyCard';
import { MarketCard } from '../components/market/MarketCard';
import { formatUSD } from '../utils/formatters';
import { computePortfolioSummary } from '../engine/paperTrading';
import {
  TrendingUp,
  ScanSearch,
  DollarSign,
  Activity,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface OverviewPageProps {
  markets: Market[];
  findings: ScannerFinding[];
  portfolio: PortfolioState;
  onNavigateTab: (tab: any) => void;
  onSelectMarket: (market: Market) => void;
  onInspectFinding: (finding: ScannerFinding) => void;
  onTrade: (market: Market, outcome: 'YES' | 'NO') => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  markets,
  findings,
  portfolio,
  onNavigateTab,
  onSelectMarket,
  onInspectFinding,
  onTrade,
}) => {
  const summary = computePortfolioSummary(portfolio);
  const topFindings = findings.slice(0, 2);
  const featuredMarkets = markets.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950/40 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
              QUANTITATIVE PREDICTION TERMINAL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs text-gray-400 font-mono">Live Screen</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Prediction Market Probability Discrepancies & Execution Analysis
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Real-time screening of related event contracts on Polymarket with explainable net payoff derivations, execution fee modeling, and simulated paper-trading verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('scanner')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Scanner</span>
          </button>
          <button
            onClick={() => onNavigateTab('copilot')}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <span>Ask Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Tickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tracked Markets"
          value={markets.length.toString()}
          subValue="Cross-category contracts"
          icon={TrendingUp}
        />
        <MetricCard
          label="Detected Edges"
          value={findings.length.toString()}
          subValue={`${findings.filter((f) => f.status === 'interesting').length} verified positive`}
          trend="positive"
          icon={ScanSearch}
        />
        <MetricCard
          label="Virtual Equity"
          value={formatUSD(summary.totalEquity)}
          subValue={`Available: ${formatUSD(summary.virtualCash)}`}
          icon={DollarSign}
        />
        <MetricCard
          label="Simulated Net P&L"
          value={`${summary.totalNetPnL >= 0 ? '+' : ''}${formatUSD(summary.totalNetPnL)}`}
          subValue={`${summary.returnOnCapital >= 0 ? '+' : ''}${summary.returnOnCapital.toFixed(2)}% ROC`}
          trend={summary.totalNetPnL >= 0 ? 'positive' : 'negative'}
          icon={Activity}
        />
      </div>

      {/* Top Discrepancy Highlights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              High-Conviction Discrepancy Candidates
            </h2>
            <p className="text-xs text-gray-400">
              Cross-contract probability divergences with estimated fees and slippage deducted
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('scanner')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <span>View All ({findings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topFindings.map((finding) => (
            <DiscrepancyCard
              key={finding.id}
              finding={finding}
              onInspect={onInspectFinding}
              onTrade={onTrade}
            />
          ))}
        </div>
      </div>

      {/* Active Prediction Markets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Benchmark Prediction Contracts
            </h2>
            <p className="text-xs text-gray-400">
              Active macro, political, and cryptocurrency events
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('markets')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <span>Market Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onSelect={onSelectMarket}
              onTrade={onTrade}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
