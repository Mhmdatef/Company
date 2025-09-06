const jwt = require("jsonwebtoken");

const tokenGenerator = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRATION,
  });
};

exports.createToken = (User, statusCode, res) => {
  const token = tokenGenerator(User.id); // مش محتاج await
  User.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      User,
    },
  });
};
