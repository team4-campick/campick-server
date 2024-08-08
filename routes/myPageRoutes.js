const { Router } = require("express");
const router = Router();

const {
  updateInquiry,
  deleteUserInfo,
  duplicateCheck,
  pwCheck,
  updateUser,
  getBingo,
  getBingoCountFunc,
  getBingoPatternStatus,
  getPost,
  updateMission,
  bingoStatusReset,
  checkCoupon,
  issuanceCoupon,
  getCouponList,
  deleteCoupon,
  couponStatusChange,
  getSalePost,
} = require("../controller/myPageController");

router.post("/inquiry", updateInquiry);

router.route("/user/:id").put(updateUser).delete(deleteUserInfo);
// router.delete("/user/:id", deleteUser);
// router.post("/user/:id", updateUser);

router.post("/duplicateCheck", duplicateCheck);
router.post("/passwordCheck/:id", pwCheck);

router.get("/bingo-area/:id", getBingo);
router.get("/bingo-count/:id", getBingoCountFunc);
router.get("/bingo-pattern/:id", getBingoPatternStatus);
router.get("/post/:id", getPost);
router.put("/update-mission/:id", updateMission);
router.put("/reset-bingo/:id", bingoStatusReset);
router.post("/check-duplicate/:id", checkCoupon);

// router.get("/coupon/:id", getCouponList);

router
  .route("/coupon/:id")
  .get(getCouponList)
  .put(issuanceCoupon)
  .post(couponStatusChange)
  .delete(deleteCoupon);
// router.delete("/coupon/:id", deleteCoupon);
// router.post("/coupon/:id", couponStatusChange);
// router.post("/issue-coupon/:id", issuanceCoupon);

router.get("/sale-post/:id", getSalePost);

module.exports = router;
