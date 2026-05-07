const { z } = require("zod");
const Task = require("../models/Task");

const taskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).optional().default(""),
  status: z.enum(["pending", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

exports.list = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const data = taskSchema.parse(req.body);
    const task = await Task.create({ ...data, createdBy: req.user.id });
    res.status(201).json(task);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const data = taskSchema.partial().parse(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      data,
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!result) return res.status(404).json({ message: "Task not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
