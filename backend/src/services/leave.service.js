const Leave = require("../models/Leave");
const User = require("../models/User");
const { inclusiveBusinessDays, normalizeDate } = require("../utils/date");
const { syncEmployeeKnowledge } = require("./employeeContext.service");
const { generateLeaveEmail } = require("./email.service");

const applyLeave = async ({ employeeId, type, fromDate, toDate, reason }) => {
  const employee = await User.findById(employeeId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const days = inclusiveBusinessDays(fromDate, toDate);
  const available = employee.leaveBalance[type] ?? 0;

  if (available < days) {
    const error = new Error(`Insufficient ${type} leave balance`);
    error.statusCode = 400;
    throw error;
  }

  const leave = await Leave.create({
    employee: employeeId,
    type,
    fromDate: normalizeDate(fromDate),
    toDate: normalizeDate(toDate),
    days,
    reason,
  });

  await syncEmployeeKnowledge(employeeId);
  return leave;
};

const reviewLeave = async ({ leaveId, reviewerId, status, adminNote }) => {
  const leave = await Leave.findById(leaveId).populate("employee", "name email leaveBalance");
  if (!leave) {
    const error = new Error("Leave request not found");
    error.statusCode = 404;
    throw error;
  }

  if (leave.status !== "pending") {
    const error = new Error("Only pending leave requests can be reviewed");
    error.statusCode = 400;
    throw error;
  }

  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Leave status must be approved or rejected");
    error.statusCode = 400;
    throw error;
  }

  leave.status = status;
  leave.adminNote = adminNote || "";
  leave.reviewedBy = reviewerId;
  leave.reviewedAt = new Date();
  await leave.save();

  if (status === "approved") {
    await User.findByIdAndUpdate(leave.employee._id, {
      $inc: { [`leaveBalance.${leave.type}`]: -leave.days },
    });
  }

  await syncEmployeeKnowledge(leave.employee._id);
  const emailDraft = await generateLeaveEmail({
    employeeName: leave.employee.name,
    status,
    leave,
    adminNote,
  });

  return { leave, emailDraft };
};

module.exports = { applyLeave, reviewLeave };
