const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "A employee must have a password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);
employeeSchema.methods.createPasswordResetToken = function () {
  // توليد كود 6 أرقام
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  // خزنه في الموديل
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 دقائق

  return resetToken; // هيتبعت في الإيميل
};
employeeSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
employeeSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChanged) {
    const changedTimestamp = parseInt(
      this.passwordChanged.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false; // false means not changed
};
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
