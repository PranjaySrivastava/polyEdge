/**
 * Number and financial string formatters for PolyEdge terminal.
 */

export function formatUSD(value: number, minDecimals: number = 2): string {
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: 2,
  })}`;
}

export function formatProbability(price: number): string {
  if (!Number.isFinite(price)) return 'N/A';
  return `${(price * 100).toFixed(1)}%`;
}

export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return '$0.00';
  return `$${price.toFixed(2)}`;
}

export function formatVolume(val: number): string {
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}k`;
  }
  return `$${val.toLocaleString()}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
