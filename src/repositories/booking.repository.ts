import { prisma } from './prisma';
import { CreateBookingDto } from '../dto/booking.dto';
import { AppError } from '../utils/AppError';

export class BookingRepository {
  async findPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, fullName: true } },
          tickets: { include: { event: true } }
        },
        orderBy: { id: 'desc' }
      }),
      prisma.booking.count()
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        tickets: { include: { event: true } }
      }
    });
  }

  async createBookingTx(dto: CreateBookingDto) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: dto.userId } });
      if (!user) {
        throw new AppError(`Користувача з ID ${dto.userId} не знайдено`, 404);
      }

      let totalAmount = 0;
      const ticketsData: Array<{
        eventId: number;
        quantity: number;
        priceAtPurchase: number;
        seatZone: string;
      }> = [];

      for (const item of dto.items) {
        const event = await tx.event.findUnique({ where: { id: item.eventId } });
        if (!event) {
          throw new AppError(`Захід з ID ${item.eventId} не знайдено`, 404);
        }
        if (event.availableTickets < item.quantity) {
          throw new AppError(
            `Недостатньо квитків на захід "${event.title}" (доступно: ${event.availableTickets})`,
            400
          );
        }

        await tx.event.update({
          where: { id: event.id },
          data: { availableTickets: { decrement: item.quantity } }
        });

        totalAmount += event.basePrice * item.quantity;
        ticketsData.push({
          eventId: item.eventId,
          quantity: item.quantity,
          priceAtPurchase: event.basePrice,
          seatZone: item.seatZone
        });
      }

      return await tx.booking.create({
        data: {
          userId: dto.userId,
          status: 'PENDING',
          totalAmount,
          tickets: { create: ticketsData }
        },
        include: {
          tickets: { include: { event: true } }
        }
      });
    });
  }

  async updateStatusTx(bookingId: number, newStatus: string, restoreTickets: boolean) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { tickets: true }
      });

      if (!booking) {
        throw new AppError(`Бронювання з ID ${bookingId} не знайдено`, 404);
      }

      if (restoreTickets) {
        for (const t of booking.tickets) {
          await tx.event.update({
            where: { id: t.eventId },
            data: { availableTickets: { increment: t.quantity } }
          });
        }
      }

      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
        include: { tickets: true }
      });
    });
  }
}