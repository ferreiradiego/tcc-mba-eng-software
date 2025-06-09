import { TimeLogSchema } from "@application/usecases/TimeLogDTO";
import * as timelogController from "@presentation/controllers/timelogController";
import { validateBody } from "@presentation/middleware/validate";
import { Router } from "express";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", timelogController.listTimeLogs);
router.get("/:id", timelogController.getTimeLog);
router.post("/", validateBody(TimeLogSchema), timelogController.createTimeLog);
router.put(
  "/:id",
  validateBody(TimeLogSchema.partial()),
  timelogController.updateTimeLog
);
router.delete("/:id", timelogController.deleteTimeLog);

export default router;
