const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    maxlength: 200,
  },
});
reviewSchema.set('timestamps', true);
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
