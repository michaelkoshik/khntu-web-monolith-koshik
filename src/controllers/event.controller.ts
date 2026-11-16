import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { catchAsync } from '../utils/catchAsync';

const eventService = new EventService();

export class EventController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const result = await eventService.getPaginated(page, limit);
    res.status(200).json({ status: 'success', ...result });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await eventService.getById(id);
    res.status(200).json({ status: 'success', data: item });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const created = await eventService.create(req.body);
    res.status(201).json({ status: 'success', data: created });
  });
}