import React from 'react';
import { Market } from '../../types/market';
import { formatUSD, formatVolume, formatDate } from '../../utils/formatters';
import { Info, ShoppingCart } from 'lucide-react';

interface MarketTableProps {
  markets: Market[];
  onSelect: (market: Market) => void;
  onTrade: (market: Market, outcome: 'YES' | 'NO') => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({ markets, onSelect, onTrade }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800/80 bg-gray-900/60">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[11px] bg-gray-900/90">
            <th className="py-3 px-4">Market Question</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4 text-right">YES Price</th>
            <th className="py-3 px-4 text-right">NO Price</th>
            <th className="py-3 px-4 text-right">24h Volume</th>
            <th className="py-3 px-4 text-right">Liquidity</th>
            <th className="py-3 px-4 text-right">End Date</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 font-mono">
          {markets.map((m) => {
            const yesPrice = m.outcomes.find((o) => o.name.toUpperCase() === 'YES')?.price ?? 0.5;
            const noPrice = m.outcomes.find((o) => o.name.toUpperCase() === 'NO')?.price ?? (1 - yesPrice);

            return (
              <tr key={m.id} className="hover:bg-gray-800/40 transition-colors group">
                <td className="py-3 px-4 font-sans font-medium text-white max-w-md">
                  <div
                    onClick={() => onSelect(m)}
                    className="hover:text-cyan-400 cursor-pointer line-clamp-2"
                  >
                    {m.question}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                    {m.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-cyan-400">
                  ${yesPrice.toFixed(2)} ({(yesPrice * 100).toFixed(0)}%)
                </td>
                <td className="py-3 px-4 text-right font-semibold text-rose-400">
                  ${noPrice.toFixed(2)} ({(noPrice * 100).toFixed(0)}%)
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {formatVolume(m.volume24h)}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {formatUSD(m.liquidity, 0)}
                </td>
                <td className="py-3 px-4 text-right text-gray-400">
                  {formatDate(m.endDate)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 font-sans">
                    <button
                      onClick={() => onSelect(m)}
                      className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                      title="Inspect Rules"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onTrade(m, 'YES')}
                      className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 transition-colors"
                    >
                      Trade
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
