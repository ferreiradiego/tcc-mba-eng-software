import * as trimesterController from "@presentation/controllers/scrum/trimesterController";
import { Router } from "express";

const router = Router();

router.post("/", trimesterController.createTrimester);
router.get("/", trimesterController.getTrimesters);
router.get("/:id", trimesterController.getTrimesterById);
router.put("/:id", trimesterController.updateTrimester);
router.delete("/:id", trimesterController.deleteTrimester);

export default router;
