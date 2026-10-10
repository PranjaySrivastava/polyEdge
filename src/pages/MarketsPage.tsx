import React, { useState } from 'react';
import { Market } from '../types/market';
import { MarketCard } from '../components/market/MarketCard';
import { MarketTable } from '../components/market/MarketTable';
import { Search, LayoutGrid, Table as TableIcon, Filter } from 'lucide-react';

interface MarketsPageProps {
  markets: Market[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'volume' | 'liquidity' | 'price' | 'date';
  setSortBy: (sort: any) => void;
  onSelectMarket: (market: Market) => void;
  onTrade: (market: Market, outcome: 'YES' | 'NO') => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  markets,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onSelectMarket,
  onTrade,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = ['All', 'Economics', 'Crypto', 'Politics'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Market Explorer</h1>
        <p className="text-xs text-gray-400 mt-1">
          Inspect live prediction market questions, implied probabilities, volume depth, and resolution rules.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets by keyword or event..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filters and Layout */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Category Chips */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-cyan-500 text-gray-950 font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="volume">Sort: 24h Volume</option>
            <option value="liquidity">Sort: Liquidity Depth</option>
            <option value="price">Sort: YES Price</option>
            <option value="date">Sort: Expiry Date</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Markets Content */}
      {markets.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-gray-900/40 border border-gray-800 text-gray-400">
          <p className="text-sm font-medium">No matching prediction markets found.</p>
          <p className="text-xs text-gray-500 mt-1">Try broadening your search query or category filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onSelect={onSelectMarket}
              onTrade={onTrade}
            />
          ))}
        </div>
      ) : (
        <MarketTable markets={markets} onSelect={onSelectMarket} onTrade={onTrade} />
      )}
    </div>
  );
};
