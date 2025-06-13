import { Router } from "express";
import {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprintController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createSprint);
router.get("/", getSprints);
router.get("/:id", getSprintById);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);

export default router;
