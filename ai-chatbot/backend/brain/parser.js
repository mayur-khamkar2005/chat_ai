function parseMessage(message = "") {
  return String(message ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = parseMessage;
