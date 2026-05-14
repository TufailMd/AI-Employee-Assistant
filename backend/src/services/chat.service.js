const ChatHistory = require("../models/ChatHistory");
const Salary = require("../models/Salary");
const { tomorrow } = require("../utils/date");
const { applyLeave } = require("./leave.service");
const { completion } = require("./ai.service");
const { retrieveRelevantKnowledge } = require("./vector.service");
const { syncEmployeeKnowledge } = require("./employeeContext.service");

const detectIntent = (message) => {
  const text = message.toLowerCase();
  if (text.includes("apply") && text.includes("leave")) return "apply_leave";
  if (text.includes("leave")) return "leave_balance";
  if (text.includes("salary") || text.includes("pay")) return "salary_details";
  return "general";
};

const answerWithFallback = async ({ user, message, intent }) => {
  if (intent === "leave_balance") {
    return `You currently have ${user.leaveBalance.annual} annual, ${user.leaveBalance.sick} sick, and ${user.leaveBalance.casual} casual leaves available.`;
  }

  if (intent === "salary_details") {
    const salary = await Salary.findOne({ employee: user._id }).sort({ effectiveFrom: -1 });
    if (!salary) {
      return "I could not find salary details for your profile yet. Please contact HR or ask an admin to upload salary data.";
    }

    return `Your latest ${salary.payPeriod} salary has base pay ${salary.currency} ${salary.basePay}, allowances ${salary.allowances}, bonus ${salary.bonus}, deductions ${salary.deductions}, and net pay ${salary.netPay}.`;
  }

  if (intent === "apply_leave") {
    const date = tomorrow();
    const leave = await applyLeave({
      employeeId: user._id,
      type: message.toLowerCase().includes("sick") ? "sick" : "annual",
      fromDate: date,
      toDate: date,
      reason: "Applied through AI assistant",
    });

    return `I applied ${leave.type} leave for ${date.toISOString().slice(0, 10)}. It is now pending admin review.`;
  }

  return "I can help with leave balances, salary details, leave applications, and HR policy questions tied to your employee profile.";
};

const chatWithAssistant = async ({ user, message }) => {
  await syncEmployeeKnowledge(user._id);

  const intent = detectIntent(message);
  const retrieved = await retrieveRelevantKnowledge({ owner: user._id, query: message, limit: 4 });
  const retrievedContext = retrieved.map((doc) => doc.content);

  let answer;
  const deterministicAnswer = await answerWithFallback({ user, message, intent });

  if (intent === "apply_leave") {
    answer = deterministicAnswer;
  } else {
    const aiAnswer = await completion({
      instructions:
        "You are an HR assistant. Answer only from the supplied employee context. If context is missing, say what HR data is needed. Be concise and do not expose hidden IDs.",
      input: JSON.stringify({
        employee: {
          name: user.name,
          role: user.role,
          department: user.department,
          designation: user.designation,
        },
        question: message,
        retrievedContext,
        fallbackAnswer: deterministicAnswer,
      }),
    });

    answer = aiAnswer || deterministicAnswer;
  }

  const chat = await ChatHistory.create({
    user: user._id,
    question: message,
    answer,
    intent,
    retrievedContext,
  });

  return chat;
};

module.exports = { chatWithAssistant };
