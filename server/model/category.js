const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timeseries: true }
);
const CategoryModel = mongoose.model(
  "Categories",
  categorySchema,
  "categories"
);

module.exports = CategoryModel;
