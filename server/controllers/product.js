const pagination = require("../libs/pagination");
const ProductModel = require("../model/product");
exports.index = async (req, res) => {
  const query = {};
  //   phantrang
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = page * limit - limit;
  //   timkiem
  if (req.query.name) {
    query.$text = { $search: req.query.name };
  }
  const products = await ProductModel.find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    filters: {
      page,
      limit,
    },
    data: {
      docs: products,
      pages: await pagination(ProductModel, query, page, limit),
    },
  });
};
exports.show = async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  res.status(200).json({
    status: "Success",
    data: product,
  });
};
exports.storeProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category_id,
    image,
    status,
    price,
    accessories,
    promotion,
    details,
  } = req.body;
  const product = {
    name,
    category_id,
    image,
    status,
    price,
    accessories,
    promotion,
    details,
  };
  await ProductModel(product).save();
  res.status(200).json({
    status: "success",
    message: "Thêm mới san pham thành công!",
  });
};
