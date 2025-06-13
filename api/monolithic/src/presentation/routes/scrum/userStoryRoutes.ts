import { UserStorySchema } from "@application/usecases/scrum/UserStoryDTO";
import * as userStoryController from "@presentation/controllers/scrum/userStoryController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { validateBody } from "@presentation/middleware/auth/validate";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

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
