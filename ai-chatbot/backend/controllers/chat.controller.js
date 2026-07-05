const { createBrainEngine } = require("../brain/brainEngine");

const brain = createBrainEngine();

const chatController = (req, res) => {
  const { message } = req.body;
  const result = brain.processMessage(message || "");

  res.status(200).json({
    success: true,
    reply: result.reply || "Sorry, I encountered an internal error.",
    intent: result.intent,
    confidence: result.confidence
  });
};

module.exports = {
  chatController,
};
