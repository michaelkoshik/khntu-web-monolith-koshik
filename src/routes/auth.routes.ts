import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../dto/auth.dto';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateBody(RegisterSchema), AuthController.register);
router.post('/login', validateBody(LoginSchema), AuthController.login);
router.post('/refresh', validateBody(RefreshTokenSchema), AuthController.refresh);
router.post('/logout', authGuard, AuthController.logout);

export default router;