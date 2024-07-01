const { Router } = require("express");
const {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("../controller/blogPostController.js");
const { fileUpload } = require("../utils/fileUpload.js");

const router = Router();
router.route("/").get(getBlogPosts);
router.route("/").post(fileUpload.array("images"), createBlogPost);
router
  .route("/:id")
  .get(getBlogPostById)
  .put(updateBlogPost)
  .delete(deleteBlogPost);

module.exports = router;
