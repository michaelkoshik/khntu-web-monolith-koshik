import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateEventSchema } from '../dto/event.dto';

const router = Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.post('/', validateBody(CreateEventSchema), EventController.create);

export default router;