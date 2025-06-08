import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  meController,
} from "@presentation/controllers/authController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";
import { validateBody } from "@presentation/middleware/validate";
import { RegisterUserSchema } from "@application/usecases/RegisterUser";

const router = Router();

router.post("/register", validateBody(RegisterUserSchema), registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.get("/me", authMiddleware, meController);

export default router;
