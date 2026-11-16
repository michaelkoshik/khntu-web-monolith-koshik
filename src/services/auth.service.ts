import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

const userRepository = new UserRepository();
const SALT_ROUNDS = 10;

export class AuthService {
  private generateTokens(userId: number, role: string) {
    const accessSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_khntu_2026';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_khntu_2026';

    const token = jwt.sign({ sub: userId, role }, accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: userId, role, type: 'refresh' }, refreshSecret, { expiresIn: '7d' });

    return { token, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Користувач з таким email вже існує', 400);
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await userRepository.create({
      email: dto.email,
      password: passwordHash,
      fullName: dto.fullName,
      role: dto.role || 'USER'
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Невірний email або пароль', 401);
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new AppError('Невірний email або пароль', 401);
    }

    const { token, refreshToken } = this.generateTokens(user.id, user.role);
    await userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  async refresh(incomingRefreshToken: string) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_khntu_2026';
    let payload: { sub: number; role: string };

    try {
      payload = jwt.verify(incomingRefreshToken, refreshSecret) as unknown as { sub: number; role: string };
    } catch {
      throw new AppError('Refresh токен недійсний або прострочений', 401);
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new AppError('Refresh токен відкликано або не знайдено у БД', 401);
    }

    const tokens = this.generateTokens(user.id, user.role);
    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await userRepository.updateRefreshToken(userId, null);
  }
}