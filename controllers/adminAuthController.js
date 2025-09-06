// adminAuthController.js
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/create.token");
const appError = require("../utils/appError");
const sendEmail = require("../utils/Email");
const validator = require("validator");

// ------------------ Signup ------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      passwordConfirm: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      admin: newAdmin,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ Login ------------------
exports.log_in = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Please provide email and password");

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(400).send("Admin not found");

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect)
      return res.status(400).send("Incorrect email or password");

    await createToken(admin, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Forgot Password ------------------
exports.forgotPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return next(new appError("No admin with that email address", 404));
    }

    const resetToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/admins/resetPassword/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Password Reset Request</h2>
        <p>Hi ${admin.name || "Admin"},</p>
        <p>You requested to reset your password. Click below to set a new password:</p>
        <p>
          <a href="${resetURL}" 
             style="display:inline-block; padding:10px 20px; background:#3498db; color:white; text-decoration:none; border-radius:5px;">
            Reset Password
          </a>
        </p>
        <p>If button doesn’t work, copy this link into your browser:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <br>
        <p>If you didn’t request a password reset, ignore this email.</p>
        <p style="font-size:12px; color:#999;">This link is valid for 10 minutes only.</p>
      </div>
    `;

    await sendEmail({
      email: admin.email,
      subject: "Your password reset token (valid for 10 min)",
      html,
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    if (admin) {
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;
      await admin.save({ validateBeforeSave: false });
    }
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
};

// ------------------ Reset Password ------------------
exports.resetPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!admin) {
      return next(new appError("Token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    admin.password = await bcrypt.hash(req.body.password, 12);
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    await createToken(admin, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Logout ------------------
exports.log_out = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
