const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../middlewares/jwt");
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
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser
                ? "Register is successfully. Please go login~"
                : "Something went wrong",
        });
    }
});
// Login
// Refresh token => Cap moi access token
// Access token => Dung de xac thuc nguoi dung
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
        // Tach password va role ra khoi object
        const { password, role, ...userData } = response.toObject();
        // Generate token
        const accessToken = generateAccessToken(response._id, role);
        // Generate refresh token
        const refreshToken = generateRefreshToken(response._id);
        // Save refresh token to database
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken },
            { new: true }
        );
        // Save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({
            success: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error("Invalid credentials !");
    }
});

// Get one user
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById({ _id }).select(
        "-refreshToken -password -role"
    );
    return res.status(200).json({
        success: false,
        rs: user ? user : "User not found",
    });
});

// Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lay token tu cookie
    const cookie = req.cookies;
    // Check xem co token hay khong
    if (!cookie && !cookie.refreshToken)
        throw new Error("No refresh token in cookie");
    // Check token co hop le hay khong
    jwt.verify(
        cookie.refreshToken,
        process.env.JWT_SECRET,
        async (err, decode) => {
            if (err) throw new Error("Invalid refresh token");
            // Check token co khop voi db da luu hay khong
            const response = await User.findOne({
                _id: decode._id,
                refreshToken: cookie.refreshToken,
            });
            return res.status(200).json({
                success: response ? true : false,
                newAccessToken: response
                    ? generateAccessToken(response._id, response.role)
                    : "Invalid refresh not matched",
            });
        }
    );
});
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
};
