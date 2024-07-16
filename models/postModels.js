const { pool } = require("../config/db.js")

const getAllPosts = async () => {
  const [result] = await pool.query("SELECT * FROM posts");
  return result || null;
}

module.exports = { getAllPosts }
