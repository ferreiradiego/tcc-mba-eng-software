// src/presentation/routes/authRoutes.ts
import { Router } from 'express';
import { registerController, loginController, refreshController, meController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.get('/me', authMiddleware, meController);

export default router;
