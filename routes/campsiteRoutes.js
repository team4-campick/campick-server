const express = require("express");
const router = express.Router();

const campsiteController = require("../controller/campsiteController");

router.get("/get-reviews/:id", campsiteController.getReviews);
router.post("/create-review/:id", campsiteController.createReview);
router.get("/user/:id", campsiteController.getUser);
router.delete("/delete/:id", campsiteController.deleteReview);
router.post("/edit-review/:id", campsiteController.editReview);

module.exports = router;
