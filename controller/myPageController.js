const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

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

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    !deletedUser
      ? res.status(404).json({ message: 'User not found' })
      : res.json({ message: 'User deleted' });
    // if (!deletedUser) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
    // res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
  }
};

exports.duplicateCheck = async (req, res) => {
  try {
    const { nickname } = req.body;
    console.log('nickname이 들어왔다 이놈아', nickname);
    const nicknameDoc = await User.findOne({ nickname });
    console.log('nicknameDoc', nicknameDoc);
    if (!nicknameDoc) {
      return res.status(200).json({ message: 'Nickname is available' });
    }
    res.status(409).json({ message: 'Nickname already exists' });
  } catch (error) {
    console.error(error);
  }
};

exports.bingoStatusCheck = async (req, res) => {
  try {
    /**
     * 마이페이지에서 빙고 탭에 접속하면 빙고의 상태를 불러오는 부분
     * 이곳에서 해야하는 기능
     * 1. 빙고 칸 clear 여부 체크
     * 2. 빙고 갯수만큼 해당 영역
     * index ex)
     * 0,1,2 -> 1bingo
     * 3,4,5 -> 2bingo
     * 6,7,8 -> 3bingo
     * 0,4,8 -> 4bingo
     * 2,4,6 -> 5bingo
     * 0,3,6 -> 6bingo
     * 1,4,7 -> 7bingo
     * 2,5,8 -> 8bingo
     *
     */
    const { mission } = req.body;
    const missionDoc = await Bingo;
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
