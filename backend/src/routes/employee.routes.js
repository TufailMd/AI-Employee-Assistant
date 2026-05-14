const express = require("express");
const { getDashboard, getLeaves, createLeave } = require("../controllers/employee.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("employee", "admin"));

router.get("/dashboard", getDashboard);
router.get("/leaves", getLeaves);
router.post("/leaves", createLeave);

module.exports = router;
