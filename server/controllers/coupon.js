const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

// Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry)
        throw new Error("Please fill all fields");
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000, // convert days to milliseconds
    });
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : "Cannot create coupon",
    });
});

// Get coupons
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).select("-createdAt -updatedAt");
    return res.status(200).json({
        success: coupons ? true : false,
        coupons: coupons ? coupons : "Cannot get coupons",
    });
});

// Update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0)
        throw new Error("Please fill all fields");
    if (req.body.expiry)
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000; // convert days to milliseconds
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : "Cannot update coupon",
    });
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : "Cannot delete coupon",
    });
});
module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
