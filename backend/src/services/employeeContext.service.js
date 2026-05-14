const Leave = require("../models/Leave");
const Salary = require("../models/Salary");
const User = require("../models/User");
const { upsertKnowledge } = require("./vector.service");

const getEmployeeSnapshot = async (employeeId) => {
  const [employee, salary, leaves] = await Promise.all([
    User.findById(employeeId).select("-password").lean(),
    Salary.findOne({ employee: employeeId }).sort({ effectiveFrom: -1 }).lean({ virtuals: true }),
    Leave.find({ employee: employeeId }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return { employee, salary, leaves };
};

const buildEmployeeKnowledgeText = ({ employee, salary, leaves }) => {
  const leaveSummary = leaves
    .map(
      (leave) =>
        `${leave.type} leave from ${leave.fromDate.toISOString().slice(0, 10)} to ${leave.toDate
          .toISOString()
          .slice(0, 10)} for ${leave.days} days is ${leave.status}`
    )
    .join("; ");

  const salaryText = salary
    ? `Salary for ${salary.payPeriod}: base ${salary.basePay}, allowances ${salary.allowances}, bonus ${salary.bonus}, deductions ${salary.deductions}, currency ${salary.currency}.`
    : "No salary record is available.";

  return [
    `Employee ${employee.name} works as ${employee.designation} in ${employee.department}.`,
    `Leave balances: annual ${employee.leaveBalance.annual}, sick ${employee.leaveBalance.sick}, casual ${employee.leaveBalance.casual}.`,
    salaryText,
    `Recent leave history: ${leaveSummary || "No leave applications yet."}`,
  ].join(" ");
};

const syncEmployeeKnowledge = async (employeeId) => {
  const snapshot = await getEmployeeSnapshot(employeeId);

  if (!snapshot.employee) {
    return null;
  }

  return upsertKnowledge({
    owner: employeeId,
    sourceType: "employee",
    sourceId: employeeId,
    content: buildEmployeeKnowledgeText(snapshot),
    metadata: { refreshedAt: new Date().toISOString() },
  });
};

module.exports = { getEmployeeSnapshot, syncEmployeeKnowledge, buildEmployeeKnowledgeText };
