const express = require('express');
const jwtAuth = require('../middleware/jwtAuth');
const router = express.Router();

router.get("/", jwtAuth.adminOnly, (req, res) => {
  res.render("adminDashboard");
});

router.get("/postcenter", jwtAuth.adminOnly, (req, res) => {
  res.render("postCenter")
});




module.exports = router;