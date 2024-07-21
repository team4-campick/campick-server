const Inquiry = require("../models/Inquiry");
const User = require("../models/User");
const Bingo = require("../models/Bingo");
const Coupon = require("../models/Coupon");
const BlogPost = require("../models/blogPostModel");
const SalePost = require("../models/salePostModel");
const cron = require("node-cron");

const {
  updateUserData,
  deleteUser,
  duplicateNickname,
  passwordCheck,
} = require("../services/userServices");

const {
  getMission,
  // getPostCount,
  // getReviewCount,
  getMissionClear,
  getBingoCount,
  getContinuousConnection,
  updateBingo,
  updateMissionList,
  getBingoPattern,
  resetMission,
  resetBingo,
  getUserBingo,
} = require("../services/bingoService");

const {
  getCoupons,
  availableCoupons,
  removeCoupon,
  expiredCoupon,
} = require("../services/couponService");

const { createInquiry } = require("../services/inquiryService");

const { bingoMission } = require("../utils/bingoMission");
const { syncBingo } = require("../utils/syncBingo");

const updateInquiry = async (req, res) => {
  try {
    const { title, email, content } = req.body;
    const inquiryDoc = await createInquiry(title, email, content);
    if (inquiryDoc) res.status(200).json({ result: true, inquiryDoc });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { nickname, password } = req.body;
    const userData = await updateUserData(userObjId, nickname, password);
    if (userData.result) res.status(200).json({ result: true });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const deleteUserInfo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const deletedUser = await deleteUser(userObjId);
    if (deleteUser.result)
      res.status(200).json({ result: true, message: deletedUser.message });
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};

const duplicateCheck = async (req, res) => {
  try {
    const { nickname } = req.body;
    const nicknameDoc = await duplicateNickname(nickname);
    if (nicknameDoc)
      res.status(200).json({ result: true, message: nicknameDoc.message });
  } catch (error) {
    res.status(409).json({ result: false, message: error.message });
  }
};
const pwCheck = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { password } = req.body;
    const passwordDoc = await passwordCheck(userObjId, password);
    if (passwordDoc) {
      res.status(200).json({ result: true });
    }
  } catch (error) {
    res.status(401).json({ result: false, message: error.message });
  }
};
const updateMission = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // 아래 postCount, reviewCount, missionClear, bingoCount, continuousConnection 은 Mission를 가져와서 업데이트 하면 되는거 아닌가..

    // test
    const { postCount, reviewCount } = await getMission(userObjId);

    console.log("postCount", postCount);
    console.log("reviewCount", reviewCount);
    // const postCount = await getPostCount(userObjId);
    // const reviewCount = await getReviewCount(userObjId);
    const missionClear = await getMissionClear(userObjId);
    const bingoCount = await getBingoCount(userObjId);
    const continuousConnection = await getContinuousConnection(userObjId);

    const newMission = {
      postCount,
      reviewCount,
      missionClear,
      bingoCount,
      continuousConnection,
    };
    const checkedMission = bingoMission(newMission);

    // const bingo = await Bingo.findById(userObjId);
    const bingo = await getUserBingo(userObjId);
    const mission = await updateMissionList(userObjId, newMission);
    const updatedBingo = await syncBingo(bingo, checkedMission);
    const newestBingo = await updateBingo(userObjId, updatedBingo);
    if (newestBingo)
      res.status(200).json({ result: true, mission, bingo: updatedBingo });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const getBingo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingo = await getUserBingo(userObjId);
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
const getBingoCountFunc = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingoCount = await getBingoCount(userObjId);
    res.status(200).json({ bingoCount });
  } catch (error) {
    console.error(error);
  }
};
const getBingoPatternStatus = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingoPattern = await getBingoPattern(userObjId);
    res.status(200).json({ bingoPattern });
  } catch (error) {
    console.error(error);
  }
};
const bingoStatusReset = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingo = await resetBingo(userObjId);
    await resetMission(userObjId);
    res.status(200).json({ result: true, bingo });
  } catch (error) {
    console.error(error);
  }
};
const getPost = async (req, res) => {
  try {
    const authorId = req.params.id;
    // BlogPost 부분은 서비스단 생기면 옮길 예정
    const blogPost = await BlogPost.find({ authorId });
    res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.error(error);
  }
};
const getSalePost = async (req, res) => {
  try {
    const authorId = req.params.id;
    // salePost 부분은 서비스단 생기면 옮길 예정
    const salePost = await SalePost.find({ authorId });
    res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.error(error);
  }
};

// ================ 쿠폰 관련 ====================
const getCouponList = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const couponList = await getCoupons(ownerId);
    // const couponList = await Coupon.findById(userInfo._id).populate("owner");
    res.status(200).json({ result: true, couponList });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const checkCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const userCoupon = await availableCoupons(ownerId, coupon);
    console.log("userCoupon", userCoupon);
    if (!userCoupon) {
      res.status(200).json({ result: true, message: "쿠폰이 없습니다." });
    }
    if (userCoupon && userCoupon.status === "active")
      res.status(401).json({ message: "쿠폰이 있습니다." });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const issuanceCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    // const serialNum = Math.floor(
    //   100000000000 + Math.random() * 900000000000
    // ).toString();
    // const getDateNdays = async (nowDate, date) => {
    //   const expirationDate = new Date(nowDate);
    //   expirationDate.setDate(expirationDate.getDate() + date);
    //   return new Date(expirationDate).toISOString();
    // };

    // await Coupon.create({
    //   owner: ownerId,
    //   date: coupon.DATE,
    //   condition: coupon.CONDITION,
    //   type: coupon.TYPE,
    //   serialNum,
    //   status: "active",
    //   activeDate: new Date().toISOString(),
    //   expireDate: await getDateNdays(new Date(), coupon.DATE),
    // });

    await createCoupon(ownerId, coupon);
    res.status(201).json({ result: true, message: "새로운 쿠폰 발급 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await removeCoupon(id);
    res.status(204).json({ result: true, message: "삭제 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const couponStatusChange = async (req, res) => {
  try {
    const couponId = req.params.id;
    await expiredCoupon(couponId);
    // await Coupon.findByIdAndUpdate(couponId, { status: "expired" });
    res.status(204).json({ result: true, message: "상태 변경 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};

module.exports = {
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
};
