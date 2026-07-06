const path = require('path');
const { parseInput } = require('./modules/parser/parser');
const { tokenize } = require('./modules/tokenizer/tokenizer');
const { normalizeText } = require('./modules/normalization/normalizer');
const { loadIntents } = require('./modules/intent/intentLoader');
const { matchIntents } = require('./modules/matcher/patternMatcher');
const { generateResponse } = require('./modules/response/responseGenerator');
const registry = require('./handlers/handlerRegistry');

function createBrainEngine() {
    // Load all intent JSON files recursively
    const intentsRoot = path.join(__dirname, 'data', 'intents');
    const intents = loadIntents(intentsRoot);
    const fallbackIntent = intents.find((intent) => intent.category === 'fallback') || null;

    // Auto-discover all category handlers
    registry.discover();

    console.log(`[BrainEngine] Loaded ${intents.length} intents`);
    console.log(`[BrainEngine] Available handlers: [${registry.getRegisteredCategories().join(', ')}]`);

    return {
        /**
         * Process a user message through the full pipeline:
         *   parse → tokenize → normalize → match → dispatch to handler
         *
         * @param {string} message — Raw user input
         * @returns {Promise<{ reply: string, intent: string|null, confidence: number, tokens: string[] }>}
         */
        async processMessage(message) {
            const parsed = parseInput(message);
            const tokens = tokenize(parsed.normalized);
            const normalized = normalizeText(parsed.normalized);
            const matchedIntent = matchIntents(normalized, intents);

            if (matchedIntent) {
                const selectedIntent = intents.find(
                    (intent) => intent.intent === matchedIntent.intent
                ) || null;

                // Dispatch to the appropriate category handler
                const handler = registry.getHandler(selectedIntent?.category);

                const result = await handler.handle({
                    intent: selectedIntent,
                    normalizedText: normalized,
                    originalMessage: message,
                    fallbackIntent,
                });

                return {
                    reply: result.reply || 'Sorry, I encountered an internal error.',
                    intent: selectedIntent?.intent || null,
                    confidence: matchedIntent.confidence,
                    tokens,
                };
            }

            // No match — use default handler with fallback intent
            const defaultHandler = registry.getHandler('__no_match__');
            const fallbackResult = await defaultHandler.handle({
                intent: null,
                normalizedText: normalized,
                originalMessage: message,
                fallbackIntent,
            });

            return {
                reply: fallbackResult.reply || generateResponse(null, fallbackIntent),
                intent: fallbackIntent?.intent || null,
                confidence: 0,
                tokens,
            };
        },
    };
}

module.exports = { createBrainEngine };