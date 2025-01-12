const { ZodError } = require("zod");
class HttpError extends Error {
  constructor({ message = "An error occurred", statusCode = 400, ...data }) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

const zodError = (issues) => {
  const errors = issues.map((issue) => issue.message);
  return errors;
};

const errorHandler = async (res, callback) => {
  try {
    await callback();
  } catch (error) {
    if (error instanceof HttpError) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, ...error.data });
    }
    if (error instanceof ZodError) {
      const errors = zodError(error.issues);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { HttpError, errorHandler };
