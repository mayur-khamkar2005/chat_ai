const { spawn } = require("child_process");
const path = require("path");

const chatController = (req, res) => {
  const { message } = req.body;
  
  const pythonProcess = spawn("python", [
    path.join(__dirname, "../brain/brain.py"),
    message || ""
  ]);

  let reply = "";
  pythonProcess.stdout.on("data", (data) => {
    reply += data.toString();
  });

  pythonProcess.on("close", (code) => {
    res.status(200).json({
      success: true,
      reply: reply.trim() || "Sorry, I encountered an internal error."
    });
  });
};

module.exports = {
  chatController,
};
