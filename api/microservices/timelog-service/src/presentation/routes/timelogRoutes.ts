import { Router } from 'express';
import { validateBody } from '@presentation/middleware/validate';
import * as timelogController from '@presentation/controllers/timelogController';
import { TimeLogSchema } from '@application/usecases/TimeLogDTO';

const router = Router();

router.get('/', timelogController.listTimeLogs);
router.get('/:id', timelogController.getTimeLog);
router.post('/', validateBody(TimeLogSchema), timelogController.createTimeLog);
router.put('/:id', validateBody(TimeLogSchema.partial()), timelogController.updateTimeLog);
router.delete('/:id', timelogController.deleteTimeLog);

export default router;
