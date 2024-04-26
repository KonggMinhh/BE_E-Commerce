const CategoryModel = require("../model/category");
const pagination = require("../libs/pagination");
const ProductModel = require("../model/product");
exports.index = async (req, res) => {
  const query = {};
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = page * limit - limit;
  const categories = await CategoryModel.find(query)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    filters: {
      page,
      limit,
    },
    data: {
      docs: categories,
      pages: await pagination(CategoryModel, query, limit, page),
    },
  });
};
exports.show = async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.find(id);
  res.status(200).json({
    status: "success",
    data: category,
  });
};
exports.storeCategory = async (req, res) => {
  const {name} = req.body;
  const category ={
    name: name,
  };
  await CategoryModel(category).save();
  res.status(200).json({
    status: "success",
    message: "Thêm mới danh muc thành công!",
  });
};
exports.products = async (req, res) => {
  const { id } = req.params;
  const query = {};
  query.category_id = id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = page * limit - limit;
  const product = await ProductModel.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip);
  res.status(200).json({
    status: "success",
    filter: {
      page,
      limit,
    },
    data: {
      docs: product,
      pages: await pagination(ProductModel, query, limit, page),
    },
  });
};
