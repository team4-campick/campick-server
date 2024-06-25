// controller/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const users = []; // 임시로 메모리에 사용자 데이터를 저장합니다.

// 회원가입 함수
const register = async (req, res) => {
  const { username, password, nickname } = req.body;

  // 사용자 유효성 검사
  if (!username || !password || !nickname) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  // 이미 존재하는 사용자 체크
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 새로운 사용자 추가
  const newUser = new User({ username, password: hashedPassword, nickname });
  await newUser.save();

  res.status(201).json({
    id: newUser._id,
    message: "회원가입이 성공적으로 완료되었습니다.",
  });
};

// 로그인 함수
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "nouser" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "failed" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    return res.json({ id: user._id, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login };
