import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.post('/', EventController.create);

export default router;
