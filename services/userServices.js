const User = require('../models/User');
const hash = require('../utils/encrypt');

class UserService {
  async getUserData(userId) {
    const user = await User.findOne({ userId });
    console.log('func user', user);
    return user;
  }
  async deleteUser(username) {
    console.log('userId :', username);
    const test = await User.findOneAndDelete({ username });
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
  async updateUserData(username, nickname, password) {
    console.log('test', username, nickname, password);
    const hashedPassword = hash.encrypt(password);
    const user = await User.findOneAndUpdate(
      { username },
      { nickname, password: hashedPassword }
    );
    return user;
  }
  async passwordCheck(username, password) {
    console.log(
      'func username',
      typeof username,
      'func password',
      typeof password
    );
    const user = await User.findOne({ username });
    console.log('user.password : ', user.password);
    if (user.password === password) {
      return true;
    } else {
      throw new Error('Wrong username or password');
    }
  }
}
module.exports = new UserService();
