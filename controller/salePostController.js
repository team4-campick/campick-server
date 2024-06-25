const fs = require('fs');
const SalePost = require('../models/salePostModel.js');
const { cloudinaryUpload } = require('../utils/fileUpload.js');

const getSalePosts = async (req, res) => {
  if (req.query.category) {
    const { category } = req.query;
    try {
      const salePosts = await SalePost.find({ category });
      if (salePosts.length === 0) {
        return res
          .status(404)
          .json({ result: false, message: '게시물이 존재하지 않습니다.' });
      }
      return res.status(200).json({ result: true, salePosts });
    } catch (error) {
      return res.status(500).json({
        result: false,
        message: '잠시후 다시 시도해주세요.',
      });
    }
  }

  try {
    const salePosts = await SalePost.find({});
    return res.status(200).json({ result: true, salePosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: '게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.',
    });
  }
};

const getSalePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const salePost = await SalePost.findById(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: '게시물이 존재하지 않습니다.' });
    }

    return res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: '게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.',
    });
  }
};

const createSalePost = async (req, res) => {
  const imageUrls = [];
  for (const file of req.files) {
    const imageUrl = await cloudinaryUpload(file);
    imageUrls.push({ url: imageUrl });
    // uploads/images 폴더에 임시로 저장된 이미지 파일 삭제
    fs.unlinkSync(file.path);
  }

  const newPost = JSON.parse(req.body.newPost);

  // if (!category || !region || !city || !price || !desc || !productName) {
  //   return res
  //     .status(400)
  //     .json({ result: false, message: '필수항목을 입력해주세요.' });
  // }

  try {
    const salePost = new SalePost({
      ...newPost,
      city: newPost.city ?? '-',
      imageUrls: [...imageUrls],
      salesStatus: 'selling',
    });

    await salePost.save();
    return res.status(201).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: '게시물 생성에 실패했습니다. 잠시후 다시 시도해주세요.',
    });
  }
};

const updateSalePost = async (req, res) => {
  const { id } = req.params;
  const {
    category,
    productName,
    region,
    city,
    price,
    desc,
    condition,
    isNegotiable,
  } = req.body;
  console.log(req.body);

  try {
    const salePost = await SalePost.findById(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: '게시물이 존재하지 않습니다.' });
    }

    salePost.category = category;
    salePost.price = price;
    salePost.desc = desc;
    salePost.productName = productName;
    salePost.region = region;
    salePost.city = city;
    salePost.condition = condition;
    salePost.isNegotiable = isNegotiable;

    await salePost.save();
    return res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: '게시물 수정에 실패했습니다. 잠시후 다시 시도해주세요.',
    });
  }
};

const deleteSalePost = async (req, res) => {
  const { id } = req.params;

  try {
    const salePost = await SalePost.findById(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: '게시물이 존재하지 않습니다.' });
    }

    await SalePost.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ result: true, message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: '게시물 삭제에 실패했습니다. 잠시후 다시 시도해주세요.',
    });
  }
};

module.exports = {
  getSalePosts,
  getSalePostById,
  createSalePost,
  updateSalePost,
  deleteSalePost,
};
