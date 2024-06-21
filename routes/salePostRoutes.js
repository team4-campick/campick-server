const { Router } = require("express");
const {
  getSalePosts,
  getSalePostById,
  createSalePost,
  updateSalePost,
  deleteSalePost,
} = require("../controller/salePostController.js");

const router = Router();
router.route("/").get(getSalePosts).post(createSalePost);
router
  .route("/:id")
  .get(getSalePostById)
  .put(updateSalePost)
  .delete(deleteSalePost);

module.exports = router;
