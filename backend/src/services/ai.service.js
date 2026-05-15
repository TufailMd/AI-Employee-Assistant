const { HfInference } = require("@huggingface/inference");

const hasHuggingFaceToken = Boolean(process.env.HF_TOKEN?.startsWith("hf_"));
const client = hasHuggingFaceToken ? new HfInference(process.env.HF_TOKEN) : null;

const completion = async ({ instructions, input, json = false }) => {
  if (!client) {
    return null;
  }

  const messages = [
    { role: "system", content: instructions },
    { role: "user", content: input }
  ];

  try {
    const response = await client.chatCompletion({
      model: process.env.HF_CHAT_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
      messages,
      max_tokens: 1500,
      temperature: 0.2,
    });
    
    let text = response.choices[0].message.content;
    
    if (json) {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        text = jsonMatch[1];
      }
    }
    
    return text;
  } catch (error) {
    console.error("Hugging Face Completion Error:", error);
    return null;
  }
};

const createEmbedding = async (text) => {
  if (!client) {
    return localEmbedding(text);
  }

  try {
    const result = await client.featureExtraction({
      model: process.env.HF_EMBEDDING_MODEL || "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });
    
    // featureExtraction might return a 1D array or 2D array depending on inputs
    return Array.isArray(result[0]) ? result[0] : result;
  } catch (error) {
    console.error("Hugging Face Embedding Error:", error);
    return localEmbedding(text);
  }
};

const localEmbedding = (text) => {
  const vector = new Array(128).fill(0);
  const tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];

  tokens.forEach((token) => {
    let hash = 0;
    for (let index = 0; index < token.length; index += 1) {
      hash = (hash * 31 + token.charCodeAt(index)) % vector.length;
    }
    vector[hash] += 1;
  });

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
};

module.exports = { completion, createEmbedding, hasOpenAIKey: hasHuggingFaceToken };
