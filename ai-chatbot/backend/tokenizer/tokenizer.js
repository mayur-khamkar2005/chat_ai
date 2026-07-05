function tokenize(text) {
    return String(text || '')
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
}

module.exports = { tokenize };