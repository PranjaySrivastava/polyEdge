import React from 'react';
import { Market } from '../../types/market';
import { Modal } from '../common/Modal';
import { formatUSD, formatVolume, formatDate } from '../../utils/formatters';
import { ShieldCheck, Calendar, DollarSign, Activity, ShoppingCart } from 'lucide-react';

interface MarketDetailModalProps {
  market: Market | null;
  onClose: () => void;
  onTrade: (market: Market, outcome: 'YES' | 'NO') => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  market,
  onClose,
  onTrade,
}) => {
  if (!market) return null;

  const yesOutcome = market.outcomes.find((o) => o.name.toUpperCase() === 'YES') || market.outcomes[0];
  const noOutcome = market.outcomes.find((o) => o.name.toUpperCase() === 'NO') || market.outcomes[1];

  return (
    <Modal
      isOpen={!!market}
      onClose={onClose}
      title="Market Contract Details"
      subtitle={`Category: ${market.category} • ID: ${market.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white leading-relaxed">
            {market.question}
          </h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            {market.description}
          </p>
        </div>

        {/* Outcome Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">YES Outcome</div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                ${yesOutcome?.price.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onTrade(market, 'YES');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-gray-950 hover:bg-cyan-400 transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Trade YES</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-rose-400 font-semibold">NO Outcome</div>
              <div className="text-xl font-bold font-mono text-rose-300">
                ${noOutcome?.price.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onTrade(market, 'NO');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 text-gray-950 hover:bg-rose-400 transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Trade NO</span>
            </button>
          </div>
        </div>

        {/* Contract Telemetry Grid */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800 font-mono text-xs">
          <div>
            <div className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" /> 24h Volume
            </div>
            <div className="text-white font-semibold mt-1">{formatVolume(market.volume24h)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Liquidity
            </div>
            <div className="text-white font-semibold mt-1">{formatUSD(market.liquidity, 0)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-violet-400" /> Expiry Date
            </div>
            <div className="text-white font-semibold mt-1">{formatDate(market.endDate)}</div>
          </div>
        </div>

        {/* Resolution Oracle & Settlement Clauses */}
        <div className="space-y-3 p-4 rounded-xl bg-gray-950 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Resolution Oracle & Verification Criteria</span>
          </div>
          <div className="text-xs text-cyan-300 font-mono">
            Source: {market.resolutionSource}
          </div>
          <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-3 rounded-lg border border-gray-800 font-sans">
            {market.resolutionRules}
          </p>
        </div>
      </div>
    </Modal>
  );
};
