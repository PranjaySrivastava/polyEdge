import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ScanSearch,
  Bot,
  Briefcase,
  Mic,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

export type NavTab = 'overview' | 'markets' | 'scanner' | 'copilot' | 'portfolio';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onResetPortfolio: () => void;
  openPositionsCount: number;
  interestingFindingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onResetPortfolio,
  openPositionsCount,
  interestingFindingsCount,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'markets' as NavTab,
      label: 'Markets Explorer',
      icon: TrendingUp,
      badge: undefined,
    },
    {
      id: 'scanner' as NavTab,
      label: 'Edge Scanner',
      icon: ScanSearch,
      badge: interestingFindingsCount > 0 ? `${interestingFindingsCount} Edge` : undefined,
      badgeColor: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60',
    },
    {
      id: 'copilot' as NavTab,
      label: 'Market Copilot',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-violet-950/80 text-violet-300 border border-violet-800/60',
    },
    {
      id: 'portfolio' as NavTab,
      label: 'Paper Portfolio',
      icon: Briefcase,
      badge: openPositionsCount > 0 ? `${openPositionsCount}` : undefined,
      badgeColor: 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60',
    },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-gray-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono">
            TERMINAL MODULES
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-800/90 text-cyan-400 font-semibold shadow-inner border border-gray-700/60'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      item.badgeColor || 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Tools & Wispr Flow Badge */}
      <div className="p-4 border-t border-gray-800/80 space-y-3">
        {/* Reset simulation button */}
        <button
          onClick={onResetPortfolio}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-rose-300 bg-gray-900/50 hover:bg-rose-950/30 border border-gray-800 hover:border-rose-900/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Paper Simulation</span>
        </button>

        {/* Wispr Flow Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-950/40 via-gray-900/50 to-cyan-950/30 border border-violet-800/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded bg-violet-900/60 text-violet-300">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-white">Built with Wispr Flow</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight mb-2">
            Voice-driven prediction market intelligence.
          </p>
          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
          >
            <span>Wispr Flow Referral</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
