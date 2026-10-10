import React from 'react';
import { PaperTradeHistory } from '../../types/portfolio';
import { formatUSD, formatDate } from '../../utils/formatters';

interface TradeHistoryTableProps {
  history: PaperTradeHistory[];
}

export const TradeHistoryTable: React.FC<TradeHistoryTableProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="p-6 text-center rounded-xl bg-gray-900/40 border border-gray-800 text-gray-500 text-xs">
        No completed trades recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800/80 bg-gray-900/60">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[11px] bg-gray-900/90">
            <th className="py-2.5 px-4">Timestamp</th>
            <th className="py-2.5 px-4">Action</th>
            <th className="py-2.5 px-4">Market / Contract</th>
            <th className="py-2.5 px-4">Side</th>
            <th className="py-2.5 px-4 text-right">Shares</th>
            <th className="py-2.5 px-4 text-right">Price</th>
            <th className="py-2.5 px-4 text-right">Realized P&L</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 font-mono">
          {history.map((t) => (
            <tr key={t.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="py-2.5 px-4 text-gray-400 text-[11px]">{formatDate(t.timestamp)}</td>
              <td className="py-2.5 px-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.action === 'BUY'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {t.action}
                </span>
              </td>
              <td className="py-2.5 px-4 font-sans text-gray-200 max-w-xs truncate">
                {t.marketQuestion}
              </td>
              <td className="py-2.5 px-4">
                <span className={t.outcome === 'YES' ? 'text-cyan-400' : 'text-rose-400'}>
                  {t.outcome}
                </span>
              </td>
              <td className="py-2.5 px-4 text-right text-gray-300">{t.shares}</td>
              <td className="py-2.5 px-4 text-right text-white">${t.price.toFixed(2)}</td>
              <td className="py-2.5 px-4 text-right font-bold">
                {t.realizedPnL !== undefined ? (
                  <span className={t.realizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {t.realizedPnL >= 0 ? '+' : ''}
                    {formatUSD(t.realizedPnL)}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
