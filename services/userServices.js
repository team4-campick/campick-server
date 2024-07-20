const Bingo = require("../models/Bingo");
const Mission = require("../models/Mission");
const Post = require("../models/Post");
const Review = require("../models/Review");
const User = require("../models/User");
const hash = require("../utils/encrypt");
const bcrypt = require("bcryptjs");

class UserService {
  async deleteUser(username) {
    console.log("userId :", username);
    const user = await User.findOneAndDelete({ username });
    await Bingo.findByIdAndDelete(user._id);
    await Mission.findByIdAndDelete(user._id);
    await Post.findByIdAndDelete(user._id);
    await Review.findByIdAndDelete(user._id);
    console.log("test", user);
    return { message: "User successfully deleted" };
  }
  async duplicateNickname(nickname) {
    console.log("func nickname", typeof nickname);
    const nicknameCheck = await User.findOne({ nickname });
    console.log("nicknameCheck", nicknameCheck);
    if (nicknameCheck) throw new Error("Nickname already exists");
    return { message: "Can use this nickname" };
  }
  async updateUserData(username, nickname, password) {
    console.log("test", username, nickname, password);
    const hashedPassword = hash.encrypt(password);
    const user = await User.findOneAndUpdate(
      { username },
      { nickname, password: hashedPassword },
      { new: true }
    );
    return user;
  }
  async passwordCheck(username, password) {
    const user = await User.findOne({ username });
    console.log("user.password", user.password);
    console.log("password", password);
    const validPassword = bcrypt.compareSync(password, user.password);
    console.log("validPassword : ", validPassword);
    if (validPassword) {
      return true;
    } else {
      throw new Error("Wrong username or password");
    }
  }
}
module.exports = new UserService();
