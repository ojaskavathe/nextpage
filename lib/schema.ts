import * as z from 'zod';

export const LoginFormSchema = z.object({
  id: z.string().min(1, 'ID required'),
  password: z.string().min(1, 'Password required'),
})