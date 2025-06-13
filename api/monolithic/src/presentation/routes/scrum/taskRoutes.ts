import { TaskSchema } from "@application/usecases/scrum/TaskDTO";
import * as taskController from "@presentation/controllers/scrum/taskController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { validateBody } from "@presentation/middleware/auth/validate";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTask);
router.post("/", validateBody(TaskSchema), taskController.createTask);
router.put(
  "/:id",
  validateBody(TaskSchema.partial()),
  taskController.updateTask
);
router.delete("/:id", taskController.deleteTask);

export default router;
