import { Router } from "express";
import {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprintController";

const router = Router();

router.post("/", createSprint);
router.get("/", getSprints);
router.get("/:id", getSprintById);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);

export default router;
