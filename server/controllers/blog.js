const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");
// Create new blog
const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category)
        throw new Error("Please fill all fields");
    const response = await Blog.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : "Cannot create new blog",
    });
});
// Get all blogs
const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : "Cannot get blogs",
    });
});
// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0)
        throw new Error("Please fill all fields");
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : "Cannot update blog",
    });
});

// Like
// Dislike
/*
Khi người dùng like 1 bài blog thì:
1. Check xem người đó trước đó có dislike hay không ? -> bỏ dislike
2. Check xem người đó trước đó có like hay không ? -> bỏ like / thêm like
*/
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing inputs");
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    }
    const isLiked = blog?.likes?.find((el) => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    }
});

const disLikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing inputs");
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    }
    const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            res: response,
        });
    }
});

// Get a blog
const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!bid) throw new Error("Missing inputs");
    const blog = await Blog.findByIdAndUpdate(
        bid,
        { $inc: { numberViews: 1 } },
        { new: true }
    )
        .populate("likes", "firstname lastname")
        .populate("dislikes", "firstname lastname");
    return res.status(200).json({
        success: blog ? true : false,
        res: blog,
    });
});

// Delete blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: blog ? true : false,
        res: blog ? blog : "Cannot delete blog",
    });
});

// Upload Image Blog
const uploadImagesBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error("Missing inputs");
    const response = await Blog.findByIdAndUpdate(
        bid,
        { image: req.file.path },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        uploadedBlog: response ? response : "Cannot upload images Blog",
    });
});
module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    disLikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog,
};
