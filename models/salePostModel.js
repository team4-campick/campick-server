const { Schema, model } = require("mongoose");

const salePostSchema = new Schema(
  {
    nickname: {
      type: String,
      // required: true,
      ref: "User",
    },
    category: {
      type: String,
      require: true,
    },
    isNegotiable: {
      type: Boolean,
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    condition: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    salesStatus: {
      type: String,
      enum: ["selling", "sold", "reserved"],
      default: "selling",
    },
  },
  {
    timestamps: true,
  }
);

const SalePost = model("SalePost", salePostSchema);

module.exports = SalePost;
