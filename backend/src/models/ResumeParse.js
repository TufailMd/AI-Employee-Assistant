const mongoose = require("mongoose");

const resumeParseSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    parsed: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      experience: String,
      education: [String],
      summary: String,
    },
    rawText: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeParse", resumeParseSchema);
