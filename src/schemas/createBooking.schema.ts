import { z } from 'zod';
import { BookingSchema } from './booking.schema';

export const CreateBookingResponseSchema = z.object({
  bookingid: z.number().int().nonnegative(),
  booking: BookingSchema
});

export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
