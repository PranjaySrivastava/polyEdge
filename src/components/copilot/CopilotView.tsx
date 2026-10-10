import React, { useState } from 'react';
import { Market, ScannerFinding } from '../../types/market';
import { PortfolioState } from '../../types/portfolio';
import { CopilotMessage } from '../../types/copilot';
import { processCopilotQuery } from '../../engine/copilotRouter';
import { Bot, Send, Sparkles, User, ArrowRight, Calculator, ExternalLink } from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

interface CopilotViewProps {
  markets: Market[];
  findings: ScannerFinding[];
  portfolio: PortfolioState;
  onInspectFinding: (findingId: string) => void;
  onSwitchTab: (tab: any) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  markets,
  findings,
  portfolio,
  onInspectFinding,
  onSwitchTab,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'copilot',
      text: 'Welcome to PolyEdge Copilot. I analyze live prediction contracts, evaluate probability discrepancies, and calculate simulated returns using deterministic financial models. How can I help your research?',
      timestamp: new Date().toISOString(),
      suggestedActions: [
        {
          label: 'Explain Top Discrepancy',
          actionType: 'inspect_finding',
          payload: findings[0]?.id,
        },
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');

  const quickPrompts = [
    'Explain the largest price discrepancy',
    'Calculate return on a $100 YES position',
    'Show my paper portfolio status',
    'What is the difference between implied and real probability?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const copilotMsg = processCopilotQuery(text, markets, findings, portfolio);

    setMessages((prev) => [...prev, userMsg, copilotMsg]);
    setInputQuery('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-gray-800/80 bg-gray-900/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Deterministic Market Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                ZERO-HALLUCINATION ENGINE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Evaluates quantitative models, spreads, and portfolios using local deterministic logic
            </p>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isCopilot = msg.sender === 'copilot';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isCopilot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  isCopilot
                    ? 'bg-violet-950 border border-violet-800/60 text-violet-300'
                    : 'bg-cyan-950 border border-cyan-800/60 text-cyan-300'
                }`}
              >
                {isCopilot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                  isCopilot
                    ? 'bg-gray-950 border border-gray-800 text-gray-200'
                    : 'bg-cyan-950/40 border border-cyan-800/50 text-cyan-100'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Calculation Breakdown card if available */}
                {msg.calculationBreakdown && (
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1.5 font-mono text-[11px]">
                    <div className="text-[10px] uppercase text-cyan-400 font-bold flex items-center gap-1">
                      <Calculator className="w-3 h-3" /> Deterministic Payoff Breakdown
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Capital Required:</span>
                      <span className="text-white">{formatUSD(msg.calculationBreakdown.investment ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Contract Shares:</span>
                      <span className="text-white">{msg.calculationBreakdown.shares} units</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Max Settlement Payout:</span>
                      <span className="text-cyan-300">{formatUSD(msg.calculationBreakdown.potentialPayout ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-gray-800">
                      <span>Net Potential Profit:</span>
                      <span>+{formatUSD(msg.calculationBreakdown.potentialProfit ?? 0)} (+{msg.calculationBreakdown.returnPercentage}%)</span>
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (action.actionType === 'inspect_finding' && action.payload) {
                            onInspectFinding(action.payload);
                          } else if (action.actionType === 'switch_tab' && action.payload) {
                            onSwitchTab(action.payload);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-violet-950/60 text-violet-300 hover:text-violet-200 border border-violet-800/40 text-[11px] font-medium transition-colors"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-6 py-2 bg-gray-950/60 border-t border-gray-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-gray-500 text-[11px] font-mono shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Prompts:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-[11px] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Copilot about price discrepancies, contracts, portfolio returns..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
