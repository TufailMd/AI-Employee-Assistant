const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    intent: { type: String, default: "general" },
    retrievedContext: [{ type: String }],
    actions: [
      {
        type: { type: String },
        status: { type: String },
        refId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

chatHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
