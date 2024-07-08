const Inquiry = require("../models/Inquiry");
const User = require("../models/User");
const Bingo = require("../models/Bingo");
const Coupon = require("../models/Coupon");
const BlogPost = require("../models/blogPostModel");
const SalePost = require("../models/salePostModel");
const cron = require("node-cron");

const UserServices = require("../services/userServices");
const {
  getPostCount,
  getReviewCount,
  getMissionClear,
  getBingoCount,
  getContinuousConnection,
  updateBingoMission,
  updateMissionList,
  getBingoPattern,
  resetMission,
  resetBingo,
} = require("../services/bingoService");
const { bingoMission } = require("../utils/bingoMission");
const { syncBingo } = require("../utils/syncBingo");

exports.updateInquiry = async (req, res) => {
  try {
    const { title, email, content } = req.body;
    const inquiryDoc = await Inquiry.create({ title, email, content });
    res.status(200).json(inquiryDoc);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const username = req.params.id;
    const { nickname, password } = req.body;
    console.log("test", username);
    console.log("nickname", nickname);
    console.log(nickname, password);
    const userDoc = await UserServices.updateUserData(
      username,
      nickname,
      password
    );
    console.log("userDoc", userDoc);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
};
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDoc = await UserServices.getUserData(userId);
    console.log("userId", userId);
    console.log("userDoc", userDoc);
    res.status(200).json({ success: true, userDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("test", userId);
    const deletedUser = await UserServices.deleteUser(userId);
    res.status(200).json({ success: true, message: deletedUser.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.duplicateCheck = async (req, res) => {
  try {
    const { nickname } = req.body;
    console.log(nickname);
    const nicknameDoc = await UserServices.duplicateNickname(nickname);
    console.log(nicknameDoc.message);
    res.status(200).json({ success: true, message: nicknameDoc.message });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
  }
};
exports.passwordCheck = async (req, res) => {
  try {
    const username = req.params.id;
    console.log("username test", username);
    const { password } = req.body;
    await UserServices.passwordCheck(username, password);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
exports.updateMission = async (req, res) => {
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
exports.getBingo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingo = await Bingo.findOne({ _id: userObjId });
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
exports.getBingoCount = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingoCount = await getBingoCount(userObjId);
    res.status(200).json({ bingoCount });
  } catch (error) {
    console.error(error);
  }
};
exports.getBingoPattern = async (req, res) => {
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
exports.bingoStatusUpdate = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

exports.bingoStatusReset = async (req, res) => {
  try {
    const userObjId = req.params.id;
    // const userInfo = await User.findOne({ username });
    const bingo = await resetBingo(userObjId);
    await resetMission(userInfo._id);
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
exports.getPost = async (req, res) => {
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
exports.getSalePost = async (req, res) => {
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
exports.getCouponList = async (req, res) => {
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
exports.checkCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const userCoupon = await Coupon.findOne({ owner: ownerId }).findOne({
      condition: coupon.CONDITION,
    });
    console.log("userCoupon", userCoupon);
    // const check = await userCoupon?;
    if (!userCoupon) {
      res.status(200).json({ message: "쿠폰이 없습니다." });
    }
    if (userCoupon) res.status(401).json({ message: "쿠폰이 있습니다." });
  } catch (error) {
    console.error(error);
  }
};
exports.issuanceCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const serialNum = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    console.log("serialNum", serialNum);
    const newCoupon = await Coupon.create({
      owner: ownerId,
      date: coupon.DATE,
      condition: coupon.CONDITION,
      type: coupon.TYPE,
      serialNum,
      status: "active",
      activeDate: new Date().toISOString(),
    });
    console.log("coupon create test", newCoupon);
    res.status(201).json({ message: "새로운 쿠폰 발급 완료" });
  } catch (error) {
    console.error(error);
  }
};
exports.activateCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        status: "active",
        activeDate: new Date(),
      },
      { new: true }
    );
    if (updatedCoupon) {
      console.log("Coupon activated:", updatedCoupon);
    } else {
      console.log("Coupon not found");
    }
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
