const router = require("express").Router();
const cartController = require("../controllers/cart");

router.get('/carts', cartController.carts);
module.exports = router;