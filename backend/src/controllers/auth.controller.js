const User = require("../models/User");
const { signToken } = require("../services/token.service");
const asyncHandler = require("../middleware/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const usersCount = await User.countDocuments();
  const assignedRole = usersCount === 0 ? "admin" : "employee";
  const user = await User.create({ name, email, password, role: assignedRole });
  const token = signToken(user);

  res.status(201).json({ user: user.toJSON(), token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  res.json({ user: user.toJSON(), token });
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };
