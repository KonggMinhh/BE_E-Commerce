const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
// Create product
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : "Cannot create new product",
    });
});
// Get a product
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error("Missing inputs");
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : "Product not found",
    });
});
// Get all product fillter, sorting, pagination
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: products ? true : false,
        productsData: products ? products : "No product found",
    });
});
// Update product
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct
            ? updatedProduct
            : "Cannot update product",
    });
});
// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error("Missing inputs");
    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct
            ? deletedProduct
            : "Cannot delete product",
    });
});
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
};
