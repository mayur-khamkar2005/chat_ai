# Offline AI Chatbot Architecture

This backend is organized into modular folders so the chatbot can grow without becoming messy.

## Main Modules

- parser: cleans and parses incoming messages.
- tokenizer: splits text into tokens.
- normalization: standardizes text for matching.
- intent: loads intent JSON recursively.
- matcher: scores and selects the best intent.
- response: chooses a response for the matched intent.
- brain: orchestrates the full flow.

## Intent Structure

Intents live under brain/data/intents with category folders such as conversation, assistant, moderation, identity, emotion, coding, utility, memory, system, fallback, and knowledge.

## Extension Guide

To add a new intent, create a new JSON file inside an appropriate subfolder. The loader will discover it automatically.
