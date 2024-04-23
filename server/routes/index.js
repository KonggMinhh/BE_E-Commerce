const userRouter = require("./user");
const initRouter = (app) => {
    app.use("/api/users", userRouter);
};
module.exports = initRouter;