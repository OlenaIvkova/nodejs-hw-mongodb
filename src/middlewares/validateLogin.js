import { body, validationResult } from "express-validator";
import createHttpError from "http-errors";

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, "Validation failed", { errors: errors.array() }));
    }
    next();
  },
];