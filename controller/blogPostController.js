const BlogPost = require("../models/blogPostModel.js");
const fs = require("fs");
const { cloudinaryUpload } = require("../utils/fileUpload.js");
const Mission = require("../models/Mission.js");

const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    if (blogPosts.length === 0) {
      return res.status(200).json({ result: true, blogPosts: [] });
    }
    return res.status(200).json({ result: true, blogPosts });
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: "잠시후 다시 시도해주세요.",
    });
  }
};

const getBlogPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    return res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const createBlogPost = async (req, res) => {
  const { content, region, city, blogPostTitle, campSiteName, blogPostDesc } =
    req.body;

  const { nickname, _id } = req.user;

  const mission = await Mission.findByIdAndUpdate(
    { _id },
    { $inc: { postCount: 1 } }
  );

  // const imageUrls = [];
  // for (const file of req.files) {
  //   const imageUrl = await cloudinaryUpload(file);
  //   imageUrls.push({ url: imageUrl });
  //   // uploads/images 폴더에 임시로 저장된 이미지 파일 삭제
  //   fs.unlinkSync(file.path);
  // }

  // const newPost = JSON.parse(req.body.newPost);

  const newPost = {
    blogPostTitle,
    author: nickname,
    authorId: _id,
    content,
    region,
    city,
    campSiteName,
    blogPostDesc,
  };

  try {
    const blogPost = new BlogPost({
      ...newPost,
      city: newPost.city ?? " ",
    });

    await blogPost.save();
    return res.status(201).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 생성에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const { blogPostTitle, content, region, city, campSiteName, blogPostDesc } =
    req.body;

  try {
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    blogPost.blogPostTitle = blogPostTitle;
    blogPost.content = content;
    blogPost.region = region;
    blogPost.city = city;
    blogPost.campSiteName = campSiteName;
    blogPost.blogPostDesc = blogPostDesc;

    await blogPost.save();
    return res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 수정에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const deleteBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    await BlogPost.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ result: true, message: "게시물이 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 삭제에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
