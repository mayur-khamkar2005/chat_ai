function pickRandom(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }
    return items[Math.floor(Math.random() * items.length)];
}

module.exports = { pickRandom };