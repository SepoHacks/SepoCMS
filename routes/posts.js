const express = require('express');
const jwtAuth = require('../middleware/jwtAuth');
const router = express.Router();

const postsController = require("../controllers/postsController")

// New Post
router.post("/post", jwtAuth.adminOnly, postsController.sendNewPost);

// All Posts
router.get("/getAll", jwtAuth.authenticate, postsController.getAllPosts);

// Custom Posts
router.get("/get/:id", jwtAuth.authenticate, (req, res) => {
  res.render("customPosts");
});

router.get("/get/:id/data", jwtAuth.authenticate, postsController.getCustomPostData);
router.get("/get/:id/data/comments", jwtAuth.authenticate, postsController.getCustomPostComments);

router.post("/get/:id/comment", jwtAuth.authenticate, postsController.sendComment);

module.exports = router;