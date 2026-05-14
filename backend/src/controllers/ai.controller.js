const asyncHandler = require("../middleware/asyncHandler");
const { chatWithAssistant } = require("../services/chat.service");
const { parseResume } = require("../services/resume.service");

const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const response = await chatWithAssistant({
    user: req.user,
    message,
  });

  res.json(response);
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a PDF resume" });
  }

  const parsed = await parseResume({
    file: req.file,
    uploadedBy: req.user._id,
  });

  res.status(201).json(parsed);
});

module.exports = { handleChat, uploadResume };
