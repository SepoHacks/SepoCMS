const { getPool } = require("../config/db.js");

const executeQuery = async (query, params) => {
  const pool = getPool();
  return await pool.query(query, params);
};

const findUserByMail = async (email) => {
  const [result] = await executeQuery(
    "SELECT * FROM users WHERE usermail = ?",
    [email]
  );
  return result[0] || null;
};

const createNewUser = async (email, password, role = "user") => {
  await executeQuery("INSERT INTO users SET ?", {
    usermail: email,
    password: password,
    role: role,
  });
};

const getUsersCount = async () => {
  const [result] = await executeQuery("SELECT COUNT(*) AS count FROM users");
  return result[0].count;
};

module.exports = { findUserByMail, createNewUser, getUsersCount };
