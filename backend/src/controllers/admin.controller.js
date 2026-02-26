const User = require("../models/User");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

const stats = asyncHandler(async (_req, res) => {
  const [userCount, taskCount, completedTaskCount] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: "completed" }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: userCount,
      tasks: taskCount,
      completedTasks: completedTaskCount,
    },
  });
});

module.exports = { listUsers, stats };

