const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  // mission: {
  //   type: Object,
  //   required: true,
  // },
  postCount: {
    type: Number,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  missionClear: {
    type: Number,
    required: true,
  },
  bingoCount: {
    type: Number,
    required: true,
  },
  continuousConnection: {
    type: Number,
    required: true,
  },
  /**
   * post와 review를 작성할 경우 그 Id에 해당하는 mission 컬렉션에 post, review Count 값을 +1 한다.
   *
   * postCount : {
   *  type: Int32,
   *  required : true
   * }
   * reviewCount : {
   *  type: Int32,
   *  required : true
   * }
   * missionClear : {
   *  type: Int32,
   *  required : true
   * }
   * bingoCount : {
   *  type: Int32,
   *  required:true
   * }
   * continuousConnection : {
   *   type : Int32,
   *  required : true
   * }
   *
   */
});
const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
