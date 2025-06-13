import { RegisterUserSchema } from "@application/usecases/auth/RegisterUser";
import {
  loginController,
  meController,
  refreshController,
  registerController,
} from "@presentation/controllers/auth/authController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { validateBody } from "@presentation/middleware/auth/validate";
import { Router } from "express";

const router = Router();

router.post("/register", validateBody(RegisterUserSchema), registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.get("/me", authMiddleware, meController);

export default router;
