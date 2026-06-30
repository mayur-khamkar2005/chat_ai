const INTENTS2 = [
  {
    name: "BADWORDS",
    patterns: [
      /\b(fuck[-\s]*you|fuck|shit|bitch|asshole)\b/i,
      /\b(shut[-\s]*up|shutup|idiot|stupid)\b/i,
    ],
  },
];

function detectIntent2(message = "") {
  const text = String(message ?? "").trim();

  if (!text) {
    return "UNKNOWN";
  }

  for (const intent of INTENTS2) {
    if (intent.patterns.some((pattern) => pattern.test(text))) {
      return intent.name;
    }
  }

  return "UNKNOWN";
}

module.exports = detectIntent2;
