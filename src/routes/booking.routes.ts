import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateBookingSchema, UpdateBookingStatusSchema } from '../dto/booking.dto';
import { authGuard } from '../middlewares/auth.middleware';
import { roleGuard } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authGuard, BookingController.getAll);
router.get('/:id', authGuard, BookingController.getById);
router.post('/', authGuard, validateBody(CreateBookingSchema), BookingController.create);
router.patch('/:id/status', authGuard, roleGuard(['MANAGER', 'ADMIN']), validateBody(UpdateBookingStatusSchema), BookingController.updateStatus);

export default router;