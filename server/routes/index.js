const userRouter = require("./user");
const categoryRouter = require("./category");
const productRouter = require("./product");
const cartRouter = require("./cart");
const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRouter = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api", categoryRouter);
    app.use("/api", productRouter);
    app.use("/api", cartRouter);
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRouter;
