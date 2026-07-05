const { normalizeText } = require('../normalization/normalizer');

function compilePatterns(intent) {
    return (intent.patterns || []).map((pattern) => new RegExp(pattern, 'i'));
}

function matchIntent(text, intent) {
    const normalized = normalizeText(text);
    const patterns = compilePatterns(intent);
    let score = 0;
    let matched = false;

    for (const pattern of patterns) {
        if (pattern.test(normalized)) {
            matched = true;
            score += 10;
        }
    }

    return {
        matched,
        score,
        confidence: matched ? Math.min(0.99, 0.5 + score / 100) : 0,
        intent: intent.intent
    };
}

function matchIntents(text, intents) {
    const matches = intents
        .map((intent) => matchIntent(text, intent))
        .filter((match) => match.matched)
        .sort((a, b) => b.score - a.score);

    return matches[0] || null;
}

module.exports = { compilePatterns, matchIntent, matchIntents };