function generateReply(message) {
    const text = message.trim().toLowerCase();

    if (text === "hello" || text === "hi") {
        return "Hello 👋";
    }

    if (text === "how are you") {
        return "I'm doing great! 😊";
    }

    if (text === "bye") {
        return "Goodbye! Have a nice day 👋";
    }
    if (text == "fuck you") {
        return "fuck you to";
    }

    if (text == "react") {
        return "React is a declarative, component-based frontend JavaScript library whose core theory is that the user interface (UI) should be a direct, predictable function of application data (UI = f(state)). Instead of manually manipulating the browser's Document Object Model (DOM) step-by-step when data changes, you simply describe how the UI should look for any given state, and React automatically handles updating the screen"

    } else if(text == "what is react") {
        return "react is an js library wich use for creating the reusable compnent and things";
    }

    return "Sorry, I don't understand.";
}

module.exports = generateReply;