const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    basePay: { type: Number, required: true, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    payPeriod: { type: String, required: true },
    effectiveFrom: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

salarySchema.virtual("netPay").get(function getNetPay() {
  return this.basePay + this.allowances + this.bonus - this.deductions;
});

salarySchema.index({ employee: 1, effectiveFrom: -1 });

module.exports = mongoose.model("Salary", salarySchema);
