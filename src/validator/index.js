const { z } = require("zod");
const { errorHandler } = require("../utils/errorHandler");

// Schema for creating a user
const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(5, { message: "Name must be at least 5 characters" })
    .max(20, { message: "Name must be at most 20 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
  avatar: z.string().optional(),
  role: z.string().optional({
    invalid_type_error: "Role must be 'user' or 'admin'",
  }),
});

const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
});

const emailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
});

const passwordSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
});

const profileSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(5, { message: "Name must be at least 5 characters" })
    .max(20, { message: "Name must be at most 20 characters" }),
  role: z.string().optional({
    invalid_type_error: "Role must be 'user' or 'admin'",
  }),
  avatar: z.string().optional(),
});

const updatePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Old Password is required" })
    .min(6, { message: "Old Password must be at least 6 characters" })
    .max(20, { message: "Old Password must be at most 20 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
});

const validator =
  (schema, source = "body") =>
  (req, res, next) => {
    errorHandler(res, async () => {
      const values = req[source];
      await schema.parseAsync(values);
      next();
    });
  };

module.exports = {
  validator,
  createUserSchema,
  loginUserSchema,
  emailSchema,
  passwordSchema,
  profileSchema,
  updatePasswordSchema,
};
