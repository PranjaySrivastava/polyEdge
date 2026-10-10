import React from 'react';
import { ScannerFinding } from '../../types/market';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { formatUSD } from '../../utils/formatters';
import {
  Calculator,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ExplanationModalProps {
  finding: ScannerFinding | null;
  onClose: () => void;
  onTrade: (market: any, outcome: 'YES' | 'NO') => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  finding,
  onClose,
  onTrade,
}) => {
  if (!finding) return null;

  const grossPercent = (finding.grossDifference * 100).toFixed(1);
  const feePercent = (finding.estimatedFees * 100).toFixed(1);
  const slippagePercent = (finding.estimatedSlippage * 100).toFixed(1);
  const netPercent = (finding.netEdge * 100).toFixed(1);

  return (
    <Modal
      isOpen={!!finding}
      onClose={onClose}
      title="Explainable Discrepancy Analysis"
      subtitle={`Relationship: ${finding.relationship.type.toUpperCase()} • Status: ${finding.status.toUpperCase()}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Pair Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-cyan-400 font-semibold text-[10px]">CONTRACT A</span>
              <span className="font-mono font-bold text-white">${finding.priceA.toFixed(2)}</span>
            </div>
            <div className="text-xs font-medium text-gray-200 line-clamp-2">{finding.marketA.question}</div>
            <div className="mt-2 text-[10px] text-gray-400 font-mono">
              Liquidity: {formatUSD(finding.marketA.liquidity, 0)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-violet-400 font-semibold text-[10px]">CONTRACT B</span>
              <span className="font-mono font-bold text-white">${finding.priceB.toFixed(2)}</span>
            </div>
            <div className="text-xs font-medium text-gray-200 line-clamp-2">{finding.marketB.question}</div>
            <div className="mt-2 text-[10px] text-gray-400 font-mono">
              Liquidity: {formatUSD(finding.marketB.liquidity, 0)}
            </div>
          </div>
        </div>

        {/* Step 1: Mathematical Derivation */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Mathematical Calculation & Net Payoff</span>
            </div>
            <StatusBadge type="relationship" value={finding.relationship.type} />
          </div>

          {/* Formula Callout */}
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 font-mono text-xs text-gray-300">
            <div className="text-gray-400 text-[10px] uppercase mb-1">Theoretical Model Equation:</div>
            <div className="text-cyan-300 font-bold">
              Net Edge = |P(A) - P(B)| - [ Taker Fee (2%) + Liquidity Slippage ]
            </div>
            <div className="mt-2 text-[11px] text-gray-300">
              Net Edge = |{finding.priceA.toFixed(2)} - {finding.priceB.toFixed(2)}| - [{finding.estimatedFees.toFixed(3)} + {finding.estimatedSlippage.toFixed(3)}] = <span className="text-emerald-400 font-bold">+{netPercent}%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs pt-1">
            <div className="p-2 rounded bg-gray-900 border border-gray-800">
              <div className="text-gray-400 text-[10px]">Gross Gap</div>
              <div className="font-bold text-white mt-0.5">+{grossPercent}%</div>
            </div>
            <div className="p-2 rounded bg-gray-900 border border-gray-800">
              <div className="text-gray-400 text-[10px]">Fees</div>
              <div className="font-bold text-rose-400 mt-0.5">-{feePercent}%</div>
            </div>
            <div className="p-2 rounded bg-gray-900 border border-gray-800">
              <div className="text-gray-400 text-[10px]">Slippage</div>
              <div className="font-bold text-rose-400 mt-0.5">-{slippagePercent}%</div>
            </div>
            <div className="p-2 rounded bg-gray-900 border border-emerald-900/50">
              <div className="text-emerald-400 text-[10px] font-bold">Net Edge</div>
              <div className="font-bold text-emerald-300 mt-0.5">+{netPercent}%</div>
            </div>
          </div>
        </div>

        {/* Step 2: Logical Constraint & Oracle Comparison */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Resolution Oracle & Settlement Criteria</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Oracle A</div>
              <div className="text-gray-200 mt-0.5 font-medium">{finding.relationship.oracleA}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-[10px] font-mono text-violet-400 uppercase font-semibold">Oracle B</div>
              <div className="text-gray-200 mt-0.5 font-medium">{finding.relationship.oracleB}</div>
            </div>
          </div>

          <div className="text-xs text-gray-300 bg-gray-900/70 p-3 rounded-lg border border-gray-800 leading-relaxed">
            <span className="font-semibold text-white">Constraint Logic: </span>
            {finding.relationship.logicalConstraint}
            <p className="mt-1 text-gray-400">{finding.relationship.notes}</p>
          </div>
        </div>

        {/* Step 3: Risk & Discrepancy Flags */}
        {finding.risks.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Basis & Settlement Risks</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
              {finding.risks.map((risk, idx) => (
                <li key={idx} className="leading-relaxed">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Direct Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="text-[11px] text-gray-400">
            Simulate positions without risking real capital.
          </div>
          <button
            onClick={() => {
              onClose();
              onTrade(finding.marketA, 'YES');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-gray-950 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Simulate Paper Trade</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
