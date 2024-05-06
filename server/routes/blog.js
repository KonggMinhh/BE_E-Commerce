const router = require("express").Router();
const blogController = require("../controllers/blog");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", blogController.getBlogs);
router.get("/:bid", blogController.getBlog);
router.post("/", [verifyAccessToken, isAdmin], blogController.createNewBlog);
router.put("/like/:bid", verifyAccessToken, blogController.likeBlog);
router.put(
    "/uploadimage/:bid",
    [verifyAccessToken, isAdmin],
    uploader.single("image"),
    blogController.uploadImagesBlog
);
router.put("/dislike/:bid", verifyAccessToken, blogController.disLikeBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], blogController.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], blogController.deleteBlog);

module.exports = router;
