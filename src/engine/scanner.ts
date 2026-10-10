import { Market, MarketRelationship, ScannerFinding, FindingStatus } from '../types/market';
import { calculateGrossDifference, calculateExecutionFriction, calculateNetEdge } from './probability';
import { validateRelationshipConstraint } from './relationships';

/**
 * Scans markets for probability discrepancies across verified or candidate market pairs.
 */
export function scanMarketPairs(
  markets: Market[],
  relationships: MarketRelationship[]
): ScannerFinding[] {
  const findings: ScannerFinding[] = [];
  const marketMap = new Map<string, Market>();
  markets.forEach((m) => marketMap.set(m.id, m));

  for (const rel of relationships) {
    const marketA = marketMap.get(rel.marketAId);
    const marketB = marketMap.get(rel.marketBId);

    if (!marketA || !marketB) continue;

    // Retrieve respective outcome prices
    const outcomeAObj = marketA.outcomes.find((o) => o.name.toUpperCase() === rel.outcomeA.toUpperCase()) || marketA.outcomes[0];
    const outcomeBObj = marketB.outcomes.find((o) => o.name.toUpperCase() === rel.outcomeB.toUpperCase()) || marketB.outcomes[0];

    if (!outcomeAObj || !outcomeBObj) continue;

    const priceA = outcomeAObj.price;
    const priceB = outcomeBObj.price;

    const grossDifference = calculateGrossDifference(priceA, priceB);
    const minLiquidity = Math.min(marketA.liquidity, marketB.liquidity);
    const { fee, slippage, totalFriction } = calculateExecutionFriction(minLiquidity);
    const netEdge = calculateNetEdge(grossDifference, totalFriction);

    // Evaluate logical relationship constraint
    const validation = validateRelationshipConstraint(rel.type, priceA, priceB);

    // Determine Finding Status
    let status: FindingStatus = 'needs_review';
    const risks: string[] = [];

    // Collect risk flags
    if (!rel.verified) {
      risks.push('Unverified relationship: Price divergence may reflect different underlying event conditions.');
    }
    if (rel.oracleA !== rel.oracleB) {
      risks.push(`Oracle discrepancy: Contract A resolves via "${rel.oracleA}", while Contract B uses "${rel.oracleB}".`);
    }
    if (minLiquidity < 30000) {
      risks.push(`Low liquidity warning ($${minLiquidity.toLocaleString()}): Slippage may erode observed edge.`);
    }
    if (marketA.endDate !== marketB.endDate) {
      risks.push(`Resolution date mismatch: Market A expires ${marketA.endDate}, Market B expires ${marketB.endDate}.`);
    }

    if (rel.verified && netEdge > 0.015 && minLiquidity >= 25000) {
      status = 'interesting';
    } else if (minLiquidity < 10000 || !Number.isFinite(priceA) || !Number.isFinite(priceB)) {
      status = 'insufficient_data';
    } else {
      status = 'needs_review';
    }

    findings.push({
      id: `finding-${rel.id}`,
      relationship: rel,
      marketA,
      marketB,
      priceA,
      priceB,
      grossDifference,
      estimatedFees: fee,
      estimatedSlippage: slippage,
      netEdge,
      status,
      explanation: validation.reason,
      risks,
      detectedAt: new Date().toISOString(),
    });
  }

  // Sort descending by net edge
  return findings.sort((a, b) => b.netEdge - a.netEdge);
}
