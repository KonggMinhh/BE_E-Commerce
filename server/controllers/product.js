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
// Get all product filter, sorting, pagination
const getProducts = asyncHandler(async (req, res) => {
    // 2 du lieu deu tro ve 1 o du lieu
    // tao 2 bang o 2 vung nho khac nhau
    // queries la bang du lieu cua client gui len
    // req.query la bang du lieu cua server
    const queries = { ...req.query };
    // Tach cac truong dac biet ra khoi query
    // Toi uu hoa toc do truy van
    const excludedFields = ["limit", "page", "sort", "fields"];
    // Loai bo cac truong dac biet ra khoi queries ma van bao toan du lieu goc
    excludedFields.forEach((el) => delete queries[el]);

    // Format lai dinh dang cho dung mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Filter
    if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };
    // Trang thai dang pending
    let queryCommand = Product.find(formattedQueries);
    // Sort
    // abc, cde => [abc, cde] => abc cde
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }

    // Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    }
    // Pagination
    // Limit: so luong object sp tra ve trong 1 lan trong API
    // Skip: bo qua bao nhieu object sp
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute query
    // So luong sp thoa man dieu kien !== so luong sp tra ve trong 1 lan trong API
    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err);
    //     // Tra so luong sp thoa man dieu kien
    //     const counts = await Product.find(formattedQueries).countDocuments();
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         products: response ? response : "No product found",
    //         counts,
    //     });
    // });
    try {
        // Thực hiện truy vấn và chờ kết quả
        const response = await queryCommand.exec();

        // Tra so luong sp thoa man dieu kien
        const counts = await Product.find(formattedQueries).countDocuments();

        // Trả về phản hồi
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : "No product found",
            counts,
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({ success: false, error: error.message });
    }
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

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;

    if (!pid || !star) {
        return res.status(400).json({ status: false, error: "Missing inputs" });
    }

    let updatedProduct;

    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    );

    if (alreadyRating) {
        // Nếu người dùng đã đánh giá sản phẩm, cập nhật lại đánh giá
        await Product.updateOne(
            { "ratings.postedBy": _id },
            {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                },
            }
        );
    } else {
        // Nếu người dùng chưa đánh giá sản phẩm, thêm mới đánh giá
        await Product.findByIdAndUpdate(
            pid,
            {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: _id,
                    },
                },
            }
        );
    }

    // Tính toán lại tổng số điểm đánh giá trung bình của sản phẩm đã được cập nhật
    updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce(
        (sum, item) => sum + +item.star,
        0
    );
    updatedProduct.totalRatings = Math.round((sumRatings / ratingCount) * 10) / 10;
    await updatedProduct.save();

    // Trả về phản hồi thành công cùng với sản phẩm đã được cập nhật
    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
};
