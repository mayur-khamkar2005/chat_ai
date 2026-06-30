# Backend API Directory

This is the root of the server-side application built with Node.js and Express.

## Core Responsibilities
- **`app.js`**: The main entry point for the backend. It sets up the Express server, configures CORS (to allow the frontend to connect), and registers API routes.
- **Serving the AI**: It listens on port 5000 and routes incoming chat requests to the appropriate controllers to process user messages and generate AI responses.

## Folder Structure Summary
- `brain/`: Contains the core AI NLP logic (Python orchestration and C++ compiled engine).
- `controllers/`: Handles the business logic for specific API routes (e.g., executing the Python scripts).
- `routes/`: Maps specific URL paths (like `/api/chat`) to their corresponding controller functions.
