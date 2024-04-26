const router = require("express").Router();
const category = require("../controllers/category");
router.get("/categories", category.index);
router.post("/categories", category.storeCategory);
router.get("/categories/:id", category.show);
router.get("/categories/:id/products", category.products);
module.exports = router;
