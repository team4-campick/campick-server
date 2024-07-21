const Bingo = require("../models/Bingo");
const Mission = require("../models/Mission");
const Post = require("../models/Post");
const Review = require("../models/Review");
const User = require("../models/User");
const { encrypt } = require("../utils/encrypt");
const { compareSync } = require("bcryptjs");

class UserService {
  async deleteUser(userObjId) {
    try {
      await User.findByIdAndDelete(userObjId);
      await Bingo.findByIdAndDelete(userObjId);
      await Mission.findByIdAndDelete(userObjId);
      await Post.findByIdAndDelete(userObjId);
      await Review.findByIdAndDelete(userObjId);
      return { result: true, message: "User successfully deleted" };
    } catch (error) {
      console.error(error);
    }
  }
  async duplicateNickname(nickname) {
    console.log("func nickname", typeof nickname);
    const nicknameCheck = await User.findOne({ nickname });
    console.log("nicknameCheck", nicknameCheck);
    if (nicknameCheck) throw new Error("Nickname already exists");
    return { message: "Can use this nickname" };
  }
  async updateUserData(userObjId, nickname, password) {
    try {
      const hashedPassword = encrypt(password);
      await User.findByIdAndUpdate(
        userObjId,
        { nickname, password: hashedPassword },
        { new: true }
      );
      return { result: true };
    } catch (error) {}
  }
  async passwordCheck(id, password) {
    const user = await User.findById(id);
    console.log("user.password", user.password);
    console.log("password", password);
    const validPassword = compareSync(password, user.password);
    console.log("validPassword : ", validPassword);
    if (validPassword) {
      return true;
    } else {
      throw new Error("Wrong username or password");
    }
  }
}
module.exports = new UserService();
