import React from 'react';
import { ScannerFinding, RelationshipType } from '../types/market';
import { DiscrepancyCard } from '../components/scanner/DiscrepancyCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScanSearch, Filter, Sparkles, AlertCircle } from 'lucide-react';

interface ScannerPageProps {
  findings: ScannerFinding[];
  minDiscrepancy: number;
  setMinDiscrepancy: (d: number) => void;
  minLiquidity: number;
  setMinLiquidity: (l: number) => void;
  selectedRelType: RelationshipType | 'all';
  setSelectedRelType: (rel: any) => void;
  statusFilter: 'all' | 'interesting' | 'needs_review';
  setStatusFilter: (s: any) => void;
  onInspectFinding: (finding: ScannerFinding) => void;
  onTrade: (market: any, outcome: 'YES' | 'NO') => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  findings,
  minDiscrepancy,
  setMinDiscrepancy,
  minLiquidity,
  setMinLiquidity,
  selectedRelType,
  setSelectedRelType,
  statusFilter,
  setStatusFilter,
  onInspectFinding,
  onTrade,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
            QUANTITATIVE SCREENING
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs text-gray-400 font-mono">
            {findings.length} Candidates Screened
          </span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Edge Scanner & Cross-Market Discrepancy Matrix
        </h1>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
          Identifies pricing discrepancies across related prediction event contracts, validates mathematical constraints, deducts taker fees & slippage, and highlights resolution risks.
        </p>
      </div>

      {/* Scanner Filter Panel */}
      <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-cyan-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Findings ({findings.length})
            </button>
            <button
              onClick={() => setStatusFilter('interesting')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                statusFilter === 'interesting'
                  ? 'bg-emerald-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Verified Edges
            </button>
            <button
              onClick={() => setStatusFilter('needs_review')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                statusFilter === 'needs_review'
                  ? 'bg-amber-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Needs Review
            </button>
          </div>

          {/* Relationship Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Relationship:</span>
            <select
              value={selectedRelType}
              onChange={(e) => setSelectedRelType(e.target.value as any)}
              className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Types</option>
              <option value="equivalent">Equivalent (1:1)</option>
              <option value="subset">Subset Monotonicity</option>
              <option value="mutually_exclusive">Mutually Exclusive</option>
              <option value="conditional">Conditional</option>
            </select>
          </div>

          {/* Min Discrepancy Threshold */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">
              Min Delta: <span className="text-white font-bold">{(minDiscrepancy * 100).toFixed(0)}%</span>
            </span>
            <input
              type="range"
              min={0.01}
              max={0.15}
              step={0.01}
              value={minDiscrepancy}
              onChange={(e) => setMinDiscrepancy(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Discrepancy Findings Grid */}
      {findings.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-gray-900/40 border border-gray-800 text-gray-400">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm font-medium">No discrepancies match the selected criteria.</p>
          <p className="text-xs text-gray-500 mt-1">
            Try lowering the Minimum Delta filter or expanding the relationship category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {findings.map((finding) => (
            <DiscrepancyCard
              key={finding.id}
              finding={finding}
              onInspect={onInspectFinding}
              onTrade={onTrade}
            />
          ))}
        </div>
      )}
    </div>
  );
};
