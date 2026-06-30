# Frontend Source Directory (`src`)

This is the main workspace for the React application. It contains all the UI code that the user interacts with in their browser.

## Key Files
- **`App.jsx`**: The main React component that acts as the container for the application. It includes the `fetch` logic that makes network requests to the backend (`http://localhost:5000/api/chat`).
- **`main.jsx`**: The React entry point that renders the `App` component into the actual HTML DOM (`index.html`).
- **`App.css` / `index.css`**: Global stylesheet files for adding basic styling to the web page.

## Subdirectories
- **`components/`**: Reusable UI parts (like buttons, chat bubbles, or the main chat screen).
- **`pages/`**: Full page layouts (if using a router).
- **`hooks/` & `context/`**: Custom React logic for managing state.
