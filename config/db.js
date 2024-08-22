const mysql = require("mysql2/promise");
const vault = require("./vault");

let pool;

const updateDatabasePool = async () => {
  try {
    const secrets = await vault.getSecrets();

    pool = mysql.createPool({
      host: secrets.DATABASE_HOST,
      user: secrets.DATABASE_USER,
      password: secrets.DATABASE_PASS,
      database: secrets.DATABASE_NAME,
    });

    console.log("Database pool updated successfully");
  } catch (error) {
    console.error("Error updating database pool");
  }
};

const connectToDatabase = async () => {
  try {
    if (!pool) {
      await updateDatabasePool();
    }
    await pool.getConnection();
    console.log("Connected to database successfully");
    await createTables();
  } catch (error) {
    console.error("Database Connection Failed!");
    console.error("Database Error!");
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error(
      "Database pool not initialized. Please ensure connectToDatabase is called first."
    );
  }
  return pool;
};

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

  try {
    await pool.query(createUsersTable);
    console.log("Users table created or already exists.");

    await pool.query(createPostsTable);
    console.log("Posts table created or already exists.");

    await pool.query(createCommentsTable);
    console.log("Comments table created or already exists.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = { pool, updateDatabasePool, connectToDatabase, getPool };
