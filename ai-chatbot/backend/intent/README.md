# Intent Module

## Why this folder exists
The intent module exists to make the chatbot data-driven rather than hardcoded. Instead of writing one large conditional tree, the engine loads intent definitions from JSON files. This makes the bot easier to grow and maintain.

## Responsibility
This module discovers intent JSON files recursively, loads them, filters disabled ones, and sorts them by priority. It provides the matcher with a list of intents it can evaluate.

## How it connects to the rest of the AI
The intent loader sits between the data layer and the matching layer. It pulls intent definitions from the filesystem and passes them to the pattern matcher.

## Files in this folder
- intentLoader.js: loads all JSON intent files from subfolders.
- README.md: documentation for the module.

## JavaScript concepts used here
- File system access using Node.js.
- Recursion.
- Array sorting.
- JSON parsing.

## C++ concepts used here
The intent module itself is JavaScript-based, but the intent patterns are later evaluated alongside preprocessing performed by the C++ engine.

## Example input
A folder containing several JSON files such as greeting.json and help.json.

## Example output
A sorted array of enabled intents ready for matching.

## Data flow
1. The folder is scanned recursively.
2. Every JSON file is read.
3. Disabled intents are ignored.
4. The remaining intents are sorted by priority.
5. The matcher receives the final list.

## When this module is executed
This module is executed when the brain engine starts or when the intents need to be reloaded.

## Future improvements
- Add caching for faster loading.
- Add schema validation for each intent file.
- Support hot reloading when a new file is added.
- Add metadata-based ranking rules.
