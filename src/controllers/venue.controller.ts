import { Request, Response } from 'express';
import { VenueService } from '../services/venue.service';
import { catchAsync } from '../utils/catchAsync';

const venueService = new VenueService();

export class VenueController {
  static getAll = catchAsync((req: Request, res: Response) => {
    const items = venueService.getAll();
    res.status(200).json({ status: 'success', results: items.length, data: items });
  });

  static getById = catchAsync((req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = venueService.getById(id);
    res.status(200).json({ status: 'success', data: item });
  });

  static create = catchAsync((req: Request, res: Response) => {
    const created = venueService.create(req.body);
    res.status(201).json({ status: 'success', data: created });
  });
}
