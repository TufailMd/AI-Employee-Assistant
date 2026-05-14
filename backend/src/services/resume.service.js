const fs = require("fs/promises");
const pdfParse = require("pdf-parse");
const ResumeParse = require("../models/ResumeParse");
const { cloudinary, isConfigured } = require("../config/cloudinary");
const { completion } = require("./ai.service");

const extractJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (_error) {
    const match = value?.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
};

const fallbackParse = (text) => {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";
  const skills = ["JavaScript", "React", "Node.js", "MongoDB", "Python", "SQL", "AWS"].filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    name: text.split(/\r?\n/).find((line) => line.trim().length > 2)?.trim() || "Unknown candidate",
    email,
    phone,
    skills,
    experience: text.match(/(\d+\+?\s+years?[^.\n]*)/i)?.[0] || "Experience details detected in resume text.",
    education: [],
    summary: text.slice(0, 280),
  };
};

const uploadToCloudinary = async (filePath) => {
  if (!isConfigured) {
    return filePath;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "ai-employee-assistant/resumes",
  });

  return result.secure_url;
};

const parseResume = async ({ file, uploadedBy }) => {
  const buffer = await fs.readFile(file.path);
  const parsedPdf = await pdfParse(buffer);
  const rawText = parsedPdf.text.trim();
  const fileUrl = await uploadToCloudinary(file.path);

  const aiResult = await completion({
    instructions:
      "Extract resume facts as compact JSON with keys: name, email, phone, skills array, experience string, education array, summary string. Return JSON only.",
    input: rawText.slice(0, 12000),
    json: true,
  });

  const parsed = extractJson(aiResult) || fallbackParse(rawText);

  return ResumeParse.create({
    uploadedBy,
    originalName: file.originalname,
    fileUrl,
    parsed,
    rawText,
  });
};

module.exports = { parseResume };
