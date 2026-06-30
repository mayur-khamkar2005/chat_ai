# Services Directory (Frontend)

This folder is used to manage all outgoing network requests. 
Instead of writing `fetch()` calls directly inside UI components, it is best practice to write API wrapper functions here (like `sendMessageToBot(text)`). Components then import and call these service functions.
