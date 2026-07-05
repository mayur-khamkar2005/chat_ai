const normalize = require('../normalization/normalizer');

function parseInput(text) {
    const cleaned = normalize.normalizeText(text || '');
    return {
        raw: text || '',
        normalized: cleaned,
        tokens: cleaned.split(/\s+/).filter(Boolean)
    };
}

module.exports = { parseInput };