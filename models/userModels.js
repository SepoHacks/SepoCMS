const { pool } = require("../config/db.js")

const findUserByMail = async (email) => {
  const [result] = await pool.query("SELECT * FROM users WHERE usermail = ?", [email]);
  return result[0] || null;
}

module.exports = { findUserByMail };