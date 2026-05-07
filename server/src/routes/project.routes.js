const express = require("express");
const router = express.Router();

const Project = require("../models/Project");

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      status: "active",
    });

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;