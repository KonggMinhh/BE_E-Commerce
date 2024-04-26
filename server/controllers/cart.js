const CartModel = require("../model/cart");
const ProductModel = require("../model/product");

exports.carts = async (req, res)=>{
    const { fullName, address, email, phone, items, } = req.query;
    const totalPrice = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const cart = { fullName, address, email, phone, items, totalPrice };
  await CartModel(cart).save();
  const idsPrd = items.map((item) => item.prd_id);
  const products = await ProductModel.find({ _id: { $in: idsPrd } });
  let newItems = [];
  for (let product of products) {
    const cartItem = _.find(items, {
      prd_id: product._id.toString(),
    });
    if (cartItem) {
      cartItem.name = product.name;
      newItems.push(cartItem);
    }
}
    res.status(201).json({
    status: "success",
    message: "Thêm mới thành công Order",
  });
};