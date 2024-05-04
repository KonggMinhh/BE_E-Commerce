const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

// Create brand 
const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        brand: response ? response : "Cannot create brand",
    });
});
// Get all brand 
const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : "Cannot get brand",
    });
});
// Update brand 
const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : "Cannot update brand ",
    });
});
// Delete brand 
const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : "Cannot delete brand ",
    });
});

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
};
