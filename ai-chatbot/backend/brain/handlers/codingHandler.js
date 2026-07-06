const { generateResponse } = require('../modules/response/responseGenerator');
const { search } = require('../../services/search/searchService');
const { enrich } = require('../modules/response/responseEnricher');

/**
 * Coding Handler — Handles intents with category "coding".
 *
 * This is the first handler that uses web search:
 *   1. Picks a static response from the matched intent JSON
 *   2. Builds a search query from the intent description + user message
 *   3. Calls the generic searchService (provider-agnostic)
 *   4. Merges static response + web results via responseEnricher
 *   5. Returns the enriched reply
 *
 * If the web search fails (timeout, no internet, etc.), the static
 * response is returned as-is — graceful degradation.
 */
module.exports = {
  category: 'coding',

  async handle({ intent, normalizedText, originalMessage, fallbackIntent }) {
    // 1. Get the static response from the JSON intent file
    const staticReply = generateResponse(intent, fallbackIntent);

    // 2. Build a search query — use the intent description for context
    //    plus the original user message for specificity
    const intentKeywords = intent?.description || '';
    const searchQuery = `${normalizedText} ${intentKeywords}`.trim();

    // 3. Search the web (provider-agnostic via searchService)
    let webResults = [];
    try {
      webResults = await search(searchQuery);
    } catch (error) {
      console.error('[CodingHandler] Web search failed:', error.message);
      // Graceful degradation — continue with static response only
    }

    // 4. Merge static + web results
    const enrichedReply = enrich(staticReply, webResults);

    return {
      reply: enrichedReply,
    };
  },
};
