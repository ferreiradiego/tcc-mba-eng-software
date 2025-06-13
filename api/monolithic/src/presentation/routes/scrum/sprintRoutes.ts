import * as sprintController from "@presentation/controllers/scrum/sprintController";
import { Router } from "express";

const router = Router();

router.post("/", sprintController.createSprint);
router.get("/", sprintController.getSprints);
router.get("/:id", sprintController.getSprintById);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

export default router;
