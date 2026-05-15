const User = require("../models/User");
const Leave = require("../models/Leave");
const asyncHandler = require("../middleware/asyncHandler");
const { syncEmployeeKnowledge } = require("../services/employeeContext.service");
const { reviewLeave } = require("../services/leave.service");
const { uploadSalaryCsv } = require("../services/salary.service");

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const pendingLeaves = await Leave.countDocuments({ status: "pending" });
  
  res.json({ totalEmployees, pendingLeaves });
});

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: "employee" }).select("-password").sort({ createdAt: -1 });
  res.json(employees);
});

const createEmployee = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    department,
    designation,
    phone,
    manager,
    joiningDate,
    leaveBalance,
    status,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Employee with this email already exists" });
  }

  const employee = await User.create({
    name,
    email,
    password,
    role: "employee",
    department,
    designation,
    phone,
    manager,
    joiningDate,
    leaveBalance,
    status,
  });

  await syncEmployeeKnowledge(employee._id);
  res.status(201).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allowedUpdates = [
    "name",
    "email",
    "department",
    "designation",
    "phone",
    "manager",
    "joiningDate",
    "leaveBalance",
    "status",
  ];

  const updates = allowedUpdates.reduce((payload, key) => {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key];
    }
    return payload;
  }, {});

  if (req.body.password) {
    updates.password = req.body.password;
  }

  const employee = await User.findOne({ _id: id, role: "employee" }).select("+password");
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  if (updates.email && updates.email !== employee.email) {
    const emailOwner = await User.findOne({ email: updates.email, _id: { $ne: employee._id } });
    if (emailOwner) {
      return res.status(400).json({ message: "Email is already in use" });
    }
  }

  const nextLeaveBalance = updates.leaveBalance;
  delete updates.leaveBalance;

  Object.assign(employee, updates);

  if (nextLeaveBalance) {
    employee.leaveBalance = {
      ...employee.leaveBalance.toObject(),
      ...nextLeaveBalance,
    };
  }

  await employee.save();
  await syncEmployeeKnowledge(employee._id);

  res.json(employee.toJSON());
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findOne({ _id: req.params.id, role: "employee" });
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employee.status = "inactive";
  await employee.save();
  await syncEmployeeKnowledge(employee._id);

  res.json({ message: "Employee deactivated", employee });
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

module.exports = {
  getDashboardStats,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateLeaveStatus,
  getPendingLeaves,
  uploadSalary,
};
