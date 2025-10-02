import { z, type ZodString } from 'zod';

export const passwordSchema: ZodString = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(64, 'Password must not exceed 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[\W_]/, 'Password must contain at least one special character');

export type PasswordType = z.infer<typeof passwordSchema>;

export const emailSchema: ZodString = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email must not exceed 254 characters');

export type EmailType = z.infer<typeof emailSchema>;
