const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { signToken } = require("../services/token.service");
const env = require("../config/env");

const formatAuthResponse = (user) => {
  const token = signToken({ id: user._id, role: user.role });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminInviteToken } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  let assignedRole = "user";
  if (role === "admin") {
    if (!env.adminInviteToken || adminInviteToken !== env.adminInviteToken) {
      throw new AppError("Invalid admin invite token", 403);
    }
    assignedRole = "admin";
  }

  const user = await User.create({ name, email, password, role: assignedRole });
  const payload = formatAuthResponse(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: payload,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const payload = formatAuthResponse(user);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: payload,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = { register, login, getMe };
