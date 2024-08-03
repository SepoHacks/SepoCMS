const { pool } = require("../config/db.js");

const getAllPosts = async () => {
  const [result] = await pool.query("SELECT * FROM posts");
  return result || null;
};

const getAllPostsCount = async () => {
  const [result] = await pool.query("SELECT * FROM posts");
  return result.length || 0;
};

const createNewPost = async (title, content) => {
  await pool.query("INSERT INTO posts SET ?", {
    title: title,
    content: content,
  });
};

const getPostData = async (id) => {
  const result = await pool.query("SELECT * FROM posts WHERE postid = ?", [id]);
  return result[0] || null;
};

const getPostComments = async (id) => {
  const result = await pool.query("SELECT * FROM comments WHERE post_id = ?", [id]);
  return result[0] || null;
};

const addComment = async (postid, email, comment) => {
  await pool.query("INSERT INTO comments SET ?", {
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
