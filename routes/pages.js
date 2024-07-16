const express = require("express");
const router = express.Router();

// Middleware
const jwtAuth = require("../middleware/jwtAuth.js");

// Controllers
const authController = require("../controllers/authController.js");

router.get("/", jwtAuth.authenticate, (req, res) => {
  res.render("allPosts");
});


// Auth
router.get("/login", (req, res) => {
  res.render("login");
  console.log(req.ip);
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", authController.register);

router.post("/login", authController.login);

module.exports = router;
