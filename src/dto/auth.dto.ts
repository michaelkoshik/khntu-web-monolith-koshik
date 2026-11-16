import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Некоректний формат email'),
  password: z.string().min(6, 'Пароль має містити не менше 6 символів'),
  fullName: z.string().min(2, 'Ім’я користувача має містити не менше 2 символів').default('Користувач EventTicketing'),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']).optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Некоректний формат email'),
  password: z.string().min(1, 'Пароль є обов’язковим')
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Некоректний refreshToken')
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;