const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            success: false,
            mes: "Missing inputs",
        });
    const response = await User.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        mes: response
            ? "Register is successfully. Please go login~"
            : "Something went wrong",
    });

    // const user = await User.findOne({ email });
    // if (user) throw new Error("User has existed");
    // else {
    //     const newUser = await User.create(req.body);
    //     return res.status(200).json({
    //         sucess: newUser ? true : false,
    //         mes: newUser
    //             ? "Register is successfully. Please go login~"
    //             : "Something went wrong",
    //     });
    // }
});
module.exports = {
    register,
};
