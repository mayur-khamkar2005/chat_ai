const INTENTS = [
  {
    name: "GREETING",
    patterns: [
      /^(hi|hy|hello|hey|howdy|sup|yo|hiya)\b/i,
      /\bgood (morning|afternoon|evening)\b/i,
    ],
  },
  {
    name: "WELLBEING",
    patterns: [
      /\b(how are you|how are u|how r you|how you doing|how do you do)\b/i,
      /\b(whats up|what's up)\b/i,
    ],
  },
  {
    name: "GOODBYE",
    patterns: [/\b(bye|goodbye|good bye|see you|see ya|later|take care)\b/i],
  },
  {
    name: "HELP",
    patterns: [
      /\b(help|assist|support)\b/i,
      /\b(can you help|need help)\b/i,
    ],
  },
  {
    name: "BOT_NAME",
    patterns: [
      /\b(what is your name|whats your name|what's your name)\b/i,
      /\b(who are you|your name)\b/i,
    ],
  },
  {
    name: "THANKS",
    patterns: [/\b(thanks|thank you|thx|appreciate it)\b/i],
  },
];

function detectIntent(message = "") {
  const text = String(message ?? "").trim();

  if (!text) {
    return "UNKNOWN";
  }

  for (const intent of INTENTS) {
    if (intent.patterns.some((pattern) => pattern.test(text))) {
      return intent.name;
    }
  }

  return "UNKNOWN";
}

module.exports = detectIntent;
