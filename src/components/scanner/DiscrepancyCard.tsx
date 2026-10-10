import React from 'react';
import { ScannerFinding } from '../../types/market';
import { StatusBadge } from '../common/StatusBadge';
import { formatUSD } from '../../utils/formatters';
import { ArrowRight, HelpCircle, ShoppingCart } from 'lucide-react';

interface DiscrepancyCardProps {
  finding: ScannerFinding;
  onInspect: (finding: ScannerFinding) => void;
  onTrade: (marketA: any, outcome: 'YES' | 'NO') => void;
}

export const DiscrepancyCard: React.FC<DiscrepancyCardProps> = ({
  finding,
  onInspect,
  onTrade,
}) => {
  const grossPercent = (finding.grossDifference * 100).toFixed(1);
  const netPercent = (finding.netEdge * 100).toFixed(1);
  const isNetPositive = finding.netEdge > 0;

  return (
    <div className="terminal-card terminal-card-hover rounded-xl p-5 border border-gray-800/80 bg-gray-900/60 flex flex-col justify-between">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge type="status" value={finding.status} />
          <StatusBadge type="relationship" value={finding.relationship.type} />
        </div>

        {/* Pair Comparison Display */}
        <div className="space-y-3 mt-2">
          {/* Market A */}
          <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800/80">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="font-mono text-[10px] text-cyan-400 font-semibold">CONTRACT A</span>
              <span className="font-mono text-cyan-300 font-bold">${finding.priceA.toFixed(2)} ({(finding.priceA * 100).toFixed(0)}%)</span>
            </div>
            <p className="text-xs font-medium text-white line-clamp-2">{finding.marketA.question}</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Market B */}
          <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800/80">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="font-mono text-[10px] text-violet-400 font-semibold">CONTRACT B</span>
              <span className="font-mono text-violet-300 font-bold">${finding.priceB.toFixed(2)} ({(finding.priceB * 100).toFixed(0)}%)</span>
            </div>
            <p className="text-xs font-medium text-white line-clamp-2">{finding.marketB.question}</p>
          </div>
        </div>

        {/* Edge metrics breakdown */}
        <div className="mt-4 p-3 rounded-xl bg-gray-900/90 border border-gray-800 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <div className="text-[10px] uppercase text-gray-400">Gross Delta</div>
            <div className="text-sm font-bold text-gray-200">+{grossPercent}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-gray-400">Estimated Net Edge</div>
            <div className={`text-sm font-bold ${isNetPositive ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isNetPositive ? `+${netPercent}%` : `${netPercent}%`}
            </div>
          </div>
        </div>

        {/* Short explanation summary */}
        <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
          {finding.explanation}
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center gap-2">
        <button
          onClick={() => onInspect(finding)}
          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-gray-800 text-cyan-300 hover:bg-gray-700 hover:text-cyan-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Explain Edge</span>
        </button>
        <button
          onClick={() => onTrade(finding.marketA, 'YES')}
          className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 transition-all flex items-center gap-1"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Simulate</span>
        </button>
      </div>
    </div>
  );
};
