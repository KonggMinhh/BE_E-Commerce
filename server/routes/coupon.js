const router = require("express").Router();
const couponController = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], couponController.createCoupon);
router.put(
    "/:cid",
    [verifyAccessToken, isAdmin],
    couponController.updateCoupon
);
router.delete(
    "/:cid",
    [verifyAccessToken, isAdmin],
    couponController.deleteCoupon
);
router.get("/", couponController.getCoupons);

module.exports = router;
