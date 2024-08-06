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
    console.log("Received registration data:", {
      username,
      password,
      nickname,
    });

    // 필수 필드 검사
    if (!username || !password || !nickname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // 사용자 이름 형식 검사
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(username)) {
      return res.status(400).json({
        message:
          "Username must be at least 4 characters long and start with a letter",
      });
    }

    const hashedPassword = encrypt(password);
    const tr = await User.create({
      username,
      password: hashedPassword,
      nickname,
    });

    shuffle(BINGO_AREA);

    await Bingo.create({
      _id: tr._id,
      bingo: BINGO_AREA,
    });

    await Mission.create({
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
  console.log("Received login data:", { username, password, loginDate });

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "nouser" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "failed" });
    }

    const token = jwt.sign(
      { username, id: user._id, nickname: user.nickname },
      "your_jwt_secret",
      {
        expiresIn: "1h",
      }
    );

    await User.findByIdAndUpdate(user._id, { $push: { loginDate } });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "none",
      })
      .json({
        id: user._id,
        username,
        nickname: user.nickname,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  // res.cookie("token", "").json();
  res.clearCookie("token");
  res.status(200).json({ message: "로그아웃되었습니다." });
};

const profile = async (req, res) => {
  const { token } = req.cookies;
  console.log("Profile access attempt with token:", token);

  if (!token) {
    return res.json("토큰정보가 없어요");
  }

  try {
    jwt.verify(token, "your_jwt_secret", {}, (err, info) => {
      if (err) throw err;
      console.log("Token info:", info);
      res.json(info);
    });
  } catch (error) {
    console.error("Invalid token:", error);
    res.json("유효하지 않는 토큰 정보입니다.");
  }
};

module.exports = { register, login, logout, profile };
