import { z } from 'zod';

export const CreateEventSchema = z.object({
  venueId: z.number().int().positive('Ідентифікатор майданчика має бути додатним цілим числом'),
  title: z.string().min(3, 'Назва заходу має містити не менше 3 символів'),
  eventDate: z.string().datetime('Дата заходу має бути у форматі ISO 8601'),
  basePrice: z.number().positive('Ціна квитка має бути більшою за 0'),
  availableTickets: z.number().int().nonnegative('Кількість квитків не може бути від’ємною')
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;