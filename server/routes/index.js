const userRouter = require("./user");
const { notFound, errHandler } = require("../middlewares/errorHandler");
const initRouter = (app) => {
    app.use("/api/users", userRouter);
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRouter;






