const jwt = require("jsonwebtoken");

const userModels = require("../models/userModels.js");

exports.authenticate = (req, res, next) => {
  const token = req.cookies.AccessToken;
  if (!token) return res.render("login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usermail = decoded.email;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
}

exports.adminOnly = async (req, res, next) => {
  const token = req.cookies.AccessToken;
  if (!token) return res.redirect("login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModels.findUserByMail(decoded.email);

    if (!user) return res.redirect("login");

    if (!(user.role === "admin")) return res.redirect("login");

    next();
  } catch (error) {
    return res.redirect("/login");
  }
}
