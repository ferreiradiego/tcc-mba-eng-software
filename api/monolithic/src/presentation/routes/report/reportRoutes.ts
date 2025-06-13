import * as reportController from "@presentation/controllers/report/reportController";
import { authMiddleware } from "@presentation/middleware/auth/authMiddleware";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/tasks", reportController.tasksReport);
router.get("/ceremonies", reportController.ceremoniesReport);
router.get("/summary", reportController.summaryReport);
router.get("/export", reportController.exportReport);

router.get("/error/unsupported-format", (req, res) => {
  res.status(400).json({ error: "Formato não suportado" });
});

export default router;
