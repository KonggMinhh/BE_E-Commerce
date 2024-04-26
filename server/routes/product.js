const router = require("express").Router();
const productController = require("../controllers/product");

router.get("/products", productController.index);
router.post("/products", productController.storeProduct);
router.get("/products/:id", productController.show);
module.exports = router;