import {
  CeremonySchema,
  CeremonyUpdateSchema,
} from "@application/usecases/scrum/CeremonyDTO";
import * as ceremonyController from "@presentation/controllers/scrum/ceremonyController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { validateBody } from "@presentation/middleware/auth/validate";
import { Router } from "express";

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
  validateBody(CeremonyUpdateSchema),
  ceremonyController.updateCeremony
);
router.delete("/:id", ceremonyController.deleteCeremony);

export default router;
