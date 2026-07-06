/**
 * Response Enricher — Merges a static response with external data.
 *
 * This module is generic and category-agnostic. Any handler can use it
 * to combine its static JSON response with external information
 * (web search results, API data, documentation snippets, etc.).
 *
 * The output is markdown-friendly text suitable for display in the
 * React chat UI.
 */

/**
 * Merge a static response with web search results.
 *
 * @param {string} staticResponse — The base response from the intent JSON.
 * @param {Array<{ title: string, snippet: string, url: string }>} [webResults=[]]
 * @returns {string} — The enriched response text.
 */
function enrich(staticResponse, webResults = []) {
  // If no web results, return the static response as-is
  if (!Array.isArray(webResults) || webResults.length === 0) {
    return staticResponse;
  }

  // Build the web results section
  const webSection = webResults
    .map((result, index) => {
      const title = result.title || 'Untitled';
      const snippet = result.snippet || 'No preview available.';
      const url = result.url || '#';
      return `${index + 1}. **${title}**\n   ${snippet}\n   🔗 ${url}`;
    })
    .join('\n\n');

  // Combine static response + separator + web results
  return (
    `${staticResponse}\n\n` +
    `---\n` +
    `🔍 **Related resources from the web:**\n\n` +
    `${webSection}`
  );
}

module.exports = { enrich };
