const fs = require("fs/promises");
const { parse } = require("csv-parse/sync");
const Salary = require("../models/Salary");
const User = require("../models/User");
const { syncEmployeeKnowledge } = require("./employeeContext.service");

const uploadSalaryCsv = async ({ file, uploadedBy }) => {
  const csv = await fs.readFile(file.path, "utf8");
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const results = [];

  for (const row of rows) {
    const email = row.email?.toLowerCase();
    const employee = await User.findOne({ email });

    if (!employee) {
      results.push({ email, status: "skipped", reason: "Employee not found" });
      continue;
    }

    const salary = await Salary.create({
      employee: employee._id,
      basePay: Number(row.basePay || 0),
      allowances: Number(row.allowances || 0),
      deductions: Number(row.deductions || 0),
      bonus: Number(row.bonus || 0),
      currency: row.currency || "USD",
      payPeriod: row.payPeriod || new Date().toISOString().slice(0, 7),
      effectiveFrom: row.effectiveFrom ? new Date(row.effectiveFrom) : new Date(),
      uploadedBy,
    });

    await syncEmployeeKnowledge(employee._id);
    results.push({ email, status: "imported", salaryId: salary._id });
  }

  return results;
};

module.exports = { uploadSalaryCsv };
