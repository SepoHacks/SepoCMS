const mysql = require('mysql2/promise');
const { getDatabaseSecrets } = require('./vault');

let pool;

const updateDatabasePool = async () => {
  try {
    const secrets = await getDatabaseSecrets();
    const { DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME } = secrets;

    pool = mysql.createPool({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASS,
      database: DATABASE_NAME,
    });

    console.log('Database pool updated successfully');
  } catch (error) {
    console.error('Error updating database pool:', error);
  }
};

const connectToDatabase = async () => {
  try {
    await updateDatabasePool();
    await pool.getConnection();
    console.log('Connected to database successfully');
    createTables();
  } catch (error) {
    console.log('Database Connection Failed!');
    console.log('Database Error:', error);
  }
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
    console.log('Users table created or already exists.');

    await pool.query(createPostsTable);
    console.log('Posts table created or already exists.');

    await pool.query(createCommentsTable);
    console.log('Comments table created or already exists.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = { pool, updateDatabasePool, connectToDatabase };
