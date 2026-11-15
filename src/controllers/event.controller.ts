import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { catchAsync } from '../utils/catchAsync';

const eventService = new EventService();

export class EventController {
  static getAll = catchAsync((req: Request, res: Response) => {
    const items = eventService.getAll();
    res.status(200).json({ status: 'success', results: items.length, data: items });
  });

  static getById = catchAsync((req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = eventService.getById(id);
    res.status(200).json({ status: 'success', data: item });
  });

  static create = catchAsync((req: Request, res: Response) => {
    const created = eventService.create(req.body);
    res.status(201).json({ status: 'success', data: created });
  });
}
