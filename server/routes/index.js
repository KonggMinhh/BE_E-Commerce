const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blog = require("./blog");
const brand = require("./brand");
const coupon = require("./coupon");
const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRouter = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/categories", productCategoryRouter);
    app.use("/api/blogCategory", blogCategoryRouter);
    app.use("/api/blog", blog);
    app.use("/api/brand", brand);
    app.use("/api/coupon", coupon);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRouter;
