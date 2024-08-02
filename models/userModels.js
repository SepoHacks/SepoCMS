const { pool } = require("../config/db.js");

const findUserByMail = async (email) => {
  const [result] = await pool.query("SELECT * FROM users WHERE usermail = ?", [
    email,
  ]);
  return result[0] || null;
};

const createNewUser = async (email, password, role = "user") => {
  await pool.query("INSERT INTO users SET ?", {
    usermail: email,
    password: password,
    role: role,
  });
};

const getUsersCount = async () => {
  const [result] = await pool.query("SELECT COUNT(*) AS count FROM users");
  return result[0].count;
};

module.exports = { findUserByMail, createNewUser, getUsersCount };
