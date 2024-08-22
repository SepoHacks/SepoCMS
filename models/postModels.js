const database = require("../config/db.js");

const executeQuery = async (query, params) => {
  const pool = database.getPool();
  return await pool.query(query, params);
};

const getAllPosts = async () => {
  const [result] = await executeQuery("SELECT * FROM posts");
  return result || null;
};

const getAllPostsCount = async () => {
  const [result] = await executeQuery("SELECT * FROM posts");
  return result.length || 0;
};

const createNewPost = async (title, content) => {
  await executeQuery("INSERT INTO posts SET ?", {
    title: title,
    content: content,
  });
};

const getPostData = async (id) => {
  const result = await executeQuery("SELECT * FROM posts WHERE postid = ?", [id]);
  return result[0] || null;
};

const getPostComments = async (id) => {
  const result = await executeQuery("SELECT * FROM comments WHERE post_id = ?", [id]);
  return result[0] || null;
};

const addComment = async (postid, email, comment) => {
  await executeQuery("INSERT INTO comments SET ?", {
    post_id: postid,
    user_email: email,
    comment: comment,
  });
};

module.exports = {
  getAllPosts,
  createNewPost,
  getPostData,
  getPostComments,
  addComment,
  getAllPostsCount,
};
