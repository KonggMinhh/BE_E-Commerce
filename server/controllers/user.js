const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sendEmail = require("../ultils/sendMail");
const crypto = require("crypto");
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
        const { password, role, refreshToken, ...userData } =
            response.toObject();
        // Generate token
        const accessToken = generateAccessToken(response._id, role);
        // Generate refresh token
        const newRefreshToken = generateRefreshToken(response._id);
        // Save refresh token to database
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken: newRefreshToken },
            { new: true }
        );
        // Save refresh token to cookie
        res.cookie("refreshToken", newRefreshToken, {
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

// Get one user current
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById({ _id }).select(
        "-refreshToken -password -role"
    );
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : "User not found",
    });
});

// Get all user
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-refreshToken -password -role");
    return res.status(200).json({
        success: users ? true : false,
        users: users,
    });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if (!_id) throw new Error("Missing inputs !");
    const response = await User.findByIdAndDelete({ _id });
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response
            ? `User with email ${response.email} has been deleted`
            : "No user delete",
    });
});

// Update user no admin
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id || Object.keys(req.body).length === 0)
        throw new Error("Missing inputs !");
    const response = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    }).select("-password -role");
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response
            ? response
            : "Some thing went wrong ! Please try again later",
    });
});

// Update User by Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs !");
    const response = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select("-password -role -refreshToken");
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response
            ? response
            : "Some thing went wrong ! Please try again later",
    });
});
// Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies;
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken)
        throw new Error("No refresh token in cookies");
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({
        _id: rs._id,
        refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : "Refresh token not matched",
    });
});

// Log out phia server
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken)
        throw new Error("No refresh token in cookies");
    // Xoa refreshToken trong database
    await User.findOneAndUpdate(
        { resfreshToken: cookie.refreshToken },
        { refreshToken: "" },
        { new: true }
    );
    // Xoa refreshToken trong cookies
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        success: true,
        mes: "Logout successfully",
    });
});

// Reset Password
// Client gui mail
// Server check mail co hop le hay khong => Neu hop le => Gui mail chua link reset password
// Client gui api kem theo token
//  Check token co giong voi token ma server gui hay khong
//  Neu giong => Cho phep reset password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error("Missing mail !");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken();
    await user.save();
    const html = `<div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; font-family: Arial, sans-serif;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h2 style="margin-bottom: 20px; text-align: center; color: #333333;">Thay Đổi Mật Khẩu</h2>
            <p style="font-size: 16px; color: #666666; line-height: 1.6;">Xin chào,</p>
            <p style="font-size: 16px; color: #666666; line-height: 1.6;">Bạn đã yêu cầu thay đổi mật khẩu của mình. Hãy nhấp vào nút dưới đây để tiếp tục quá trình đặt lại mật khẩu:</p>
            <p style="text-align: center; margin-top: 30px;"><a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Đặt Lại Mật Khẩu</a></p>
            <p style="font-size: 16px; color: #666666; line-height: 1.6;">Link này sẽ hết hạn sau 15 phút kể từ bây giờ.</p>
            <p style="font-size: 16px; color: #666666; line-height: 1.6;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999999;">
            <p style="font-size: 14px;">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>`;
    const data = {
        email,
        html,
    };
    const rs = await sendEmail(data);
    return res.status(200).json({
        success: true,
        rs,
    });
});
// Reset password changed
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error("Missing inputs");
    const passwordResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid reset token !");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mess: user ? "Update password !" : "Something went wrong !",
    });
});

// Update User Address

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error("Missing inputs !");
    const response = await User.findByIdAndUpdate(
        _id,
        { $push: { address: req.body.address } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response
            ? response
            : "Some thing went wrong ! Please try again later",
    });
});
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
};
