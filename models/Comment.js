const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 500,
    }
  });

module.exports = mongoose.model("Comment", CommentSchema);