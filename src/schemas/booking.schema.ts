import { z } from 'zod';
import { IsoDateSchema } from './isoDate.schema';

export const BookingDatesSchema = z.object({
  checkin: IsoDateSchema,
  checkout: IsoDateSchema
});

export const BookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number().int().nonnegative(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional()
});

export type Booking = z.infer<typeof BookingSchema>;
