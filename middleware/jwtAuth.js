const jwt = require("jsonwebtoken");

const prometheus = require("../config/prometheus.js");

const userModels = require("../models/userModels.js");

const vault = require("../config/vault.js");

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

  let jwt_secret;

  (() => {
    secrets = vault.getStaticSecrets();
    jwt_secret = secrets.JWT_TOKEN;
  })();

  try {
    const decoded = jwt.verify(token, jwt_secret);
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

  let jwt_secret;

  (() => {
    secrets = vault.getStaticSecrets();
    jwt_secret = secrets.JWT_TOKEN;
  })();

  try {
    const decoded = jwt.verify(token, jwt_secret);

    const user = await userModels.findUserByMail(decoded.email);

    if (!user) {
      prometheus.authCount.inc({
        status: "failed",
        method: req.method,
        route: req.route ? req.route.path : req.path,
        type: "adminauth",
      });
      return res.redirect("/app");
    }

    if (!(user.role === "admin")) {
      prometheus.authCount.inc({
        status: "failed",
        method: req.method,
        route: req.route ? req.route.path : req.path,
        type: "adminauth",
      });
      return res.send(`<h1>You are not authorized to access this page.</h1>
        <a href="/app">Go Back</a>`);
    }

    next();
  } catch (error) {
    prometheus.authCount.inc({
      status: "error",
      method: req.method,
      route: req.route ? req.route.path : req.path,
      type: "adminauth",
    });
    return res.redirect("/app");
  }
};
