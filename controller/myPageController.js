const Inquiry = require("../models/Inquiry");
// const Post = require('../models/Post');
const User = require("../models/User");
// const Review = require('../models/Review');
const Bingo = require("../models/Bingo");
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
    // const username = req.params.id;
    const { title, email, content } = req.body;
    // const user = await User.findOne({username });
    // 어떤 사람이 작성한건지 구분하는 부분을 추가하면 좋을거 같은데 nickname 으로
    // 진행하면 닉네임 변경시 하나하나 다 반영해야하는 문제가 있음. 그부분을 어떻게 할까유..
    const inquiryDoc = await Inquiry.create({ title, email, content });
    res.status(200).json(userDoc);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const username = req.params.id;
    const { nickname, password } = req.body;
    console.log("test", username);
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
    const { password } = req.body;
    const userDoc = await UserServices.passwordCheck(username, password);
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
    const postCount = await getPostCount(userInfo._id);
    const missionClear = await getMissionClear(userInfo._id);
    const bingoCount = await getBingoCount(userInfo._id);
    const continuousConnection = await getContinuousConnection(userInfo._id);

    // 아래부분은 빙고 패턴 테스트를 위한 테스트 데이터임.
    // const postCount = 6;
    // const reviewCount = 10;
    // const missionClear = await getMissionClear(userInfo._id);
    // const bingoCount = await getBingoCount(userInfo._id);
    // const continuousConnection = 7;
    // const findValue = await Mission.findOne({ _id: userInfo._id });
    // const continuousConnection = findValue.mission.continuousConnection;

    const newMission = {
      postCount,
      // reviewCount,
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
