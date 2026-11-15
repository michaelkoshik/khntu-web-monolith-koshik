import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';

const router = Router();

router.get('/', VenueController.getAll);
router.get('/:id', VenueController.getById);
router.post('/', VenueController.create);

export default router;
