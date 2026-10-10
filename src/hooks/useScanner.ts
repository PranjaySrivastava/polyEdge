import { useState, useMemo } from 'react';
import { Market, ScannerFinding, RelationshipType } from '../types/market';
import { scanMarketPairs } from '../engine/scanner';
import { VERIFIED_RELATIONSHIPS } from '../engine/relationships';

export function useScanner(markets: Market[]) {
  const [minDiscrepancy, setMinDiscrepancy] = useState<number>(0.02); // 2% minimum
  const [minLiquidity, setMinLiquidity] = useState<number>(10000); // $10k min
  const [selectedRelType, setSelectedRelType] = useState<RelationshipType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'interesting' | 'needs_review'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const allFindings = useMemo(() => {
    return scanMarketPairs(markets, VERIFIED_RELATIONSHIPS);
  }, [markets]);

  const filteredFindings = useMemo(() => {
    return allFindings.filter((f) => {
      const matchMinDisc = f.grossDifference >= minDiscrepancy;
      const minPairLiq = Math.min(f.marketA.liquidity, f.marketB.liquidity);
      const matchLiq = minPairLiq >= minLiquidity;
      const matchRel = selectedRelType === 'all' || f.relationship.type === selectedRelType;
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchSearch =
        searchFilter === '' ||
        f.marketA.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
        f.marketB.question.toLowerCase().includes(searchFilter.toLowerCase());

      return matchMinDisc && matchLiq && matchRel && matchStatus && matchSearch;
    });
  }, [allFindings, minDiscrepancy, minLiquidity, selectedRelType, statusFilter, searchFilter]);

  return {
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
    searchFilter,
    setSearchFilter,
    interestingCount: allFindings.filter((f) => f.status === 'interesting').length,
    needsReviewCount: allFindings.filter((f) => f.status === 'needs_review').length,
  };
}
