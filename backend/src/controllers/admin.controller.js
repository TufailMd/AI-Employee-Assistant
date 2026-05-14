const User = require("../models/User");
const Leave = require("../models/Leave");
const asyncHandler = require("../middleware/asyncHandler");
const { reviewLeave } = require("../services/leave.service");
const { uploadSalaryCsv } = require("../services/salary.service");

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const pendingLeaves = await Leave.countDocuments({ status: "pending" });
  
  res.json({ totalEmployees, pendingLeaves });
});

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: "employee" }).select("-password");
  res.json(employees);
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;
  
  const leave = await reviewLeave({
    leaveId: id,
    reviewerId: req.user._id,
    status,
    adminNote,
  });
  
  res.json(leave);
});

const getPendingLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ status: "pending" }).populate("employee", "name email");
  res.json(leaves);
});

const uploadSalary = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a CSV file" });
  }

  const results = await uploadSalaryCsv({
    file: req.file,
    uploadedBy: req.user._id,
  });

  res.json({ message: "Salary upload processed", results });
});

module.exports = { getDashboardStats, getEmployees, updateLeaveStatus, getPendingLeaves, uploadSalary };
