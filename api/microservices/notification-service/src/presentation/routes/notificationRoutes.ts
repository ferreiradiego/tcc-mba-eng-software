import { Router } from 'express';
import { sendNotificationController } from '@presentation/controllers/notificationController';

const router = Router();

router.post('/send', sendNotificationController);

export default router;
