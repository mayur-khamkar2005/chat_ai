function normalizeText(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/\r\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9\s'.,!?-]/g, ' ')
        .trim();
}

module.exports = { normalizeText };