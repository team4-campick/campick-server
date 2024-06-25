const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: Array,
    required: true,
    maxlength: 200,
  },
});
reviewSchema.set('timestamps', true);
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
