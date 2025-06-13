import { Router } from "express";
import {
  createTrimester,
  getTrimesters,
  getTrimesterById,
  updateTrimester,
  deleteTrimester,
} from "../controllers/trimesterController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTrimester);
router.get("/", getTrimesters);
router.get("/:id", getTrimesterById);
router.put("/:id", updateTrimester);
router.delete("/:id", deleteTrimester);

export default router;
