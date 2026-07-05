const fs = require('fs');
const path = require('path');

function loadIntents(intentsRoot) {
    const root = intentsRoot || path.join(__dirname, '..', 'brain', 'data', 'intents');
    const intents = [];

    function walk(currentDir) {
        for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
                try {
                    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                    if (content && content.enabled !== false) {
                        intents.push(content);
                    }
                } catch (error) {
                    continue;
                }
            }
        }
    }

    if (fs.existsSync(root)) {
        walk(root);
    }

    return intents.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

module.exports = { loadIntents };