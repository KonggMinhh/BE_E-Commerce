const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
    "/create",
    [verifyAccessToken, isAdmin],
    productController.createProduct
);
router.get("/", productController.getProducts);
router.put("/ratings", verifyAccessToken, productController.ratings);

router.put(
    "/update/:pid",
    [verifyAccessToken, isAdmin],
    productController.updateProduct
);
router.delete(
    "/delete/:pid",
    [verifyAccessToken, isAdmin],
    productController.deleteProduct
);
router.get("/:pid", productController.getProduct);
module.exports = router;
