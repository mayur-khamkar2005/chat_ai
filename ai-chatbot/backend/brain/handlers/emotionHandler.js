const { generateResponse } = require('../modules/response/responseGenerator');

/**
 * Emotion Handler — Handles intents with category "emotion".
 *
 * Simple static-response handler. No web search needed —
 * emotional support responses are pre-written in the intent JSONs.
 */
module.exports = {
  category: 'emotion',

  async handle({ intent, fallbackIntent }) {
    return {
      reply: generateResponse(intent, fallbackIntent),
    };
  },
};
