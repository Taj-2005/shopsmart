import { Router } from "express";
import cookieParser from "cookie-parser";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "./auth.validation";
import * as authController from "./auth.controller";

const router = Router();
router.use(cookieParser());

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/verify-email", validate(verifyEmailValidation), authController.verifyEmail);
router.post("/forgot-password", validate(forgotPasswordValidation), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordValidation), authController.resetPassword);
router.get("/me", authenticate, authController.me);

export default router;
