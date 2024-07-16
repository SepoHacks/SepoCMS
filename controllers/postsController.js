const postModels = require("../models/postModels");

const { pool } = require("../config/db.js");

const getAllPosts = async (req, res) => {
  const result2 = await postModels.getAllPosts();

  if (!result2) return res.json({ msg: "Someting went wrong" });

  return res.json(result2);
}

const sendNewPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) return res.json({ msg: "fill all blanks" });

  try {
    await pool.query("INSERT INTO posts SET ?", { title: title, content: content });
    return res.json({ msg: "done" });
  } catch (error) {
    return res.json({ msg: "error" });
  }
}

const getCustomPostData = async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM posts WHERE postid = ?", [req.params.id]);

    if (!data[0]) return res.json({ msg: "No post with this id" });

    return res.json(data[0])
  } catch {
    res.json({ msg: "Oh no ther is no post with this id" });
  }
}

const getCustomPostComments = async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM comments WHERE post_id = ?", [req.params.id]);
    if (!data[0]) return res.json({ msg: "No comments yet" });
    return res.json(data)
  } catch {
    res.json({ msg: "Someting went wrong" });
  }
}

const sendComment = async (req, res) => {
  const { comment } = req.body;

  if (!comment) return res.json({ msg: "Fill All Blanks Please" });

  try {
    await pool.query("INSERT INTO comments SET ?", { post_id: req.params.id, user_email: req.usermail, comment: comment });
    return res.json({ msg: "sent!" });
  } catch (error) {
    return res.json({ msg: "Someting went wrong" });
  }
}


module.exports = { getAllPosts, sendNewPost, getCustomPostData, getCustomPostComments, sendComment };