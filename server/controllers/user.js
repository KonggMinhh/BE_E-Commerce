const User = require("../model/user");
const asyncHandler = require("express-async-handler");
// Register
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            success: false,
            mes: "Missing inputs",
        });
    const user = await User.findOne({ email });
    if (user) throw new Error("User has existed");
    else {
        const newUser = await User.create(req.body);
        ß;
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser
                ? "Register is successfully. Please go login~"
                : "Something went wrong",
        });
    }
});
// Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: "Missing inputs",
        });
    // Plain object
    const response = await User.findOne({ email });
    if (response && (await response.isCorrectPassword(password))) {
        const { password, role, ...userData } = response.toObject();
        return res.status(200).json({
            success: true,
            userData,
        });
    } else {
        throw new Error("Invalid credentials !");
    }
});
module.exports = {
    register,
    login,
};
