import { Router } from "express";
import * as c from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { authLimiter, otpLimiter } from "../middleware/rate-limit.js";
import * as v from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", authLimiter, validate(v.signupSchema), c.signup);
router.post("/verify-email", otpLimiter, validate(v.verifyEmailSchema), c.verifyEmail);
router.post("/resend-otp", otpLimiter, validate(v.resendSchema), c.resendOtp);
router.post("/login", authLimiter, validate(v.loginSchema), c.login);
router.post("/google", authLimiter, validate(v.googleSchema), c.googleLogin);
router.post("/forgot-password", otpLimiter, validate(v.forgotSchema), c.forgotPassword);
router.post("/verify-reset-otp", otpLimiter, validate(v.verifyResetSchema), c.verifyResetOtp);
router.post("/reset-password", otpLimiter, validate(v.resetSchema), c.resetPassword);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.post("/logout-all", requireAuth, c.logoutAll);
router.get("/me", requireAuth, c.me);

export default router;