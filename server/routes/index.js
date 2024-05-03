const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRouter = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/categories", productCategoryRouter);
    app.use("/api/blog", blogCategoryRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRouter;
