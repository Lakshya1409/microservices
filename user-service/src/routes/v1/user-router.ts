import { Router } from "express";
import { userController } from "../../controllers";
import { requireRole } from "../../middlewares";
import { 
  validateUserUpdate, 
  validateAdminUserUpdate, 
  validateUserId, 
  validatePagination 
} from "../../validators";

const router = Router();

// Protected routes
router.get("/profile", userController.getProfile);
router.put("/profile", validateUserUpdate, userController.updateProfile);
router.delete("/profile", userController.deleteProfile);

// Admin only routes
router.get("/admin/all", requireRole(["admin"]), validatePagination, userController.getAllUsers);
router.get(
  "/admin/:userId",
  requireRole(["admin"]),
  validateUserId,
  userController.getUserById
);
router.put("/admin/:userId", requireRole(["admin"]), validateUserId, validateAdminUserUpdate, userController.updateUser);
router.delete(
  "/admin/:userId",
  requireRole(["admin"]),
  validateUserId,
  userController.deleteUser
);

export { router as userRouter };
