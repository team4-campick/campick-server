const User = require("../models/User");
class UserService {
  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    await User.findByIdAndDelete(userId);
    return { message: "User successfully deleted" };
  }
  async duplicateNickname(nickname) {
    console.log("func nickname", typeof nickname);
    const nicknameCheck = await User.findOne({ nickname });
    console.log("nicknameDoc", nicknameCheck);
    if (nicknameCheck) throw new Error("Nickname already exists");
    return { message: "Can use this nickname" };
  }
}
module.exports = new UserService();
