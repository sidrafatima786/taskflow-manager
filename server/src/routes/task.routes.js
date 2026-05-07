const router = require("express").Router();

const Task = require("../models/Task");
const Project = require("../models/Project");

// GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      assignedTo,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      assignedTo,
      project,
    });

    // add task into project
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $push: { tasks: task._id },
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;