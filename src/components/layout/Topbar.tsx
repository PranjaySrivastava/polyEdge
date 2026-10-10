import React from 'react';
import { RefreshCw, Database, DollarSign, Activity } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatUSD } from '../../utils/formatters';

interface TopbarProps {
  source: 'live' | 'demo';
  lastUpdated: string;
  loading: boolean;
  virtualCash: number;
  onToggleSource: () => void;
  onRefresh: () => void;
  onOpenPortfolio: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  source,
  lastUpdated,
  loading,
  virtualCash,
  onToggleSource,
  onRefresh,
  onOpenPortfolio,
}) => {
  return (
    <header className="h-16 px-6 bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-800/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-lg">PolyEdge</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                TERMINAL v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">Explainable Prediction Market Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Data Source Badge & Switcher */}
        <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-lg p-1">
          <StatusBadge type="source" value={source} />
          <button
            onClick={onToggleSource}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            title="Toggle between Live Polymarket API and High-Fidelity Demo Dataset"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{source === 'live' ? 'Switch to Demo' : 'Switch to Live API'}</span>
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Refresh Market Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Virtual Cash Indicator */}
        <button
          onClick={onOpenPortfolio}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/90 border border-gray-800 hover:border-cyan-500/50 transition-all text-left group"
        >
          <div className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-400 leading-none">Paper Cash</div>
            <div className="text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
              {formatUSD(virtualCash)}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
