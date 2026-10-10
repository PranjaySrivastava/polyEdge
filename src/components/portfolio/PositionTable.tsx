import React, { useState } from 'react';
import { PaperPosition } from '../../types/portfolio';
import { formatUSD } from '../../utils/formatters';
import { XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PositionTableProps {
  positions: PaperPosition[];
  onClosePosition: (positionId: string, currentPrice: number) => { success: boolean; error?: string };
}

export const PositionTable: React.FC<PositionTableProps> = ({ positions, onClosePosition }) => {
  const [closingId, setClosingId] = useState<string | null>(null);

  if (positions.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-gray-900/40 border border-gray-800 text-gray-400">
        <p className="text-sm font-medium">No active simulated positions.</p>
        <p className="text-xs text-gray-500 mt-1">
          Explore the Edge Scanner or Markets to open your first risk-free paper trade.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800/80 bg-gray-900/60">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[11px] bg-gray-900/90">
            <th className="py-3 px-4">Market / Contract</th>
            <th className="py-3 px-4">Side</th>
            <th className="py-3 px-4 text-right">Shares</th>
            <th className="py-3 px-4 text-right">Entry Price</th>
            <th className="py-3 px-4 text-right">Current Price</th>
            <th className="py-3 px-4 text-right">Total Cost</th>
            <th className="py-3 px-4 text-right">Current Value</th>
            <th className="py-3 px-4 text-right">Unrealized P&L</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 font-mono">
          {positions.map((pos) => {
            const isProfit = pos.unrealizedPnL >= 0;

            return (
              <tr key={pos.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4 font-sans font-medium text-white max-w-xs">
                  <div className="line-clamp-2">{pos.marketQuestion}</div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pos.outcome === 'YES'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {pos.outcome}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-gray-200">{pos.shares}</td>
                <td className="py-3 px-4 text-right text-gray-400">${pos.entryPrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-semibold text-white">
                  ${pos.currentPrice.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-gray-400">{formatUSD(pos.totalCost)}</td>
                <td className="py-3 px-4 text-right font-semibold text-white">
                  {formatUSD(pos.currentValue)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isProfit ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isProfit ? '+' : ''}
                      {formatUSD(pos.unrealizedPnL)} ({isProfit ? '+' : ''}
                      {pos.unrealizedPnLPercent.toFixed(1)}%)
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => {
                      setClosingId(pos.id);
                      onClosePosition(pos.id, pos.currentPrice);
                      setTimeout(() => setClosingId(null), 800);
                    }}
                    disabled={closingId === pos.id}
                    className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-800 hover:bg-rose-950 hover:text-rose-300 border border-gray-700 hover:border-rose-800 text-gray-300 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
