const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    department: { type: String, default: "People Operations" },
    designation: { type: String, default: "Employee" },
    phone: { type: String, default: "" },
    manager: { type: String, default: "" },
    joiningDate: { type: Date, default: Date.now },
    leaveBalance: {
      annual: { type: Number, default: 18 },
      sick: { type: Number, default: 8 },
      casual: { type: Number, default: 6 },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

userSchema.pre("validate", function ensureUsername(next) {
  if (!this.username && this.email) {
    this.username = this.email;
  }

  next();
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
