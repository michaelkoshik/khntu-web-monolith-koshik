import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateBookingSchema, UpdateBookingStatusSchema } from '../dto/booking.dto';

const router = Router();

router.get('/', BookingController.getAll);
router.get('/:id', BookingController.getById);
router.post('/', validateBody(CreateBookingSchema), BookingController.create);
router.patch('/:id/status', validateBody(UpdateBookingStatusSchema), BookingController.updateStatus);

export default router;