const mongoose = require("mongoose");

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    namespace: { type: String, default: "employee-profile" },
    sourceType: {
      type: String,
      enum: ["employee", "salary", "leave", "policy", "resume"],
      required: true,
    },
    sourceId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String, required: true },
    metadata: { type: Object, default: {} },
    embedding: [{ type: Number }],
  },
  { timestamps: true }
);

knowledgeDocumentSchema.index({ owner: 1, namespace: 1, sourceType: 1 });

module.exports = mongoose.model("KnowledgeDocument", knowledgeDocumentSchema);
