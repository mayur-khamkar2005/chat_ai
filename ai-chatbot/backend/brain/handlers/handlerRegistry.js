const fs = require('fs');
const path = require('path');

/**
 * HandlerRegistry — Auto-discovers handler files in this directory.
 *
 * At startup, it scans for all files matching *Handler.js (except itself),
 * imports them, and registers them by their `category` property.
 *
 * Handler Contract:
 *   module.exports = {
 *     category: 'coding',            // which intent category this handles
 *     async handle({ intent, normalizedText, originalMessage, fallbackIntent }) {
 *       return { reply: '...', intent: '...', confidence: 0.9 };
 *     }
 *   };
 */
class HandlerRegistry {
  constructor() {
    /** @type {Map<string, object>} */
    this._handlers = new Map();

    /** @type {object|null} */
    this._defaultHandler = null;
  }

  /**
   * Scan the handlers directory and register every *Handler.js file.
   * Called once at startup by brainEngine.js.
   */
  discover() {
    const handlersDir = __dirname;
    const files = fs.readdirSync(handlersDir).filter(
      (f) => f.endsWith('Handler.js') && f !== 'handlerRegistry.js'
    );

    for (const file of files) {
      try {
        const handler = require(path.join(handlersDir, file));

        if (!handler.category || typeof handler.handle !== 'function') {
          console.warn(`[HandlerRegistry] Skipping ${file}: missing "category" or "handle()"`);
          continue;
        }

        if (handler.category === 'default') {
          this._defaultHandler = handler;
          console.log(`[HandlerRegistry] Registered default handler from ${file}`);
        } else {
          this._handlers.set(handler.category, handler);
          console.log(`[HandlerRegistry] Registered handler: "${handler.category}" from ${file}`);
        }
      } catch (error) {
        console.error(`[HandlerRegistry] Failed to load ${file}:`, error.message);
      }
    }

    // If no default handler was found, create a minimal one
    if (!this._defaultHandler) {
      this._defaultHandler = {
        category: 'default',
        async handle({ intent, fallbackIntent }) {
          const { generateResponse } = require('../modules/response/responseGenerator');
          return {
            reply: generateResponse(intent, fallbackIntent),
          };
        },
      };
      console.log('[HandlerRegistry] Using built-in default handler');
    }

    console.log(
      `[HandlerRegistry] Ready — ${this._handlers.size} category handler(s) + default`
    );
  }

  /**
   * Get the handler for a given category.
   * Falls back to defaultHandler if no match.
   *
   * @param {string} category
   * @returns {object} handler with handle() method
   */
  getHandler(category) {
    return this._handlers.get(category) || this._defaultHandler;
  }

  /**
   * List all registered categories (for debugging).
   * @returns {string[]}
   */
  getRegisteredCategories() {
    return [...this._handlers.keys()];
  }
}

// Singleton instance
const registry = new HandlerRegistry();

module.exports = registry;
