import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  badge,
}) => {
  return (
    <div className="terminal-card p-4 rounded-xl border border-gray-800/80 bg-gray-900/60 hover:border-gray-700/80 transition-all">
      <div className="flex items-center justify-between text-gray-400 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-cyan-400/80" />}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
            {badge}
          </span>
        )}
      </div>
      {subValue && (
        <div className="mt-1 flex items-center text-xs">
          <span
            className={`font-mono ${
              trend === 'positive'
                ? 'text-emerald-400'
                : trend === 'negative'
                ? 'text-rose-400'
                : 'text-gray-400'
            }`}
          >
            {subValue}
          </span>
        </div>
      )}
    </div>
  );
};
