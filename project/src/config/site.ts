// Central site configuration for external links.
// Update these values when real accounts are available.
// When a value is empty, the related UI button is disabled automatically
// so we never show a non-working link to players.

export interface SiteConfig {
  // Instagram handle WITHOUT the "@". Leave as an empty string if not set.
  instagramHandle: string;
  // Binance Pay ID shown on the donation screen. Leave empty to hide the donation block.
  binancePayId: string;
}

export const siteConfig: SiteConfig = {
  instagramHandle: 'nsniseig',
  binancePayId: '496596622',
};
