const Leave = require("../models/Leave");
const Salary = require("../models/Salary");
const asyncHandler = require("../middleware/asyncHandler");
const { applyLeave } = require("../services/leave.service");

const getDashboard = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).sort("-createdAt").limit(5);
  const salary = await Salary.findOne({ employee: req.user._id }).sort("-effectiveFrom");
  
  res.json({
    user: req.user,
    recentLeaves: leaves,
    latestSalary: salary,
  });
});

const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).sort("-createdAt");
  res.json(leaves);
});

const createLeave = asyncHandler(async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  const leave = await applyLeave({
    employeeId: req.user._id,
    type,
    fromDate,
    toDate,
    reason,
  });
  
  res.status(201).json(leave);
});

module.exports = { getDashboard, getLeaves, createLeave };
