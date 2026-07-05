# Brain Module

## Why this folder exists
The brain folder is the orchestrator of the chatbot. It coordinates the entire offline AI pipeline from the moment a user sends a message until a reply is returned. This folder exists so the chatbot logic stays organized, reusable, and easy to expand as the project grows.

## Responsibility
The brain module owns the overall flow of the AI engine. It does not contain every tiny rule by itself. Instead, it delegates work to smaller modules such as parsing, normalization, intent loading, matching, and response generation.

## How it connects to the rest of the AI
The brain module acts as the control center. It receives user input, asks the parser to prepare the text, asks the intent system to find the best match, and then asks the response generator to produce the final output.

## Files in this folder
- brainEngine.js: the main orchestration module for the AI flow.
- README.md: explains the architecture and purpose of the brain folder.
- data/intents/: stores the intent JSON files used by the engine.

## JavaScript concepts used here
- Module imports and exports.
- Function composition.
- Simple object-oriented-style module design.
- Event-driven style when the backend connects to the route layer.

## C++ concepts used here
The Python and JavaScript side connects to the C++ NLP engine through the compiled DLL. The C++ engine performs fast preprocessing such as normalization and tokenization before the intent system runs.

## Example input
User message: "Hello there, can you help me with JavaScript?"

## Example output
The brain passes the message through parsing, matching, and response generation and returns a helpful reply such as a greeting or a JavaScript-focused response.

## Data flow
1. User sends a message.
2. The brain calls the parser.
3. The text is normalized and tokenized.
4. The intent loader discovers available intents.
5. The matcher finds the best intent.
6. The response generator constructs a reply.
7. The reply is returned to the controller and frontend.

## When this module is executed
This module runs for every incoming chat request. It is the central execution point for the chatbot.

## Future improvements
- Add context awareness.
- Add memory-based follow-up replies.
- Add confidence-based fallback behavior.
- Support multi-turn reasoning.
