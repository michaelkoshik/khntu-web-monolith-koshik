import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateEventSchema } from '../dto/event.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { roleGuard } from '../middlewares/role.middleware';

const router = Router();

// Публічні маршрути перегляду заходів
router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);

// Захищений маршрут створення заходу тільки для ADMIN
router.post('/', authGuard, roleGuard(['ADMIN']), validateBody(CreateEventSchema), EventController.create);

export default router;