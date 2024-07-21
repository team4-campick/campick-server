const Review = require("../models/Review");
const User = require("../models/User");
const Mission = require("../models/Mission");

const getReviews = async (req, res) => {
  try {
    const contentId = req.params.id;
    const reviews = await Review.find({ contentId }).populate("author");
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
  }
};
const createReview = async (req, res) => {
  try {
    // const username = req.params.id;
    const userObjId = req.params.id;
    const { score, review, contentId } = req.body;
    console.log(score, review, contentId);
    const user = await User.findById(userObjId);

    if (!user) {
      throw new Error("User not found");
    }
    const newReview = await Review.create({
      author: user._id,
      score,
      review,
      contentId,
    });
    const mission = await Mission.findByIdAndUpdate(
      { _id: user._id },
      { $inc: { reviewCount: 1 } }
    );

    res.status(200).json({ result: true, newReview });
  } catch (error) {
    res.status(403).json({ result: false });
  }
};
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete({ _id: reviewId });
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
  }
};
const editReview = async (req, res) => {
  try {
    const _id = req.params.id;
    const { score, review, contentId } = req.body;
    const editReview = await Review.findByIdAndUpdate(
      { _id },
      { score, review, contentId }
    );
    res.status(200).json(editReview);
  } catch (error) {
    res.status(403).send("Error");
  }
};
module.exports = {
  getReviews,
  createReview,
  deleteReview,
  editReview,
};
