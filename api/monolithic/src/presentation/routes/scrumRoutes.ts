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
const ceremonyRouter = Router();
ceremonyRouter.get("/", ceremonyController.listCeremonies);
ceremonyRouter.get("/:id", ceremonyController.getCeremony);
ceremonyRouter.post(
  "/",
  validateBody(CeremonySchema),
  ceremonyController.createCeremony
);
ceremonyRouter.put(
  "/:id",
  validateBody(CeremonyUpdateSchema),
  ceremonyController.updateCeremony
);
ceremonyRouter.delete("/:id", ceremonyController.deleteCeremony);
router.use("/ceremonies", ceremonyRouter);

// Sprint Routes
const sprintRouter = Router();
sprintRouter.post("/", sprintController.createSprint);
sprintRouter.get("/", sprintController.getSprints);
sprintRouter.get("/:id", sprintController.getSprintById);
sprintRouter.put("/:id", sprintController.updateSprint);
sprintRouter.delete("/:id", sprintController.deleteSprint);
router.use("/sprints", sprintRouter);

// Task Routes
const taskRouter = Router();
taskRouter.get("/", taskController.listTasks);
taskRouter.get("/:id", taskController.getTask);
taskRouter.post("/", validateBody(TaskSchema), taskController.createTask);
taskRouter.put(
  "/:id",
  validateBody(TaskSchema.partial()),
  taskController.updateTask
);
taskRouter.delete("/:id", taskController.deleteTask);
router.use("/tasks", taskRouter);

// Trimester Routes
const trimesterRouter = Router();
trimesterRouter.post("/", trimesterController.createTrimester);
trimesterRouter.get("/", trimesterController.getTrimesters);
trimesterRouter.get("/:id", trimesterController.getTrimesterById);
trimesterRouter.put("/:id", trimesterController.updateTrimester);
trimesterRouter.delete("/:id", trimesterController.deleteTrimester);
router.use("/trimesters", trimesterRouter);

// User Story Routes
const userStoryRouter = Router();
userStoryRouter.get("/", userStoryController.listUserStories);
userStoryRouter.get("/:id", userStoryController.getUserStory);
userStoryRouter.post(
  "/",
  validateBody(UserStorySchema),
  userStoryController.createUserStory
);
userStoryRouter.put(
  "/:id",
  validateBody(UserStorySchema.partial()),
  userStoryController.updateUserStory
);
userStoryRouter.delete("/:id", userStoryController.deleteUserStory);
router.use("/user-stories", userStoryRouter);

export default router;
