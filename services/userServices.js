const User = require('../models/User');
class UserService {
  async getUser(userId) {
    const user = await User.findOne({ userId });
    console.log('func user', user);
    return user;
  }
  async deleteUser(userId) {
    console.log('userId :', userId);
    const test = await User.findOne(userId);
    console.log('test', test);
    return { message: 'User successfully deleted' };
  }
  async duplicateNickname(nickname) {
    console.log('func nickname', typeof nickname);
    const nicknameCheck = await User.findOne({ nickname });
    console.log('nicknameCheck', nicknameCheck);
    if (nicknameCheck) throw new Error('Nickname already exists');
    return { message: 'Can use this nickname' };
  }
}
module.exports = new UserService();
