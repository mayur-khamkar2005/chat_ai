const path = require('path');
const { parseInput } = require('../parser/parser');
const { tokenize } = require('../tokenizer/tokenizer');
const { normalizeText } = require('../normalization/normalizer');
const { loadIntents } = require('../intent/intentLoader');
const { matchIntents } = require('../matcher/patternMatcher');
const { generateResponse } = require('../response/responseGenerator');

function createBrainEngine() {
    const intentsRoot = path.join(__dirname, 'data', 'intents');
    const intents = loadIntents(intentsRoot);
    const fallbackIntent = intents.find((intent) => intent.category === 'fallback') || null;

    return {
        processMessage(message) {
            const parsed = parseInput(message);
            const tokens = tokenize(parsed.normalized);
            const normalized = normalizeText(parsed.normalized);
            const matchedIntent = matchIntents(normalized, intents);

            if (matchedIntent) {
                const selectedIntent = intents.find((intent) => intent.intent === matchedIntent.intent) || null;
                return {
                    reply: generateResponse(selectedIntent, fallbackIntent),
                    intent: selectedIntent?.intent || null,
                    confidence: matchedIntent.confidence,
                    tokens
                };
            }

            return {
                reply: generateResponse(null, fallbackIntent),
                intent: fallbackIntent?.intent || null,
                confidence: 0,
                tokens
            };
        }
    };
}

module.exports = { createBrainEngine };