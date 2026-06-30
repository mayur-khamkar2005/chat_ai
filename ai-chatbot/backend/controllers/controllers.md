# Controllers Directory

Controllers contain the specific business logic for your application. When an API route is hit, it passes the request here to actually "do the work."

## Key Files
- **`chat.controller.js`**: This file receives the user's message from the incoming POST request body. It then uses Node's `child_process.spawn` function to run the `brain.py` script (located in the `/brain` folder). It waits for Python to finish processing, captures the output, and sends the final JSON response back to the frontend.
