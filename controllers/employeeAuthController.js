const Employee = require("../models/employeeModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/create.token");
const appError = require("../utils/appError");
const sendEmail = require("../utils/Email");
const validator = require("validator");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, salary, department } =
      req.body;

    // Validate input
    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirm ||
      !salary ||
      !department
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new Employee
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      salary,
      department,
    });

    await newEmployee.save();

    res.status(201).json({
      employee: newEmployee,
      message: "Employee created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.log_in = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Please provide email and password");

    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      return res.status(400).send("Employee not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, employee.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect email or password");
    }

    await createToken(employee, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });
    if (!employee) {
      return next(new appError("No employee with that email address", 404));
    }

    const resetToken = employee.createPasswordResetToken();
    await employee.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/employees/resetPassword/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Password Reset Request</h2>
        <p>Hi ${employee.name || "Employee"},</p>
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
      email: employee.email,
      subject: "Your password reset token (valid for 10 min)",
      html,
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    if (employee) {
      employee.passwordResetToken = undefined;
      employee.passwordResetExpires = undefined;
      await employee.save({ validateBeforeSave: false });
    }
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!employee) {
      return next(new appError("Token is invalid or has expired", 400));
    }

    employee.password = await bcrypt.hash(req.body.password, 12);
    employee.passwordResetToken = undefined;
    employee.passwordResetExpires = undefined;
    await employee.save();

    await createToken(employee, 200, res);
    res
      .status(200)
      .json({ status: "success", message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.log_out = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

