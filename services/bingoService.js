const User = require("../models/User");
const Mission = require("../models/Mission");
const Bingo = require("../models/Bingo");

const { shuffle } = require("../utils/shuffle");
const { bingoRule } = require("../utils/bingoRule");
const { missionClearCounter } = require("../utils/missionClearCounter");
const { consecutiveVisitDays } = require("../utils/consecutiveVisitDays");

const { BINGO_AREA } = require("../constants/bingoArea");
const Coupon = require("../models/Coupon");

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
  async getReviewCount(id) {
    // 리뷰 카운트 업데이트 -> 이렇게 하면 리셋 했을때 문제 해결!
    // const mission = await Mission.findById(_id);
    // const count = mission.reviewCount.length;
    // return count;
    const review = await Mission.findById(id);
    const count = review ? review.reviewCount : 0;
    console.log("리뷰 갯수", count);
    return count;
  }
  async getPostCount(_id) {
    // 리뷰 카운트 업데이트 -> 이렇게 하면 리셋 했을때 문제 해결!
    // const mission = await Mission.findById(_id);
    // const count = mission.postCount.length;
    // return count;
    const post = (await Mission.findById(_id))
      ? await Mission.findById(_id)
      : null;
    const count = post ? post.postCount : 0;
    return count;
  }
  async getMissionClear(_id) {
    const bingo = await Bingo.findById(_id);
    console.log("과연?", bingo);
    const count = missionClearCounter(bingo.bingo);
    console.log("클리어한 미션 :", count);
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
    await User.findByIdAndUpdate({ _id }, { loginDate: [] });
    const resetMission = await Mission.findByIdAndUpdate(_id, {
      postCount: 0,
      reviewCount: 0,
      missionClear: 0,
      bingoCount: 0,
      continuousConnection: 1,
    });
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
