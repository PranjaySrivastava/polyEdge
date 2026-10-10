import React from 'react';
import { FindingStatus, RelationshipType } from '../../types/market';

interface StatusBadgeProps {
  type: 'status' | 'relationship' | 'source';
  value: FindingStatus | RelationshipType | 'live' | 'demo';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  if (type === 'source') {
    if (value === 'live') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE FEED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        DEMO DATASET
      </span>
    );
  }

  if (type === 'status') {
    if (value === 'interesting') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
          INTERESTING
        </span>
      );
    }
    if (value === 'needs_review') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/50">
          NEEDS REVIEW
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
        INSUFFICIENT DATA
      </span>
    );
  }

  // Relationship Badge
  const labels: Record<string, string> = {
    equivalent: 'Equivalent (1:1)',
    subset: 'Subset Monotonicity',
    mutually_exclusive: 'Mutually Exclusive',
    conditional: 'Conditional Catalyst',
    unverified: 'Unverified Correl.',
  };

  const colors: Record<string, string> = {
    equivalent: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50',
    subset: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
    mutually_exclusive: 'bg-fuchsia-950/50 text-fuchsia-300 border-fuchsia-800/50',
    conditional: 'bg-blue-950/50 text-blue-300 border-blue-800/50',
    unverified: 'bg-gray-800/80 text-gray-400 border-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${colors[value] || 'bg-gray-800 text-gray-300'}`}>
      {labels[value] || value}
    </span>
  );
};
