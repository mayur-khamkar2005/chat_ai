const generateReply = require("../brain/brain");

const chatController = (req, res) => {
  const { message } = req.body;
  const reply = generateReply(message);

  res.status(200).json({
    success: true,
    reply,
  });
};

module.exports = {
  chatController,
};
