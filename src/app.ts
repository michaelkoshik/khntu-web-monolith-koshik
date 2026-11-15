import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());

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

export default app;