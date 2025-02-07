const router = require("express").Router();
const orderController = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, orderController.createOrder);
router.put(
    "/status/:oid",
    verifyAccessToken,
    isAdmin,
    orderController.updateStatusOrder
);
router.get("/", verifyAccessToken, orderController.getUserOrder);
router.get("/admin", verifyAccessToken, isAdmin, orderController.getUserOrder);

module.exports = router;
