const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prometheus = require("../config/prometheus.js");

const userModels = require("../models/userModels.js");

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const register = async (req, res) => {
  const { email, password, cpassword } = req.body;

  if (!email || !password || !cpassword) {
    prometheus.registerCount.inc({ status: "blank" });
    return res.json({ msg: "Please fill all blanks." });
  }

  if (!validateEmail(email)) {
    prometheus.registerCount.inc({ status: "invalidemail" });
    return res.json({ msg: "Invalid email format" });
  }

  if (password.length < 8) {
    prometheus.registerCount.inc({ status: "shortpassword" });
    return res.json({ msg: "Password must be at least 8 characters long" });
  }

  if (password !== cpassword) {
    prometheus.registerCount.inc({ status: "notsame" });
    return res.json({ msg: "Passwords not same." });
  }

  try {
    const user = await userModels.findUserByMail(email);
    const usersCount = await userModels.getUsersCount();

    const role = usersCount === 0 ? "admin" : "user";

    if (user) {
      prometheus.registerCount.inc({ status: "exists" });
      return res.json({ msg: "There is a user with the same email." });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await userModels.createNewUser(email, hashedPassword, role);

    prometheus.registerCount.inc({ status: "success" });
    return res.json({ red: "/login" });
  } catch (error) {
    console.error("Register Error:", error);
    prometheus.registerCount.inc({ status: "error" });
    return res.json({ msg: "Something went wrong." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    prometheus.loginCount.inc({ status: "blank" });
    return res.json({ msg: "Please fill all blanks" });
  }

  if (!validateEmail(email)) {
    prometheus.loginCount.inc({ status: "invalidemail" });
    return res.json({ msg: "Invalid email format" });
  }

  try {
    const user = await userModels.findUserByMail(email);

    if (!user) {
      prometheus.loginCount.inc({ status: "notfound" });
      return res.json({ msg: "Invalid email or password." });
    }

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame) {
      prometheus.loginCount.inc({ status: "failed" });
      return res.json({ msg: "Invalid email or password." });
    }

    const userInfo = { email: email };
    const userToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    prometheus.loginCount.inc({ status: "success" });
    res.cookie("AccessToken", userToken);
    return res.json({ red: "/app" });
  } catch (error) {
    console.error("Login Error:", error);
    prometheus.loginCount.inc({ status: "error" });
    return res.json({ msg: "Something went wrong." });
  }
};

module.exports = { register, login };
