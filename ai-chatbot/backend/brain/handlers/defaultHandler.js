const { generateResponse } = require('../modules/response/responseGenerator');

/**
 * Default Handler — Catch-all for any category without a dedicated handler.
 *
 * Uses the existing responseGenerator to pick a random static response.
 * No web search, no enrichment.
 */
module.exports = {
  category: 'default',

  async handle({ intent, fallbackIntent }) {
    return {
      reply: generateResponse(intent, fallbackIntent),
    };
  },
};
