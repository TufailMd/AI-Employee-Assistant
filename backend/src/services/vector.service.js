const KnowledgeDocument = require("../models/KnowledgeDocument");
const { createEmbedding } = require("./ai.service");

const cosineSimilarity = (a = [], b = []) => {
  const length = Math.min(a.length, b.length);
  if (!length) return 0;

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < length; index += 1) {
    dot += a[index] * b[index];
    magnitudeA += a[index] * a[index];
    magnitudeB += b[index] * b[index];
  }

  return dot / ((Math.sqrt(magnitudeA) || 1) * (Math.sqrt(magnitudeB) || 1));
};

const upsertKnowledge = async ({ owner, sourceType, sourceId, content, metadata = {} }) => {
  const embedding = await createEmbedding(content);

  return KnowledgeDocument.findOneAndUpdate(
    { owner, sourceType, sourceId },
    { owner, sourceType, sourceId, content, metadata, embedding },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const retrieveRelevantKnowledge = async ({ owner, query, limit = 5 }) => {
  const queryEmbedding = await createEmbedding(query);
  const documents = await KnowledgeDocument.find({ owner }).lean();

  return documents
    .map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

module.exports = { upsertKnowledge, retrieveRelevantKnowledge };
