const mongoose = require("mongoose");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const canAccessTask = (task, user) => {
  if (!task) {
    return false;
  }
  if (user.role === "admin") {
    return true;
  }
  return task.owner.toString() === user._id.toString();
};

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTask = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.user.role !== "admin") {
    payload.owner = req.user._id;
  }

  if (!payload.owner) {
    payload.owner = req.user._id;
  }

  const task = await Task.create(payload);
  res.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role !== "admin") {
    query.owner = req.user._id;
  }
  if (req.query.status) {
    query.status = req.query.status;
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  if (!canAccessTask(task, req.user)) {
    throw new AppError("Forbidden", 403);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  if (!canAccessTask(task, req.user)) {
    throw new AppError("Forbidden", 403);
  }

  if (req.body.owner && req.user.role !== "admin") {
    throw new AppError("Only admins can reassign task owner", 403);
  }

  Object.assign(task, req.body);
  const updatedTask = await task.save();
  res.status(200).json({
    success: true,
    message: "Task updated",
    data: updatedTask,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  if (!canAccessTask(task, req.user)) {
    throw new AppError("Forbidden", 403);
  }

  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

