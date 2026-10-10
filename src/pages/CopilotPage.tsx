import React from 'react';
import { Market, ScannerFinding } from '../types/market';
import { PortfolioState } from '../types/portfolio';
import { CopilotView } from '../components/copilot/CopilotView';

interface CopilotPageProps {
  markets: Market[];
  findings: ScannerFinding[];
  portfolio: PortfolioState;
  onInspectFinding: (findingId: string) => void;
  onSwitchTab: (tab: any) => void;
}

export const CopilotPage: React.FC<CopilotPageProps> = ({
  markets,
  findings,
  portfolio,
  onInspectFinding,
  onSwitchTab,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Market Copilot</h1>
        <p className="text-xs text-gray-400 mt-1">
          Query PolyEdge's analytical engine using natural-language questions with deterministic financial calculations.
        </p>
      </div>

      <CopilotView
        markets={markets}
        findings={findings}
        portfolio={portfolio}
        onInspectFinding={onInspectFinding}
        onSwitchTab={onSwitchTab}
      />
    </div>
  );
};
