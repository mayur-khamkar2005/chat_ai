const parseMessage = require("./parser");
const detectIntent = require("./intent");
const detectIntent2 = require("./intent2");

function generateReply(message = "") {
  const text = parseMessage(message);
  const intent = detectIntent(text);
  const intent2 = detectIntent2(text);

  if (!text) {
    return "Please type a message.";
  }

  if (intent2 === "BADWORDS") {
    return "Please use respectful language.";
  }

  if (intent === "GREETING") {
    return "Hello!";
  }

  if (intent === "WELLBEING") {
    return "I'm doing great!";
  }

  if (intent === "GOODBYE") {
    return "Goodbye! Have a nice day.";
  }

  if (intent === "HELP") {
    return "How can I help you?";
  }

  if (intent === "BOT_NAME") {
    return "I was created by Mayur, so I don't have a name for my current state.";
  }

  if (intent === "THANKS") {
    return "You're welcome!";
  }

  return "Sorry, I don't understand.";
}

module.exports = generateReply;
