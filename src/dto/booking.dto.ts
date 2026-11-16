import { z } from 'zod';

export const BookingTicketItemSchema = z.object({
  eventId: z.number().int().positive('ID заходу має бути додатним цілим числом'),
  quantity: z.number().int().min(1, 'Мінімальна кількість квитків — 1'),
  seatZone: z.enum(['STANDARD', 'VIP', 'FAN_ZONE']).default('STANDARD')
});

export const CreateBookingSchema = z.object({
  userId: z.number().int().positive('ID користувача має бути додатним цілим числом'),
  items: z.array(BookingTicketItemSchema).min(1, 'Бронювання повинно містити хоча б один квиток')
});

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED'], {
    errorMap: () => ({ message: 'Допустимі статуси: PENDING, PAID, CANCELLED' })
  })
});

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusDto = z.infer<typeof UpdateBookingStatusSchema>;