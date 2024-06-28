const { BINGO_AREA } = require("../constants/bingoArea");
const User = require("../models/User");
const hash = require("../utils/encrypt");
const { shuffle } = require("../utils/shuffle");
const Mission = require("../models/Mission");
const Bingo = require("../models/Bingo");
const { MISSION } = require("../constants/mission");

exports.registerUser = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    console.log("before create", { username, password, nickname });
    console.log("BINGO_AREA", BINGO_AREA);
    shuffle(BINGO_AREA);
    // console.log('shuffledBingoArea', shuffledBingoArea);

    // 유효성 검사
    if (!username || !password || !nickname) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = hash.encrypt(password);
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
    console.log("user", tr);
    console.log("bingo", bg);
    console.log("mission", ms);

    res.status(200).json({ message: "User created", user: tr });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
