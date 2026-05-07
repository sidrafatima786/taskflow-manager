module.exports = function errorHandler(err, _req, res, _next) {
  console.error("[error]", err);
  if (err?.name === "ZodError") {
    return res.status(400).json({ message: err.issues?.[0]?.message || "Invalid input" });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Duplicate value", field: Object.keys(err.keyPattern || {})[0] });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
};
