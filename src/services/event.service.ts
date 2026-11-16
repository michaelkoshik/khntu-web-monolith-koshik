import { EventRepository } from '../repositories/event.repository';
import { CreateEventDto } from '../dto/event.dto';
import { AppError } from '../utils/AppError';

const eventRepository = new EventRepository();

export class EventService {
  async getPaginated(page: number, limit: number) {
    return await eventRepository.findPaginated(page, limit);
  }

  async getById(id: number) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new AppError('Захід із вказаним ідентифікатором не знайдено', 404);
    }
    return event;
  }

  async create(dto: CreateEventDto) {
    const exists = await eventRepository.venueExists(dto.venueId);
    if (!exists) {
      throw new AppError(`Майданчик з ID ${dto.venueId} не знайдено`, 404);
    }
    return await eventRepository.create(dto);
  }
}