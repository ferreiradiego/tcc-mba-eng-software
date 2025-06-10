import { Router } from "express";
import { validateBody } from "@presentation/middleware/validate";
import * as userStoryController from "@presentation/controllers/userStoryController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";
import { UserStorySchema } from "@application/usecases/UserStoryDTO";

const router = Router();

router.use(authMiddleware);

router.get("/", userStoryController.listUserStories);
router.get("/:id", userStoryController.getUserStory);
router.post("/", validateBody(UserStorySchema), userStoryController.createUserStory);
router.put(
  "/:id",
  validateBody(UserStorySchema.partial()),
  userStoryController.updateUserStory
);
router.delete("/:id", userStoryController.deleteUserStory);

export default router;
