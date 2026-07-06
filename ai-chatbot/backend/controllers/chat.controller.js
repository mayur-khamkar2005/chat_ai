const { createBrainEngine } = require("../brain/brainEngine");

const brain = createBrainEngine();

const chatController = async (req, res) => {
  try {
    const { message } = req.body;
    const result = await brain.processMessage(message || "");

    res.status(200).json({
      success: true,
      reply: result.reply || "Sorry, I encountered an internal error.",
      intent: result.intent,
      confidence: result.confidence
    });
  } catch (error) {
    console.error("[ChatController] Error:", error.message);
    res.status(500).json({
      success: false,
      reply: "Something went wrong internally. Please try again.",
      intent: null,
      confidence: 0
    });
  }
};

module.exports = {
  chatController,
};
