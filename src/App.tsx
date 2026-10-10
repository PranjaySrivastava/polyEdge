import React, { useState } from 'react';
import { useMarkets } from './hooks/useMarkets';
import { useScanner } from './hooks/useScanner';
import { usePortfolio } from './hooks/usePortfolio';
import { Topbar } from './components/layout/Topbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { MarketsPage } from './pages/MarketsPage';
import { ScannerPage } from './pages/ScannerPage';
import { CopilotPage } from './pages/CopilotPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { MarketDetailModal } from './components/market/MarketDetailModal';
import { ExplanationModal } from './components/scanner/ExplanationModal';
import { OrderSlipModal } from './components/portfolio/OrderSlipModal';
import { Modal } from './components/common/Modal';
import { Market, ScannerFinding } from './types/market';
import { RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  // Hooks
  const {
    markets,
    filteredMarkets,
    loading,
    source,
    lastUpdated,
    errorMsg,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    toggleDataSource,
    reloadData,
  } = useMarkets();

  const {
    allFindings,
    filteredFindings,
    minDiscrepancy,
    setMinDiscrepancy,
    minLiquidity,
    setMinLiquidity,
    selectedRelType,
    setSelectedRelType,
    statusFilter,
    setStatusFilter,
    interestingCount,
  } = useScanner(markets);

  const {
    portfolio,
    summary,
    buyShares,
    closePosition,
    resetPortfolio,
  } = usePortfolio(markets);

  // Modals state
  const [detailMarket, setDetailMarket] = useState<Market | null>(null);
  const [explanationFinding, setExplanationFinding] = useState<ScannerFinding | null>(null);
  const [tradeModalMarket, setTradeModalMarket] = useState<Market | null>(null);
  const [tradeModalOutcome, setTradeModalOutcome] = useState<'YES' | 'NO'>('YES');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenTrade = (market: Market, outcome: 'YES' | 'NO' = 'YES') => {
    setTradeModalMarket(market);
    setTradeModalOutcome(outcome);
  };

  const handleInspectFindingById = (findingId: string) => {
    const target = allFindings.find((f) => f.id === findingId);
    if (target) {
      setExplanationFinding(target);
    } else {
      setActiveTab('scanner');
    }
  };

  const handleClosePositionWithToast = (positionId: string, price: number) => {
    const result = closePosition(positionId, price);
    if (result.success) {
      showToast('Position closed. Realized proceeds credited to virtual cash.', 'success');
    } else {
      showToast(result.error || 'Failed to close position.', 'error');
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col font-sans">
      {/* Top Telemetry Header */}
      <Topbar
        source={source}
        lastUpdated={lastUpdated}
        loading={loading}
        virtualCash={summary.virtualCash}
        onToggleSource={() => {
          toggleDataSource();
          showToast(
            source === 'demo'
              ? 'Attempting to fetch live Polymarket API records...'
              : 'Switched to High-Fidelity Demo Dataset.',
            'info'
          );
        }}
        onRefresh={() => {
          reloadData();
          showToast('Refreshing prediction market data feed...', 'info');
        }}
        onOpenPortfolio={() => setActiveTab('portfolio')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onResetPortfolio={() => setShowResetConfirm(true)}
          openPositionsCount={summary.openPositionsCount}
          interestingFindingsCount={interestingCount}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => reloadData()}
                className="underline hover:text-white font-mono text-[11px]"
              >
                Retry
              </button>
            </div>
          )}

          {activeTab === 'overview' && (
            <OverviewPage
              markets={markets}
              findings={allFindings}
              portfolio={portfolio}
              onNavigateTab={setActiveTab}
              onSelectMarket={setDetailMarket}
              onInspectFinding={setExplanationFinding}
              onTrade={handleOpenTrade}
            />
          )}

          {activeTab === 'markets' && (
            <MarketsPage
              markets={filteredMarkets}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSelectMarket={setDetailMarket}
              onTrade={handleOpenTrade}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerPage
              findings={filteredFindings}
              minDiscrepancy={minDiscrepancy}
              setMinDiscrepancy={setMinDiscrepancy}
              minLiquidity={minLiquidity}
              setMinLiquidity={setMinLiquidity}
              selectedRelType={selectedRelType}
              setSelectedRelType={setSelectedRelType}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onInspectFinding={setExplanationFinding}
              onTrade={handleOpenTrade}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotPage
              markets={markets}
              findings={allFindings}
              portfolio={portfolio}
              onInspectFinding={handleInspectFindingById}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioPage
              portfolio={portfolio}
              onClosePosition={handleClosePositionWithToast}
              onResetPortfolio={() => setShowResetConfirm(true)}
              onExploreMarkets={() => setActiveTab('markets')}
            />
          )}
        </main>
      </div>

      {/* Market Detail Dialog */}
      <MarketDetailModal
        market={detailMarket}
        onClose={() => setDetailMarket(null)}
        onTrade={handleOpenTrade}
      />

      {/* Discrepancy Explanation Dialog */}
      <ExplanationModal
        finding={explanationFinding}
        onClose={() => setExplanationFinding(null)}
        onTrade={handleOpenTrade}
      />

      {/* Simulated Order Slip Dialog */}
      <OrderSlipModal
        isOpen={!!tradeModalMarket}
        market={tradeModalMarket}
        defaultOutcome={tradeModalOutcome}
        virtualCash={summary.virtualCash}
        onClose={() => setTradeModalMarket(null)}
        onSubmitOrder={(m, out, shares, price) => {
          const res = buyShares(m, out, shares, price);
          if (res.success) {
            showToast(`Simulated order executed: ${shares} ${out} contracts bought.`, 'success');
          }
          return res;
        }}
      />

      {/* Reset Simulation Confirmation Dialog */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Virtual Paper Simulation?"
        subtitle="This action clears simulated positions and resets cash to $10,000.00"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-300 leading-relaxed">
            Are you sure you want to reset your paper portfolio? All open contracts and trade history records will be cleared, and your virtual balance will reset to the starting capital of $10,000.00.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetPortfolio();
                setShowResetConfirm(false);
                showToast('Paper portfolio successfully reset to $10,000.00 virtual cash.', 'info');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-200 bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Confirm Reset</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80 shadow-emerald-950/50'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/50'
                : 'bg-gray-900/90 text-cyan-200 border-cyan-800/60 shadow-cyan-950/50'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
