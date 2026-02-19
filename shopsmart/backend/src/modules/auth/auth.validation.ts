import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9!@#$%^&*]/)
    .withMessage("Password must contain a number or special character"),
  body("fullName").trim().isLength({ min: 2 }).withMessage("Full name required (min 2 chars)"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

export const refreshValidation = [
  body("refreshToken").optional().isString(),
  // Cookie is read in controller
];

export const verifyEmailValidation = [
  body("token").notEmpty().withMessage("Token required"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
];

export const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Token required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];
