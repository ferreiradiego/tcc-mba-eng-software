import { Router } from "express";
import { validateBody } from "@presentation/middleware/validate";
import * as ceremonyController from "@presentation/controllers/ceremonyController";
import { CeremonySchema } from "@application/usecases/CeremonyDTO";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", ceremonyController.listCeremonies);
router.get("/:id", ceremonyController.getCeremony);
router.post(
  "/",
  validateBody(CeremonySchema),
  ceremonyController.createCeremony
);
router.put(
  "/:id",
  validateBody(CeremonySchema.partial()),
  ceremonyController.updateCeremony
);
router.delete("/:id", ceremonyController.deleteCeremony);

export default router;
