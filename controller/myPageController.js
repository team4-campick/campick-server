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
  getPostCount,
  getReviewCount,
  getMissionClear,
  getBingoCount,
  getContinuousConnection,
  updateMissionList,
  getBingoPattern,
  resetMission,
  resetBingo,
} = require("../services/bingoService");

const { bingoMission } = require("../utils/bingoMission");
const { syncBingo } = require("../utils/syncBingo");

const updateInquiry = async (req, res) => {
  try {
    const { title, email, content } = req.body;
    const inquiryDoc = await Inquiry.create({ title, email, content });
    res.status(200).json(inquiryDoc);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
};
const updateUser = async (req, res) => {
  try {
    const username = req.params.id;
    const { nickname, password } = req.body;
    console.log("test", username);
    console.log("nickname", nickname);
    console.log(nickname, password);
    const userDoc = await updateUserData(username, nickname, password);
    console.log("userDoc", userDoc);
    res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
  }
};
const deleteUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("test", userId);
    const deletedUser = await deleteUser(userId);
    res.status(200).json({ result: true, message: deletedUser.message });
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};

const duplicateCheck = async (req, res) => {
  try {
    const { nickname } = req.body;
    console.log(nickname);
    const nicknameDoc = await duplicateNickname(nickname);
    console.log(nicknameDoc.message);
    res.status(200).json({ result: true, message: nicknameDoc.message });
  } catch (error) {
    res.status(409).json({ result: false, message: error.message });
  }
};
const pwCheck = async (req, res) => {
  try {
    const username = req.params.id;
    console.log("username test", username);
    const { password } = req.body;
    const passwordDoc = await passwordCheck(username, password);
    console.log("passwordDoc", passwordDoc);
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
    // const userInfo = await User.findOne({ username });
    // userInfo 찾은 부분도 service 단으로 옮겨야할듯.
    const postCount = await getPostCount(userObjId);
    const reviewCount = await getReviewCount(userObjId);
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

    const bingo = await Bingo.findById(userObjId);
    const mission = await updateMissionList(userObjId, newMission);
    const updatedBingo = await syncBingo(bingo, checkedMission);
    await Bingo.findByIdAndUpdate(userObjId, { $set: updatedBingo });
    res.status(200).json({ mission, bingo: updatedBingo });
  } catch (error) {
    console.error(error);
  }
};
const getBingo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingo = await Bingo.findOne({ _id: userObjId });
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
const getBingoCountFunc = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingoCount = await getBingoCount(userObjId);
    res.status(200).json({ bingoCount });
  } catch (error) {
    console.error(error);
  }
};
const getBingoPatternStatus = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingoPattern = await getBingoPattern(userObjId);
    res.status(200).json({ bingoPattern });
  } catch (error) {
    console.error(error);
  }
};
// Remove later.
const bingoStatusUpdate = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

const bingoStatusReset = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingo = await resetBingo(userObjId);
    await resetMission(userObjId);
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
const getPost = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    console.log("testtest", userInfo._id);
    const post = await BlogPost.find({ authorId: userInfo._id });
    console.log("post list get test", post);
    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
  }
};
const getSalePost = async (req, res) => {
  try {
    console.log("start get sale post");
    const authorId = req.params.id;
    console.log("what", authorId);
    const salePost = await SalePost.find({ authorId });
    console.log("salePost", salePost);
    res.status(200).json({ salePost });
  } catch (error) {
    console.error(error);
  }
};

// ================ 쿠폰 관련 API ====================
const getCouponList = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const couponList = await Coupon.find({ owner: ownerId });
    // const couponList = await Coupon.populate("owner").findById(userInfo._id);
    console.log("couponList", couponList);
    res.status(200).json({ couponList });
  } catch (error) {
    console.error(error);
  }
};
const checkCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const userCoupon = await Coupon.findOne({ owner: ownerId }).findOne({
      condition: coupon.CONDITION,
      status: "active",
    });
    console.log("userCoupon", userCoupon);
    // const check = await userCoupon?;
    if (!userCoupon) {
      res.status(200).json({ message: "쿠폰이 없습니다." });
    }
    if (userCoupon && userCoupon.status === "active")
      res.status(401).json({ message: "쿠폰이 있습니다." });
  } catch (error) {
    console.error(error);
  }
};
const issuanceCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const serialNum = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    console.log("serialNum", serialNum);
    const getDateNdays = async (nowDate, date) => {
      const expirationDate = new Date(nowDate);
      expirationDate.setDate(expirationDate.getDate() + date);
      return new Date(expirationDate).toISOString();
    };

    await Coupon.create({
      owner: ownerId,
      date: coupon.DATE,
      condition: coupon.CONDITION,
      type: coupon.TYPE,
      serialNum,
      status: "active",
      activeDate: new Date().toISOString(),
      expireDate: await getDateNdays(new Date(), coupon.DATE),
    });

    res.status(201).json({ message: "새로운 쿠폰 발급 완료" });
  } catch (error) {
    console.error(error);
  }
};
const deleteCoupon = async (req, res) => {
  try {
    console.log("delete coupon func");
    const id = req.params.id;
    console.log("id check", id);
    await Coupon.findByIdAndDelete({ _id: id });
    res.status(204).json({ message: "삭제 완료" });
  } catch (error) {
    console.error(error);
  }
};
const couponStatusChange = async (req, res) => {
  try {
    const couponId = req.params.id;
    await Coupon.findByIdAndUpdate(couponId, { status: "expired" });
    res.status(204).json({ message: "상태 변경 완료" });
  } catch (error) {
    console.error(error);
  }
};
async function checkAndExpireCoupons() {
  try {
    const now = new Date();
    const activeCoupons = await Coupon.find({ status: "active" });
    for (let coupon of activeCoupons) {
      const expirationDate = new Date(coupon.activeDate);
      expirationDate.setDate(expirationDate.getDate() + coupon.date);
      if (now > expirationDate) {
        coupon.status = "expired";
        await coupon.save();
        console.log(`Coupon ${coupon.serialNum} has expired.`);
      }
    }
  } catch (error) {
    console.error("Error checking and expiring coupons:", error);
  }
}
cron.schedule("0 0 * * *", () => {
  console.log("Running daily coupon expiration check");
  checkAndExpireCoupons();
});

module.exports = {
  // getUser,
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
