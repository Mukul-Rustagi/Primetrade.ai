const { z } = require("zod");

const baseTask = {
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().trim().max(500).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.coerce.date().optional(),
  owner: z.string().trim().optional(),
};

const createTaskSchema = z.object({
  title: baseTask.title,
  description: baseTask.description,
  status: baseTask.status,
  priority: baseTask.priority,
  dueDate: baseTask.dueDate,
  owner: baseTask.owner,
});

const updateTaskSchema = z
  .object({
    title: baseTask.title.optional(),
    description: baseTask.description,
    status: baseTask.status,
    priority: baseTask.priority,
    dueDate: baseTask.dueDate,
    owner: baseTask.owner,
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

module.exports = { createTaskSchema, updateTaskSchema };

