/** Format a fraction (0 to 1) as a whole percent. 0.41 -> "41%". */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** Format a USD amount with comma groups and two decimals. 0.94 -> "$0.94". */
export function formatUsd(n: number): string {
  const sign = n < 0 ? '-' : '';
  const [whole, cents] = Math.abs(n).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${grouped}.${cents}`;
}

/** Format milliseconds as seconds with one decimal. 2400 -> "2.4 s". */
export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)} s`;
}
