import { z } from 'zod';

export const DeleteBookingResponseSchema = z.string().min(1);
