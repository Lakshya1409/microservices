import { Router } from "express";
import { authController } from "../../controllers";
import { requireRole } from "../../middlewares/auth-middleware";
import { ResponseUtils } from "../../utils/response";
import { USER_MESSAGES } from "../../utils/messages";
import { 
  validateRegistration, 
  validateLogin, 
  validateRefreshToken 
} from "../../validators";

const router = Router();

// Public routes (no authentication required)
router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/refresh", validateRefreshToken, authController.refreshToken);

// Protected routes (authentication required by default)
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAll);
router.get("/profile", authController.getProfile);

// Admin only routes
router.get("/admin/users", requireRole(["admin"]), (req, res) => {
  ResponseUtils.success(res, null, USER_MESSAGES.ADMIN_ENDPOINT_PLACEHOLDER);
});

export default router;
