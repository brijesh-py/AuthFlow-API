const response = ({ res, message, statusCode = 200, ...data }) => {
  return res.status(statusCode).json({ status: statusCode, message, ...data });
};

module.exports = { response };
