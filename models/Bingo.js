const mongoose = require('mongoose');

const bingoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mission: {
    type: Array,
    required: true,
  },
  // loginDate: {
  //   type: Object,
  //   required: true,
  // },
  // time form "2011-10-05T14:48:00.000Z"
});
const Bingo = mongoose.model('Bingo', bingoSchema);

module.exports = Bingo;
