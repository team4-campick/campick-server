const User = require("../models/User");
const Mission = require("../models/Mission");
const Bingo = require("../models/Bingo");

const { shuffle } = require("../utils/shuffle");
const { bingoRule } = require("../utils/bingoRule");
const { missionClearCounter } = require("../utils/missionClearCounter");
const { consecutiveVisitDays } = require("../utils/consecutiveVisitDays");

const { BINGO_AREA } = require("../constants/bingoArea");

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
  async getUserBingo(id) {
    return await Bingo.findById(id);
  }
  async getMission(id) {
    const mission = await Mission.findById(id);
    console.log("미션을 받아와서 중복을 줄이기 시도 1", mission);
    return mission;
  }
  async getReviewCount(id) {
    const review = await Mission.findById(id);
    const count = review ? review.reviewCount : 0;
    return count;
  }
  async getPostCount(id) {
    const post = (await Mission.findById(id))
      ? await Mission.findById(id)
      : null;
    const count = post ? post.postCount : 0;
    return count;
  }
  async getMissionClear(id) {
    const getBingo = await Bingo.findById(id);
    const count = missionClearCounter(getBingo.bingo);
    return count;
  }
  async getBingoCount(id) {
    const getBingo = await Bingo.findById(id);
    const count = bingoRule(getBingo.bingo).count;
    return count;
  }
  async getContinuousConnection(id) {
    const user = await User.findById(id);
    const loginDate = user ? user.loginDate : null;
    const count = loginDate ? consecutiveVisitDays(loginDate) : 1;
    return count;
  }
  async getBingoPattern(id) {
    const getBingo = await Bingo.findById(id);
    const pattern = bingoRule(getBingo.bingo).bingoPattern;
    return pattern;
  }
  async updateBingo(id, updatedBingo) {
    return await Bingo.findByIdAndUpdate(id, { $set: updatedBingo });
  }
  async updateMissionList(_id, newMission) {
    const {
      postCount,
      reviewCount,
      missionClear,
      bingoCount,
      continuousConnection,
    } = newMission;
    const updatedMission = await Mission.findByIdAndUpdate(
      _id,
      {
        postCount,
        reviewCount,
        missionClear,
        bingoCount,
        continuousConnection,
      },
      { new: true }
    );
    // const updatedMission = await Mission.findByIdAndUpdate(
    //   _id,
    //   {
    //     postCount: newMission.postCount,
    //     reviewCount: newMission.reviewCount,
    //     missionClear: newMission.missionClear,
    //     bingoCount: newMission.bingoCount,
    //     continuousConnection: newMission.continuousConnection,
    //   },
    //   { new: true }
    // );
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
