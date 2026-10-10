import { Market } from '../types/market';
import { DEMO_MARKETS } from './demoMarkets';

/**
 * Service to retrieve market data from Polymarket's public Gamma API with safe fallback.
 */
export async function fetchPolymarketData(preferLive: boolean = false): Promise<{
  markets: Market[];
  source: 'live' | 'demo';
  lastUpdated: string;
  error?: string;
}> {
  if (!preferLive) {
    return {
      markets: DEMO_MARKETS,
      source: 'demo',
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=15&active=true&closed=false&order=volume24hr&ascending=false',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No active markets returned from endpoint');
    }

    // Normalize raw Polymarket Gamma records
    const normalized: Market[] = data.map((item: any, idx: number) => {
      let yesPrice = 0.50;
      let noPrice = 0.50;

      if (item.outcomePrices) {
        try {
          const parsed = typeof item.outcomePrices === 'string' ? JSON.parse(item.outcomePrices) : item.outcomePrices;
          yesPrice = parseFloat(parsed[0]) || 0.50;
          noPrice = parseFloat(parsed[1]) || (1 - yesPrice);
        } catch {
          // fallback
        }
      }

      return {
        id: item.id || `poly-live-${idx}`,
        conditionId: item.conditionId,
        slug: item.slug || `market-${idx}`,
        question: item.question || 'Untitled Prediction Market',
        description: item.description || 'No description provided.',
        category: (item.category || 'Economics') as any,
        outcomes: [
          { name: 'YES', price: Number(yesPrice.toFixed(2)), bestBid: Number((yesPrice - 0.01).toFixed(2)), bestAsk: Number((yesPrice + 0.01).toFixed(2)) },
          { name: 'NO', price: Number(noPrice.toFixed(2)), bestBid: Number((noPrice - 0.01).toFixed(2)), bestAsk: Number((noPrice + 0.01).toFixed(2)) },
        ],
        volume24h: parseFloat(item.volume24hr) || 150000,
        liquidity: parseFloat(item.liquidity) || 45000,
        endDate: item.endDate || new Date(Date.now() + 86400000 * 30).toISOString(),
        resolutionSource: item.resolutionSource || 'Official Public Record',
        resolutionRules: item.description || 'Settles according to Polymarket market resolution rules.',
        source: 'live',
        updatedAt: new Date().toISOString(),
        sparkline: [yesPrice * 0.9, yesPrice * 0.95, yesPrice * 0.98, yesPrice],
      };
    });

    // Merge with our verified demo pairs so relationship scanner always functions
    const merged = [...normalized, ...DEMO_MARKETS.filter(dm => !normalized.some(m => m.id === dm.id))];

    return {
      markets: merged,
      source: 'live',
      lastUpdated: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn('Live Polymarket API fetch failed, falling back to Demo Dataset:', err?.message || err);
    return {
      markets: DEMO_MARKETS,
      source: 'demo',
      lastUpdated: new Date().toISOString(),
      error: err?.message || 'Network / CORS limitation. Loaded High-Fidelity Demo Dataset.',
    };
  }
}
