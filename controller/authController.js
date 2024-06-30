// controller/authController.js
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("../models/User");
const Mission = require("../models/Mission");
const Bingo = require("../models/Bingo");

const { shuffle } = require("../utils/shuffle");
const { encrypt } = require("../utils/encrypt");

const { BINGO_AREA } = require("../constants/bingoArea");

const users = []; // 임시로 메모리에 사용자 데이터를 저장합니다.

app.use(cookieParser());

// 회원가입 함수
const register = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    console.log("before create", { username, password, nickname });
    console.log("BINGO_AREA", BINGO_AREA);
    shuffle(BINGO_AREA);

    if (!username || !password || !nickname) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = encrypt(password);
    const tr = await User.create({
      username,
      password: hashedPassword,
      nickname,
    });
    const bg = await Bingo.create({
      _id: tr._id,
      bingo: BINGO_AREA,
    });
    const ms = await Mission.create({
      _id: tr._id,
      postCount: 0,
      reviewCount: 0,
      missionClear: 0,
      bingoCount: 0,
      continuousConnection: 1,
    });
    res.status(200).json({ message: "User created", user: tr });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 로그인 함수
const login = async (req, res) => {
  const { username, password, loginDate } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "nouser" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
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
