import React from 'react';
import { Market } from '../../types/market';
import { formatUSD, formatVolume, formatDate } from '../../utils/formatters';
import { ExternalLink, ShoppingCart, Info } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onSelect: (market: Market) => void;
  onTrade: (market: Market, outcome: 'YES' | 'NO') => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onSelect, onTrade }) => {
  const yesOutcome = market.outcomes.find((o) => o.name.toUpperCase() === 'YES') || market.outcomes[0];
  const noOutcome = market.outcomes.find((o) => o.name.toUpperCase() === 'NO') || market.outcomes[1];

  const yesPrice = yesOutcome?.price ?? 0.5;
  const noPrice = noOutcome?.price ?? (1 - yesPrice);
  const yesPercent = Math.round(yesPrice * 100);

  return (
    <div className="terminal-card terminal-card-hover rounded-xl p-5 border border-gray-800/80 bg-gray-900/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="px-2 py-0.5 rounded bg-gray-800/80 font-mono text-gray-300">
            {market.category}
          </span>
          <span className="font-mono text-[11px] text-gray-400">Ends {formatDate(market.endDate)}</span>
        </div>

        <h3
          onClick={() => onSelect(market)}
          className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-cyan-400 cursor-pointer transition-colors"
        >
          {market.question}
        </h3>

        {/* Probability visualization bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-baseline text-xs font-mono font-medium">
            <span className="text-cyan-400">YES {yesPercent}% (${yesPrice.toFixed(2)})</span>
            <span className="text-rose-400">NO {100 - yesPercent}% (${noPrice.toFixed(2)})</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden flex">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="bg-rose-500/80 h-full transition-all duration-300"
              style={{ width: `${100 - yesPercent}%` }}
            />
          </div>
        </div>

        {/* Liquidity & Volume */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono border-t border-gray-800/60 pt-3">
          <div>
            <div className="text-[10px] uppercase text-gray-400">24h Volume</div>
            <div className="font-semibold text-gray-200">{formatVolume(market.volume24h)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-gray-400">Liquidity</div>
            <div className="font-semibold text-gray-200">{formatUSD(market.liquidity, 0)}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center gap-2">
        <button
          onClick={() => onSelect(market)}
          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Rules</span>
        </button>
        <button
          onClick={() => onTrade(market, 'YES')}
          className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 hover:bg-cyan-900/80 transition-all flex items-center gap-1"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Buy YES</span>
        </button>
        <button
          onClick={() => onTrade(market, 'NO')}
          className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60 hover:bg-rose-900/80 transition-all"
        >
          Buy NO
        </button>
      </div>
    </div>
  );
};
