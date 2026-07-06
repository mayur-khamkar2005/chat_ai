/**
 * BaseProvider — Abstract contract for all search providers.
 *
 * Every search provider (Google, Brave, DuckDuckGo, SerpAPI, etc.)
 * must extend this class and implement the `search()` method.
 *
 * Contract:
 *   search(query, options) → Promise<Array<{ title, snippet, url }>>
 */
class BaseProvider {
  /**
   * Human-readable name of the provider.
   * @returns {string}
   */
  get name() {
    throw new Error('Provider must implement the "name" getter.');
  }

  /**
   * Execute a web search and return structured results.
   *
   * @param {string} query — The search query string.
   * @param {object} [options] — Optional overrides (maxResults, timeout, etc.).
   * @returns {Promise<Array<{ title: string, snippet: string, url: string }>>}
   */
  async search(query, options = {}) {
    throw new Error('Provider must implement the "search()" method.');
  }
}

module.exports = BaseProvider;
