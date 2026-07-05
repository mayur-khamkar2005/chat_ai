const assert = require('assert');
const { createBrainEngine } = require('../brain/brainEngine');

const engine = createBrainEngine();
const result = engine.processMessage('hello there');

assert.ok(result.reply);
assert.ok(result.intent || result.confidence >= 0);
console.log('brain engine smoke test passed');