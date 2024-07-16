const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const connectToDatabase = async () => {
  try {
    await pool.getConnection();
    console.log("Connected to database successfuly");
    createTables();
  } catch (error) {
    console.log("Database Connection Faild!");
    console.log("Database Error : ", error);
    return;
  }
}

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usermail VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user'
    );
  `;

  const createPostsTable = `
    CREATE TABLE IF NOT EXISTS posts (
      postid INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL
    );
  `;

  const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      post_id INT NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(postid) ON DELETE CASCADE
    );
  `;

  await pool.query(createUsersTable);
  console.log('Users table created or already exists.');

  await pool.query(createPostsTable);
  console.log('Posts table created or already exists.');

  await pool.query(createCommentsTable);
  console.log('Comments table created or already exists.');
};


module.exports = { pool, connectToDatabase };
