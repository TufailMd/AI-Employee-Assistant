const { completion } = require("./openai.service");

const fallbackLeaveEmail = ({ employeeName, status, leave }) => {
  const approved = status === "approved";
  return [
    `Subject: Leave Request ${approved ? "Approved" : "Update"}`,
    "",
    `Hi ${employeeName},`,
    "",
    `Your ${leave.type} leave request from ${leave.fromDate.toISOString().slice(0, 10)} to ${leave.toDate
      .toISOString()
      .slice(0, 10)} has been ${status}.`,
    approved
      ? "Please coordinate any handover items with your manager before your leave begins."
      : "Please connect with your manager or HR if you would like to discuss alternate dates.",
    "",
    "Regards,",
    "HR Team",
  ].join("\n");
};

const generateLeaveEmail = async ({ employeeName, status, leave, adminNote }) => {
  const fallback = fallbackLeaveEmail({ employeeName, status, leave });
  const aiEmail = await completion({
    instructions:
      "You write concise, professional HR emails. Include a subject line and keep the tone warm, clear, and compliant.",
    input: JSON.stringify({
      employeeName,
      status,
      leave: {
        type: leave.type,
        fromDate: leave.fromDate,
        toDate: leave.toDate,
        days: leave.days,
      },
      adminNote,
    }),
  });

  return aiEmail || fallback;
};

module.exports = { generateLeaveEmail };
