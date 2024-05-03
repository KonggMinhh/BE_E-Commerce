const router = require("express").Router();
const productCategoryController = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
    "/",
    verifyAccessToken,
    isAdmin,
    productCategoryController.createProductCategory
);
router.get(
    "/",
    productCategoryController.getProductCategories
);
router.put(
    "/:bcid",
    verifyAccessToken,
    isAdmin,
    productCategoryController.updateProductCategory
);
router.delete(
    "/:bcid",
    verifyAccessToken,
    isAdmin,
    productCategoryController.deleteProductCategory
);

module.exports = router;
