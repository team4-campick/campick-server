// authController.js

const users = []; // 임시로 메모리에 사용자 데이터를 저장합니다.

const register = (req, res) => {
  const { username, password, nickname } = req.body;

  // 예시: 사용자 유효성 검사
  if (!username || !password || !nickname) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  // 예시: 이미 존재하는 사용자 체크
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
  }

  // 새로운 사용자 추가
  const newUser = { id: users.length + 1, username, password, nickname };
  users.push(newUser);

  res
    .status(201)
    .json({ id: newUser.id, message: "회원가입이 성공적으로 완료되었습니다." });
};

module.exports = { register };
