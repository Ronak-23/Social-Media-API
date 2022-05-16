const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const auth = require('../middleware/auth');

router.post("/", auth, async (req, res) => {
  const {desc, img} = req.body;
  const newPost = new Post({userId : req.user.id, desc, img});
  console.log(newPost);
  console.log("saved post");
  try {
    const savedPost = await newPost.save();
    console.log(savedPost);
    console.log("saved post");
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.id) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comments = await Comment.find({ postId: req.params.id });
    console.log(comments);
    post["comments"] = await comments;
    // post.set("comments", comments);
    newPost = await post.save();
    console.log(post);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
