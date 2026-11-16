import { prisma } from './prisma';
import { CreateEventDto } from '../dto/event.dto';

export class EventRepository {
  async findPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        include: { venue: true },
        orderBy: { id: 'desc' }
      }),
      prisma.event.count()
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    return prisma.event.findUnique({ where: { id }, include: { venue: true } });
  }

  async venueExists(venueId: number): Promise<boolean> {
    const venue = await prisma.venue.findUnique({ where: { id: venueId } });
    return Boolean(venue);
  }

  async create(data: CreateEventDto) {
    return prisma.event.create({
      data: {
        venueId: data.venueId,
        title: data.title,
        eventDate: new Date(data.eventDate),
        basePrice: data.basePrice,
        availableTickets: data.availableTickets
      },
      include: { venue: true }
    });
  }
}