// controller/authController.js
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("../models/User");

const users = []; // 임시로 메모리에 사용자 데이터를 저장합니다.

app.use(cookieParser());

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
  const { username, password, loginDate } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "nouser" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "failed" });
    }
    const token = jwt.sign({ username, id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    await User.findByIdAndUpdate(user, { $push: { loginDate } });

    // 쿠키 설정
    res
      .cookie("token", token, {
        httpOnly: true, // 클라이언트 측 자바스크립트에서 쿠키 접근을 방지
        secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 HTTPS를 통해서만 쿠키 전송
        maxAge: 3600000, // 쿠키 만료 시간 (1시간)
      })
      .json({
        id: user._id,
        username,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const logout = (req, res) => {
  res.cookie("token", "").json();
};
const profile = async (req, res) => {
  const { token } = req.cookies;
  console.log("profile 탐색");
  if (!token) {
    res.json("토큰정보가 없어요");
    return;
  }
  try {
    jwt.verify(token, "your_jwt_secret", {}, (err, info) => {
      if (err) throw err;
      console.log("info:", info);
      res.json(info);
    });
  } catch (error) {
    res.json("유효하지 않는 토큰 정보입니다.");
  }
};
module.exports = { register, login, logout, profile };
