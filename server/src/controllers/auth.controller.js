const jwt = require("jsonwebtoken");

const { z } = require("zod");

const User = require("../models/User");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),

  email: z.string().trim().email().max(255),

  password: z.string().min(6).max(128),

  role: z.enum(["admin", "member"]),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),

  password: z.string().min(6).max(128),
});

function sign(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

function publicUser(u) {
  return {
    id: u._id.toString(),

    name: u.name,

    email: u.email,

    role: u.role,
  };
}

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = registerSchema.parse(req.body);

    const exists = await User.findOne({
      email,
    });

    if (exists)
      return res
        .status(409)
        .json({
          message: "Email already in use",
        });

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      token: sign(user._id),

      user: publicUser(user),
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } =
      loginSchema.parse(req.body);

    const user = await User.findOne({
      email,
    });

    if (!user)
      return res
        .status(401)
        .json({
          message: "Invalid credentials",
        });

    const ok =
      await user.comparePassword(password);

    if (!ok)
      return res
        .status(401)
        .json({
          message: "Invalid credentials",
        });

    res.json({
      token: sign(user._id),

      user: publicUser(user),
    });
  } catch (e) {
    next(e);
  }
};