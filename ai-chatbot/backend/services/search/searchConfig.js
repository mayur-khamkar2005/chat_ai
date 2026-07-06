/**
 * Search Configuration
 *
 * Determines which search provider is active and sets default options.
 * To switch providers, change SEARCH_PROVIDER in .env:
 *   SEARCH_PROVIDER=google   (default)
 *   SEARCH_PROVIDER=brave    (future)
 *   SEARCH_PROVIDER=serpapi  (future)
 */
module.exports = {
  activeProvider: process.env.SEARCH_PROVIDER || 'google',
  maxResults: parseInt(process.env.SEARCH_MAX_RESULTS, 10) || 3,
  timeoutMs: parseInt(process.env.SEARCH_TIMEOUT_MS, 10) || 5000,
};
