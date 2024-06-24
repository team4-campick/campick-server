const User = require('../models/User');
const hash = require('../utils/encrypt');
exports.registerUser = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    console.log('before create', { username, password, nickname });

    // 유효성 검사
    if (!username || !password || !nickname) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = hash.encrypt(password);
    const tr = await User.create({
      username,
      password: hashedPassword,
      nickname,
    });
    console.log('user', tr);

    res.status(200).json({ message: 'User created', user: tr });
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
