const User = require('../models/User');
const Mission = require('../models/Mission');
const Review = require('../models/Review');
const Post = require('../models/Post');
const Bingo = require('../models/Bingo');
const { default: bingoRule } = require('../utils/bingoRule');
const { missionClearCounter } = require('../utils/missionClearCounter');

class BingoService {
  async getMissionStatus(_id) {
    const mission = await Mission.findOne({ _id });
    return mission;
  }
  async updateMissionStatus(_id, mission) {
    console.log('mission check : ', mission);
    const updatedMission = await Mission.findOneAndUpdate({ _id }, { mission });
    return updatedMission;
  }
  // ================== mission variable status handling =================== //
  async getReviewCount(_id) {
    const review = await Review.findOne({ _id });
    const reviewCount = review ? review.length : 0;
    return reviewCount;
  }
  async getPostCount(_id) {
    const post = await Post.findOne({ _id });
    const postCount = post ? post.length : 0;
    return postCount;
  }
  async getMissionClear(_id) {
    const bingo = await Bingo.findOne({ _id });
    const count = missionClearCounter(bingo);
    return count;
  }
  async getBingoCount(_id) {
    const bingo = await Bingo.findOne({ _id });
    const count = bingoRule(bingo);
    return count;
  }
  async getContinuousConnection(_id) {
    const user = await User.findOne({ _id });
    // console.log('user : ', user);
    return user;
  }
  // ====================== mission variable status handling ===================
}
module.exports = new BingoService();
