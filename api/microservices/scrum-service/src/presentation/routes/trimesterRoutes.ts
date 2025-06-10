import { Router } from "express";
import {
  createTrimester,
  getTrimesters,
  getTrimesterById,
  updateTrimester,
  deleteTrimester,
} from "../controllers/trimesterController";

const router = Router();

router.post("/", createTrimester);
router.get("/", getTrimesters);
router.get("/:id", getTrimesterById);
router.put("/:id", updateTrimester);
router.delete("/:id", deleteTrimester);

export default router;
