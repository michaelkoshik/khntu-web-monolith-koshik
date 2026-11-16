import { BookingRepository } from '../repositories/booking.repository';
import { CreateBookingDto } from '../dto/booking.dto';
import { AppError } from '../utils/AppError';

const bookingRepository = new BookingRepository();

// Nice-to-Have: State Machine допустимих переходів статусів бронювання
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['CANCELLED'],
  CANCELLED: []
};

export class BookingService {
  async getPaginated(page: number, limit: number) {
    return await bookingRepository.findPaginated(page, limit);
  }

  async getById(id: number) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new AppError('Бронювання із вказаним ідентифікатором не знайдено', 404);
    }
    return booking;
  }

  async createBooking(dto: CreateBookingDto) {
    return await bookingRepository.createBookingTx(dto);
  }

  async transitionStatus(id: number, targetStatus: string) {
    const current = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[current.status] || [];

    if (!allowed.includes(targetStatus)) {
      throw new AppError(
        `Недопустимий перехід статусу: ${current.status} -> ${targetStatus}`,
        400
      );
    }

    const restoreTickets = targetStatus === 'CANCELLED';
    return await bookingRepository.updateStatusTx(id, targetStatus, restoreTickets);
  }
}