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
    // 리뷰 카운트 업데이트 -> 이렇게 하면 리셋 했을때 문제 해결!
    // const mission = await Mission.findById(_id);
    // const count = mission.reviewCount.length;
    // return count;
    const review = (await Review.findById(_id))
      ? await Review.findById(_id)
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
    // 리뷰 카운트 업데이트 -> 이렇게 하면 리셋 했을때 문제 해결!
    // const mission = await Mission.findById(_id);
    // const count = mission.postCount.length;
    // return count;
    const post = (await Post.findById(_id)) ? await Post.findById(_id) : null;
    const postCount = post ? post.length : 0;
    return postCount;
  }
  async getMissionClear(_id) {
    const bingo = await Bingo.findById(_id);
    console.log('과연?', bingo);
    const count = missionClearCounter(bingo.bingo);
    console.log('클리어한 미션 :', count);
    return count;
  }
  async getBingoCount(_id) {
    const getBingo = await Bingo.findById(_id);
    const count = bingoRule(getBingo.bingo).count;
    return count;
  }
  async getContinuousConnection(_id) {
    const user = await User.findOne({ _id });
    const loginDate = user ? user.loginDate : null;
    const count = loginDate ? consecutiveVisitDays(loginDate) : 1;
    return count;
  }
  async getBingoPattern(_id) {
    const getBingo = await Bingo.findById(_id);
    const pattern = bingoRule(getBingo.bingo).bingoPattern;
    console.log('bingo pattern', pattern);
    return pattern;
  }
  // async updateBingoMission(_id, newMission) {
  //   const updatedMission = await Mission.findByIdAndUpdate(
  //     _id,
  //     {
  //       postCount: newMission.postCount,
  //     },
  //     { new: true }
  //   );
  //   return updatedMission;
  // }
  async updateMissionList(_id, newMission) {
    console.log('newMissionList test===========', newMission);
    console.log(newMission.postCount);
    console.log('newMissionList test===========', newMission.reviewCount);
    console.log('newMissionList test===========', newMission.missionClear);
    console.log('newMissionList test===========', newMission.bingoCount);
    console.log(
      'newMissionList test===========',
      newMission.continuousConnection
    );
    const updatedMission = await Mission.findByIdAndUpdate(
      _id,
      {
        postCount: newMission.postCount,
        reviewCount: newMission.reviewCount,
        missionClear: newMission.missionClear,
        bingoCount: newMission.bingoCount,
        continuousConnection: newMission.continuousConnection,
      },
      { new: true }
    );
    return updatedMission;
  }
  async resetMission(_id) {
    const resetMission = await Mission.findByIdAndUpdate(_id, {
      postCount: 0,
      reviewCount: 0,
      missionClear: 0,
      bingoCount: 0,
      continuousConnection: 1,
    });
    // const resetMission = await Mission.findByIdAndUpdate(_id, {
    //   mission: [],
    // });
    return resetMission;
  }
  async resetBingo(_id) {
    const bingo = shuffle(BINGO_AREA);
    const resetBingo = await Bingo.findByIdAndUpdate(_id, {
      bingo,
    });
    return resetBingo;
  }
}
module.exports = new BingoService();
