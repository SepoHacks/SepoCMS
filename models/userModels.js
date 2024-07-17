const { pool } = require("../config/db.js")

const findUserByMail = async (email) => {
  const [result] = await pool.query("SELECT * FROM users WHERE usermail = ?", [email]);
  return result[0] || null;
}

const createNewUser = async (email, password) => {
  await pool.query("INSERT INTO users SET ?", {
    usermail: email,
    password: password,
  });
}

module.exports = { findUserByMail, createNewUser };