const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

// Create product category
const createProductCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        productCategory: response ? response : "Cannot create product category",
    });
});
// Get all product categories
const getProductCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find().select("title _id");
    return res.status(200).json({
        success: response ? true : false,
        productCategories: response
            ? response
            : "Cannot get product categories",
    });
});
// Update product category
const updateProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : "Cannot update product category",
    });
});
// Delete product category
const deleteProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : "Cannot delete product category",
    });
});

module.exports = {
    createProductCategory,
    getProductCategories,
    updateProductCategory,
    deleteProductCategory,
};
