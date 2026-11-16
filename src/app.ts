import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import eventRoutes from './routes/event.routes';
import venueRoutes from './routes/venue.routes';
import bookingRoutes from './routes/booking.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/api/v1/health', (req: Request, res: Response) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    memoryUsage: {
      rssMB: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
      heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100
    }
  });
});

app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Маршрут ${req.originalUrl} не знайдено на сервері`, 404));
});

app.use(errorHandler);

export default app;