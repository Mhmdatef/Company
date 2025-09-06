const Employee = require("./../models/employeeModel");
const Admin = require("./../models/adminModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.employeeProtect = catchAsync(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    token = request.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const token_data = await jwt.verify(token, process.env.SECRET);

  const employee = await Employee.findById(token_data.id);
  if (!employee) {
    return next(
      new AppError("The user associated with this token no longer exists", 401)
    );
  }

  if (employee.changedPasswordAfter(token_data.iat)) {
    return next(
      new AppError("Password was recently changed. Please log in again", 401)
    );
  }

  employee.password = undefined;
  request.employee = employee;

  next();
});
exports.adminProtect = catchAsync(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    token = request.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const token_data = await jwt.verify(token, process.env.SECRET);

  const admin = await Admin.findById(token_data.id);
  if (!admin) {
    return next(
      new AppError("The user associated with this token no longer exists", 401)
    );
  }

  if (admin.changedPasswordAfter(token_data.iat)) {
    return next(
      new AppError("Password was recently changed. Please log in again", 401)
    );
  }

  admin.password = undefined;
  request.admin = admin;

  next();
});

//  when you want to restrict access to certain roles only
// exports.restrictTo = (...roles) => {
//   return (request, response, next) => {
//     if (!roles.includes(request.user.role)) {
//       return next(
//         new AppError('You do not have permission to perform this action', 403),
//       );
//     }
//     next();
//   };
// };
