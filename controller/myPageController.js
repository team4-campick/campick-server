const Inquiry = require("../models/Inquiry");
const User = require("../models/User");
const Bingo = require("../models/Bingo");
const Coupon = require("../models/Coupon");
const BlogPost = require("../models/blogPostModel");
const SalePost = require("../models/salePostModel");
// const cron = require("node-cron");

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
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    // userInfo 찾은 부분도 service 단으로 옮겨야할듯.
    const postCount = await getPostCount(userInfo?._id);
    const reviewCount = await getReviewCount(userInfo?._id);
    const missionClear = await getMissionClear(userInfo?._id);
    const bingoCount = await getBingoCount(userInfo?._id);
    const continuousConnection = await getContinuousConnection(userInfo?._id);

    const newMission = {
      postCount,
      reviewCount,
      missionClear,
      bingoCount,
      continuousConnection,
    };
    const checkedMission = bingoMission(newMission);

    const bingo = await Bingo.findById(userInfo._id);
    const mission = await updateMissionList(userInfo._id, newMission);
    const updatedBingo = await syncBingo(bingo, checkedMission);
    await Bingo.findOneAndUpdate({ _id: userInfo._id }, { $set: updatedBingo });
    res.status(200).json({ mission, bingo: updatedBingo });
  } catch (error) {
    console.error(error);
  }
};
exports.getBingo = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    const bingo = await Bingo.findOne({ _id: userInfo._id });
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
exports.getBingoCount = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    const bingoCount = await getBingoCount(userInfo._id);
    res.status(200).json({ bingoCount });
  } catch (error) {
    console.error(error);
  }
};
exports.getBingoPattern = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    const bingoPattern = await getBingoPattern(userInfo._id);
    res.status(200).json({ bingoPattern });
  } catch (error) {
    console.error(error);
  }
};

exports.bingoStatusUpdate = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
exports.bingoStatusReset = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    const bingo = await resetBingo(userInfo._id);
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

// ================ 쿠폰 관련 API ====================
exports.getCouponList = async (req, res) => {
  try {
    const username = req.params.id;
    const userInfo = await User.findOne({ username });
    const couponList = await Coupon.populate("owner").findById({
      _id: userInfo._id,
    });
    console.log(couponList);
    res.status(200).json({ couponList });
  } catch (error) {
    console.error(error);
  }
};
exports.issuanceCoupon = async (req, res) => {
  try {
    const username = req.params.id;
    const { date, type } = req.body;
    const serialNum = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    const userInfo = await User.findOne({ username });
    const coupon = await Coupon.create({
      owner: userInfo._id,
      date,
      type,
      serialNum,
      status: "inactive",
      activeDate: null,
    });
    console.log("coupon create test", coupon);
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

// async function checkAndExpireCoupons() {
//   try {
//     const now = new Date();
//     const activeCoupons = await Coupon.find({ status: "active" });
//     for (let coupon of activeCoupons) {
//       const expirationDate = new Date(coupon.activeDate);
//       expirationDate.setDate(expirationDate.getDate() + coupon.date);
//       if (now > expirationDate) {
//         coupon.status = "expired";
//         await coupon.save();
//         console.log(`Coupon ${coupon.serialNum} has expired.`);
//       }
//     }
//   } catch (error) {
//     console.error("Error checking and expiring coupons:", error);
//   }
// }
// cron.schedule("0 0 * * *", () => {
//   console.log("Running daily coupon expiration check");
//   checkAndExpireCoupons();
// });
