const express = require("express");
const {
  getDashboardStats,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateLeaveStatus,
  getPendingLeaves,
  uploadSalary,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/employees", getEmployees);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.get("/leaves/pending", getPendingLeaves);
router.put("/leaves/:id/status", updateLeaveStatus);
router.post("/salary/upload", upload.single("file"), uploadSalary);

module.exports = router;
