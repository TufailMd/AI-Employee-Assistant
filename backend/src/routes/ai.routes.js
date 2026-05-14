const express = require("express");
const { handleChat, uploadResume } = require("../controllers/ai.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.use(protect);

router.post("/chat", handleChat);
router.post("/resume", authorize("admin"), upload.single("file"), uploadResume);

module.exports = router;
