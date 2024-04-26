const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      text: true,
      required: true,
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "0",
      required: true,
    },
    accessories: {
      type: String,
      default: "",
    },
    promotion: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timeseries: true }
);
const ProductModel = mongoose.model("Products", productSchema, "products");

module.exports = ProductModel;
