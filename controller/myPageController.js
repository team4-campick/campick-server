const Inquiry = require('../models/Inquiry');
const UserServices = require('../services/userServices');

exports.updateInquiry = async (req, res) => {
  try {
    const { title, email, content } = req.body;
    const inquiryDoc = await Inquiry.create({ title, email, content });
    console.log('inquiryDoc', inquiryDoc);
    res.status(200).json(userDoc);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const username = req.params.id;
    const { nickname, password } = req.body;
    console.log('test', username);
    console.log(nickname, password);
    const userDoc = await UserServices.updateUserData(
      username,
      nickname,
      password
    );
    console.log('userDoc', userDoc);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
};
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDoc = await UserServices.getUserData(userId);
    console.log('userId', userId);
    console.log('userDoc', userDoc);
    res.status(200).json({ success: true, userDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('test', userId);
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
    console.log(username, password);
    const userDoc = await UserServices.passwordCheck(username, password);
    console.log('userDoc222', userDoc);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.bingoStatusCheck = async (req, res) => {
  try {
    const userId = req.params.id;
    const bingo = await Bingo.findOne({ userId });
  } catch (error) {
    console.error(error);
  }
};
exports.bingoStatusUpdate = async (req, res) => {
  try {
    /**
     * 미션 달성되면 해당 미션의 빙고칸을 달성 혹은 clear 등으로 상태를 업데이트 하자.
     */
  } catch (error) {
    console.error(error);
  }
};
exports.bingoStatusReset = async (req, res) => {
  try {
    /**
     * 9칸이 다 찼을 경우 빙고판을 리셋 => 클라이언트 단에서 버튼 하나 만들어서
     * 빙고가 완성되었습니다. 게임을 다시 하려면 버튼을 클릭해주세요 를 해두고 클릭시
     * 초기화 하는 방식으로 진해할 예정
     * */
  } catch (error) {
    console.error(error);
  }
};
