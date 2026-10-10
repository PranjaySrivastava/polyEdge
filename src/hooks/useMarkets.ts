import { useState, useEffect, useMemo, useCallback } from 'react';
import { Market } from '../types/market';
import { fetchPolymarketData } from '../services/polymarketApi';

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [preferLive, setPreferLive] = useState<boolean>(false);
  const [source, setSource] = useState<'live' | 'demo'>('demo');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity' | 'price' | 'date'>('volume');

  const reloadData = useCallback(async (isLive: boolean) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await fetchPolymarketData(isLive);
      setMarkets(result.markets);
      setSource(result.source);
      setLastUpdated(result.lastUpdated);
      if (result.error) {
        setErrorMsg(result.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData(preferLive);
  }, [preferLive, reloadData]);

  const toggleDataSource = () => {
    const next = !preferLive;
    setPreferLive(next);
  };

  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const matchSearch =
        m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'All' || m.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === 'volume') return b.volume24h - a.volume24h;
      if (sortBy === 'liquidity') return b.liquidity - a.liquidity;
      if (sortBy === 'price') return (b.outcomes[0]?.price ?? 0) - (a.outcomes[0]?.price ?? 0);
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });
  }, [markets, searchQuery, selectedCategory, sortBy]);

  return {
    markets,
    filteredMarkets,
    loading,
    preferLive,
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
    reloadData: () => reloadData(preferLive),
  };
}
