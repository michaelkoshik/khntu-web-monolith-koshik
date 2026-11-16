import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { catchAsync } from '../utils/catchAsync';

const bookingService = new BookingService();

export class BookingController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const result = await bookingService.getPaginated(page, limit);
    res.status(200).json({ status: 'success', ...result });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await bookingService.getById(id);
    res.status(200).json({ status: 'success', data: item });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ status: 'success', data: booking });
  });

  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updated = await bookingService.transitionStatus(id, req.body.status);
    res.status(200).json({ status: 'success', data: updated });
  });
}