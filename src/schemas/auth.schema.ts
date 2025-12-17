import { z } from 'zod';

export const AuthSuccessSchema = z.object({
  token: z.string().min(1)
});

export const AuthBadCredentialsSchema = z.object({
  reason: z.string().min(1)
});
