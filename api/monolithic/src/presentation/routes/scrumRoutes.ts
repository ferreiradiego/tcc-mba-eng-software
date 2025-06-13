import {
  CeremonySchema,
  CeremonyUpdateSchema,
} from "@application/usecases/scrum/CeremonyDTO";
import { TaskSchema } from "@application/usecases/scrum/TaskDTO";
import { UserStorySchema } from "@application/usecases/scrum/UserStoryDTO";
import * as ceremonyController from "@presentation/controllers/scrum/ceremonyController";
import * as sprintController from "@presentation/controllers/scrum/sprintController";
import * as taskController from "@presentation/controllers/scrum/taskController";
import * as trimesterController from "@presentation/controllers/scrum/trimesterController";
import * as userStoryController from "@presentation/controllers/scrum/userStoryController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { validateBody } from "@presentation/middleware/auth/validate";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

// Ceremony Routes
router.get("/", ceremonyController.listCeremonies);
router.get("/:id", ceremonyController.getCeremony);
router.post(
  "/",
  validateBody(CeremonySchema),
  ceremonyController.createCeremony
);
router.put(
  "/:id",
  validateBody(CeremonyUpdateSchema),
  ceremonyController.updateCeremony
);
router.delete("/:id", ceremonyController.deleteCeremony);

// Sprint Routes
router.post("/", sprintController.createSprint);
router.get("/", sprintController.getSprints);
router.get("/:id", sprintController.getSprintById);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

// Task Routes
router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTask);
router.post("/", validateBody(TaskSchema), taskController.createTask);
router.put(
  "/:id",
  validateBody(TaskSchema.partial()),
  taskController.updateTask
);
router.delete("/:id", taskController.deleteTask);

// Trimester Routes
router.post("/", trimesterController.createTrimester);
router.get("/", trimesterController.getTrimesters);
router.get("/:id", trimesterController.getTrimesterById);
router.put("/:id", trimesterController.updateTrimester);
router.delete("/:id", trimesterController.deleteTrimester);

// User Story Routes

router.get("/", userStoryController.listUserStories);
router.get("/:id", userStoryController.getUserStory);
router.post(
  "/",
  validateBody(UserStorySchema),
  userStoryController.createUserStory
);
router.put(
  "/:id",
  validateBody(UserStorySchema.partial()),
  userStoryController.updateUserStory
);
router.delete("/:id", userStoryController.deleteUserStory);

export default router;
