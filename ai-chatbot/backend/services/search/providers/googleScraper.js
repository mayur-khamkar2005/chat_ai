const BaseProvider = require('./baseProvider');

/**
 * GoogleScraper — Default search provider.
 *
 * Uses Node.js built-in `fetch` to query Google and extract
 * result titles, snippets, and URLs from the HTML response.
 * No API key required — suitable for development/personal projects.
 *
 * Returns: [{ title, snippet, url }]
 */
class GoogleScraper extends BaseProvider {
  get name() {
    return 'google';
  }

  /**
   * @param {string} query
   * @param {object} [options]
   * @param {number} [options.maxResults=3]
   * @param {number} [options.timeoutMs=5000]
   * @returns {Promise<Array<{ title: string, snippet: string, url: string }>>}
   */
  async search(query, options = {}) {
    const maxResults = options.maxResults || 3;
    const timeoutMs = options.timeoutMs || 5000;

    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.google.com/search?q=${encodedQuery}&num=${maxResults + 2}&hl=en`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        console.error(`[GoogleScraper] HTTP ${response.status} from Google`);
        return [];
      }

      const html = await response.text();
      return this._parseResults(html, maxResults);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`[GoogleScraper] Search timed out after ${timeoutMs}ms`);
      } else {
        console.error(`[GoogleScraper] Search failed:`, error.message);
      }
      return []; // Graceful degradation — static response still works
    }
  }

  /**
   * Parse Google HTML to extract search result data.
   * This is intentionally simple and brittle-tolerant — if parsing
   * fails, it returns whatever it could find (or an empty array).
   *
   * @param {string} html
   * @param {number} maxResults
   * @returns {Array<{ title: string, snippet: string, url: string }>}
   */
  _parseResults(html, maxResults) {
    const results = [];

    // Extract URLs from Google's redirect links: /url?q=ACTUAL_URL&...
    const linkRegex = /\/url\?q=(https?:\/\/[^&"]+)/g;
    const urls = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const decoded = decodeURIComponent(linkMatch[1]);
      // Skip Google's own pages and duplicates
      if (!decoded.includes('google.com') &&
          !decoded.includes('googleapis.com') &&
          !decoded.includes('gstatic.com') &&
          !urls.includes(decoded)) {
        urls.push(decoded);
      }
    }

    // Extract visible text snippets between HTML tags
    // Remove all HTML tags to get raw text, then split into chunks
    const textOnly = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ');

    // Build results by pairing URLs with nearby text
    for (let i = 0; i < Math.min(urls.length, maxResults); i++) {
      const url = urls[i];

      // Extract domain as a fallback title
      let title = '';
      try {
        title = new URL(url).hostname.replace('www.', '');
      } catch {
        title = url.substring(0, 60);
      }

      // Try to find a text snippet near where this URL appears in the raw text
      const domainInText = title.split('.')[0];
      const snippetIdx = textOnly.toLowerCase().indexOf(domainInText.toLowerCase());
      let snippet = '';
      if (snippetIdx > -1) {
        snippet = textOnly.substring(snippetIdx, snippetIdx + 200).trim();
        // Clean up: stop at the last complete sentence
        const lastPeriod = snippet.lastIndexOf('.');
        if (lastPeriod > 30) {
          snippet = snippet.substring(0, lastPeriod + 1);
        }
      }

      results.push({
        title: title,
        snippet: snippet || 'No preview available.',
        url: url,
      });
    }

    return results;
  }
}

module.exports = GoogleScraper;
