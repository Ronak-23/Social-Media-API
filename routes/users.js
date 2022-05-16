const User = require("../models/User");
const router = require("express").Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const auth = require('../middleware/auth')

router.get("/all_posts", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ userId: req.user.id });
    var len = userPosts.length;
    var curIdx = 0;
    var allPosts = [];
    userPosts.forEach(async post => {
       let newpost = {
        id: post._id,
        desc: post.desc,
        img: post.img,
        userId: post.userId,
        likes: post.likes,
        comments : await Comment.find({ postId: post._id })
      }
      curIdx++;
      allPosts.push(newpost);
      if (curIdx == len) {
        res.status(200).json(allPosts);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/user', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password")
      res.json(user)
  } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
  }
})

router.post("/follow/:id",auth, async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can not follow yourself");
  }
});

router.post("/unfollow/:id",auth, async (req, res) => {
    if (req.user.id !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if (user.followers.includes(req.user.id)) {
          await user.updateOne({ $pull: { followers: req.user.id } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you don't follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can not unfollow yourself");
    }
  });


router.post("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked");
    } else {
      res.status(200).json("The post has been already liked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/dislike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json("The post has been disliked");
    } else {
      res.status(200).json("The post has not been liked yet");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const newComment = {
      text: req.body.text,
      postId: req.params.id,
    };
    const comment = await Comment.create(newComment);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
