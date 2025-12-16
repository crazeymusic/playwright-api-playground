import { z } from 'zod';

export const PingResponseSchema = z.string().min(1);
