const User = require('../models/User');
const Mission = require('../models/Mission');
const Review = require('../models/Review');
const Post = require('../models/Post');
const Bingo = require('../models/Bingo');

const { shuffle } = require('../utils/shuffle');
const { bingoRule } = require('../utils/bingoRule');
const { missionClearCounter } = require('../utils/missionClearCounter');
const { consecutiveVisitDays } = require('../utils/consecutiveVisitDays');

const { BINGO_AREA } = require('../constants/bingoArea');

class BingoService {
  // async getMissionStatus(_id) {
  //   const mission = await Mission.findOne({ _id });
  //   return mission;
  // }
  // async updateMissionStatus(_id, mission) {
  //   console.log('mission check : ', mission);
  //   const updatedMission = await Mission.findOneAndUpdate({ _id }, { mission });
  //   return updatedMission;
  // }
  async getReviewCount(_id) {
    const review = (await Review.findOne({ _id }))
      ? await Review.findOne({ _id })
      : null;
    console.log('리뷰 카운터', _id); //
    console.log('리뷰 카운터 리뷰 리스트', review);
    if (review) {
      const reviewCount = review.review ? review.review.length : 0;
      console.log('리뷰 갯수', reviewCount);
      return reviewCount;
    } else {
      return 0;
    }
  }
  async getPostCount(_id) {
    const post = (await Post.findOne({ _id }))
      ? await Post.findOne({ _id })
      : null;
    const postCount = post ? post.length : 0;
    return postCount;
  }
  async getMissionClear(_id) {
    const bingo = await Bingo.findOne({ _id });
    const count = missionClearCounter(bingo);
    console.log('클리어한 미션 :', count);
    return count;
  }
  async getBingoCount(_id) {
    const getBingo = await Bingo.findOne({ _id });
    const count = bingoRule(getBingo.bingo).count;
    return count;
  }
  async getBingoPattern(_id) {
    const getBingo = await Bingo.findById({ _id });
    const pattern = bingoRule(getBingo.bingo).bingoPattern;
    console.log('bingo pattern', pattern);
    return pattern;
  }
  async getContinuousConnection(_id) {
    const user = await User.findOne({ _id });
    const loginDate = user ? user.loginDate : null;
    const count = loginDate ? consecutiveVisitDays(loginDate) : 1;
    return count;
  }
  async updateMissionList(_id, newMission) {
    const user = await User.findOne({ _id });
    const updatedMission = await Mission.findOneAndUpdate(
      { _id: user._id },
      { mission: newMission },
      { new: true }
    );
    return updatedMission;
  }
  async resetBingo(_id) {
    const user = await User.findOne({ _id });
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { bingo: shuffle(BINGO_AREA) }
    );
    return updatedUser;
  }
}
module.exports = new BingoService();
