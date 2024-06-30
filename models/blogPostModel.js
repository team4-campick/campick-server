const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  url: {
    type: String,
  },
});

const blogPostSchema = new Schema(
  {
    nickname: {
      type: String,
      ref: "User",
    },
    title: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },

    imageUrls: {
      type: [imageSchema],
    },
  },
  {
    timestamps: true,
  }
);

const BlogPost = model("BlogPost", blogPostSchema);

module.exports = BlogPost;
