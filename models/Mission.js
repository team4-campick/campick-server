const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  mission: {
    type: Object,
    required: true,
  },
});
const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
