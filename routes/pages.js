const express = require("express");
const router = express.Router();
const prometheus = require("../config/prometheus.js");

// Middleware
const jwtAuth = require("../middleware/jwtAuth.js");

// Controllers
const authController = require("../controllers/authController.js");

router.get("/app", jwtAuth.authenticate, (req, res) => {
  res.render("allPosts");
});

// Auth
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", authController.register);

router.post("/login", authController.login);

// Prometheus
router.get("/metrics", async (req, res) => {
  res.set("Content-Type", prometheus.prom.register.contentType);
  res.end(await prometheus.prom.register.metrics());
});

// Default
router.get("/", (req, res) => {
  res.render("landing");
});

module.exports = router;
