import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

const authService = new AuthService();

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({ status: 'success', ...result });
  });

  static refresh = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.status(200).json({ status: 'success', ...tokens });
  });

  static logout = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await authService.logout(userId);
    res.status(200).json({ status: 'success', message: 'Вихід виконано, refreshToken відкликано' });
  });
}