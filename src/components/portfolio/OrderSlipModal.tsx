import React, { useState } from 'react';
import { Market } from '../../types/market';
import { Modal } from '../common/Modal';
import { formatUSD } from '../../utils/formatters';
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

interface OrderSlipModalProps {
  market: Market | null;
  defaultOutcome?: 'YES' | 'NO';
  virtualCash: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (market: Market, outcome: 'YES' | 'NO', shares: number, price: number) => { success: boolean; error?: string };
}

export const OrderSlipModal: React.FC<OrderSlipModalProps> = ({
  market,
  defaultOutcome = 'YES',
  virtualCash,
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  if (!market) return null;

  const [outcome, setOutcome] = useState<'YES' | 'NO'>(defaultOutcome);
  const [shares, setShares] = useState<number>(100);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedOutcomeObj = market.outcomes.find((o) => o.name.toUpperCase() === outcome) || market.outcomes[0];
  const price = selectedOutcomeObj?.price ?? 0.50;

  const totalCost = Number((shares * price).toFixed(2));
  const maxPayout = Number((shares * 1.00).toFixed(2));
  const potentialProfit = Number((maxPayout - totalCost).toFixed(2));
  const returnPercentage = totalCost > 0 ? Number(((potentialProfit / totalCost) * 100).toFixed(1)) : 0;
  const isAffordable = totalCost <= virtualCash;

  const handleExecute = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (shares <= 0) {
      setErrorMsg('Shares must be greater than zero.');
      return;
    }
    if (!isAffordable) {
      setErrorMsg(`Insufficient virtual cash. Available: ${formatUSD(virtualCash)}`);
      return;
    }

    const res = onSubmitOrder(market, outcome, shares, price);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to place order.');
    } else {
      setSuccessMsg(`Successfully bought ${shares} ${outcome} contracts at $${price.toFixed(2)}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paper Trading Order Slip"
      subtitle="Simulate hypothetical prediction market orders without capital risk"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Market Title */}
        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
          <div className="text-[10px] font-mono uppercase text-gray-400">Target Contract</div>
          <p className="text-xs font-semibold text-white mt-1 line-clamp-2">{market.question}</p>
        </div>

        {/* Outcome Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase font-mono mb-2">
            Select Contract Outcome
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOutcome('YES')}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                outcome === 'YES'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              YES (${market.outcomes.find(o => o.name === 'YES')?.price.toFixed(2) ?? '0.50'})
            </button>
            <button
              type="button"
              onClick={() => setOutcome('NO')}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                outcome === 'NO'
                  ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-lg shadow-rose-500/20'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              NO (${market.outcomes.find(o => o.name === 'NO')?.price.toFixed(2) ?? '0.50'})
            </button>
          </div>
        </div>

        {/* Shares Quantity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-300 uppercase font-mono">
              Number of Contracts (Shares)
            </label>
            <span className="text-xs font-mono text-gray-400">Available: {formatUSD(virtualCash)}</span>
          </div>

          <div className="relative">
            <input
              type="number"
              min={1}
              step={10}
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Quick Quantity Buttons */}
          <div className="flex items-center gap-2 mt-2">
            {[25, 50, 100, 250, 500].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setShares(qty)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors border ${
                  shares === qty
                    ? 'bg-gray-800 text-cyan-400 border-cyan-800'
                    : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>
        </div>

        {/* Order Economics Matrix */}
        <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Execution Price:</span>
            <span className="text-white">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Capital Required:</span>
            <span className="text-white font-bold">{formatUSD(totalCost)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Max Settlement Payout:</span>
            <span className="text-cyan-400">{formatUSD(maxPayout)}</span>
          </div>
          <div className="flex justify-between text-gray-400 pt-1 border-t border-gray-800">
            <span>Potential Net Profit:</span>
            <span className="text-emerald-400 font-bold">
              +{formatUSD(potentialProfit)} (+{returnPercentage}%)
            </span>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleExecute}
          disabled={!isAffordable || shares <= 0}
          className={`w-full py-3 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
            isAffordable && shares > 0
              ? 'bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-lg shadow-cyan-500/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Execute Simulated Order</span>
        </button>
      </div>
    </Modal>
  );
};
