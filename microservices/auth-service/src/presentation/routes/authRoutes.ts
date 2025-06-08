import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  meController,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { RegisterUserSchema } from "../../application/usecases/RegisterUser";

const router = Router();

router.post("/register", validateBody(RegisterUserSchema), registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.get("/me", authMiddleware, meController);

export default router;
