const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authMiddleware = require("./middlewares/auth.middleware");
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

// Default routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

// Routes Middleware
app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);

module.exports = app;
