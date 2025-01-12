const jwt = require("jsonwebtoken");

const setCookie = async (res, _id) => {
  const token = await jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRE_TIME,
  });
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: parseInt(process.env.COOKIE_EXPIRE_TIME) * 60 * 60 * 1000,
  };
  res.cookie("token", token, options);
  return token;
};

module.exports = setCookie;
