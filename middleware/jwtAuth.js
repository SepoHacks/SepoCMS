const jwt = require("jsonwebtoken");

const prometheus = require("../config/prometheus.js");

const userModels = require("../models/userModels.js");

exports.authenticate = (req, res, next) => {
  const token = req.cookies.AccessToken;

  if (!token) {
    prometheus.authCount.inc({
      status: "notoken",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "normalauth",
    });
    return res.render("login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usermail = decoded.email;
    prometheus.authCount.inc({
      status: "success",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "normalauth",
    });
    next();
  } catch (error) {
    prometheus.authCount.inc({
      status: "failed",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "normalauth",
    });
    return res.redirect("/login");
  }
};

exports.adminOnly = async (req, res, next) => {
  const token = req.cookies.AccessToken;

  if (!token) {
    prometheus.authCount.inc({
      status: "notoken",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "adminauth",
    });
    return res.redirect("login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModels.findUserByMail(decoded.email);

    if (!user) {
      prometheus.authCount.inc({
        status: "failed",
        method: req.method,
        route: req.route ? req.route.path : req.path,
        type: "adminauth",
      });
      return res.redirect("login");
    }

    if (!(user.role === "admin")) {
      prometheus.authCount.inc({
        status: "failed",
        method: req.method,
        route: req.route ? req.route.path : req.path,
        type: "adminauth",
      });
      return res.redirect("login");
    }

    next();
  } catch (error) {
    prometheus.authCount.inc({
      status: "error",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "adminauth",
    });
    return res.redirect("/login");
  }
};
