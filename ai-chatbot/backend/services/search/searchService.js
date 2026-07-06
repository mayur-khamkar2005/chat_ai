const config = require('./searchConfig');

/**
 * Provider Registry
 *
 * Maps provider names (from config/env) to their module paths.
 * To add a new provider, just add a new entry here and create the file.
 */
const PROVIDERS = {
  google: () => require('./providers/googleScraper'),
};

/**
 * Lazy-loaded singleton — created on first call to search().
 */
let _providerInstance = null;

function getProvider() {
  if (_providerInstance) return _providerInstance;

  const ProviderClass = PROVIDERS[config.activeProvider];
  if (!ProviderClass) {
    console.error(
      `[SearchService] Unknown provider "${config.activeProvider}". ` +
      `Available: ${Object.keys(PROVIDERS).join(', ')}. Falling back to google.`
    );
    const FallbackClass = PROVIDERS.google;
    _providerInstance = new (FallbackClass())();
    return _providerInstance;
  }

  _providerInstance = new (ProviderClass())();
  console.log(`[SearchService] Using provider: ${_providerInstance.name}`);
  return _providerInstance;
}

/**
 * Generic search interface.
 *
 * Any handler in any category can call this without knowing
 * which provider is behind it.
 *
 * @param {string} query — The search query.
 * @param {object} [options] — Optional overrides for maxResults, timeoutMs.
 * @returns {Promise<Array<{ title: string, snippet: string, url: string }>>}
 */
async function search(query, options = {}) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return [];
  }

  const mergedOptions = {
    maxResults: options.maxResults || config.maxResults,
    timeoutMs: options.timeoutMs || config.timeoutMs,
  };

  const provider = getProvider();

  try {
    return await provider.search(query.trim(), mergedOptions);
  } catch (error) {
    console.error(`[SearchService] Search failed:`, error.message);
    return []; // Graceful degradation
  }
}

module.exports = { search };
