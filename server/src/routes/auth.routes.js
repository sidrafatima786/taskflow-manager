const router = require("express").Router();

const {
  register,
  login,
} = require("../controllers/auth.controller");

const User = require("../models/User");

router.post("/register", register);

router.post("/login", login);

// GET ALL USERS
router.get("/users", async (_req, res) => {
  try {
    const users = await User.find().select(
      "name email role"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;