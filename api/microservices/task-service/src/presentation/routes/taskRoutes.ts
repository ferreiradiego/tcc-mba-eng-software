import { Router } from "express";
import { validateBody } from "@presentation/middleware/validate";
import * as taskController from "@presentation/controllers/taskController";
import { TaskSchema } from "@application/usecases/TaskDTO";

const router = Router();

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
