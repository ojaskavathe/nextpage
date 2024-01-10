import { $Enums } from '@prisma/client';
import * as z from 'zod';

export const LoginFormSchema = z.object({
  id: z.string().min(1, 'ID required'),
  password: z.string().min(1, 'Password required'),
})

export const patronSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/),
  altPhone: z.string().regex(/^$|^\d{8,10}$/),
  address: z.string().optional(),
  pincode: z.string().optional(),
  whatsapp: z.boolean().default(true),
  deposit: z.number().default(499),
  remarks: z.string().optional(),
  
  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => [1, 3, 6, 12].includes(val), { 
    message: "Duration can only be 1, 3, 6 or 12 months" 
  }),

  mode: z.nativeEnum($Enums.TransactionMode),
  pastDues: z.number().optional(),
  adjust: z.coerce.number().optional(),
  reason: z.string().optional(),
  offer: z.string().optional(),
}).superRefine((val, ctx) => {
  if(val.adjust !== 0 && val.reason === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Specify the reason for adjustment.',
      path: ['adjust']
    })
  }
  if(val.adjust === 0 && val.reason !== "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'No adjustment to provide reason for.',
      path: ['reason']
    })
  }
})

export const patronRenewSchema = z.object({
  
  id: z.number(),
  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => [1, 3, 6, 12].includes(val), { 
    message: "Duration can only be 1, 3, 6 or 12 months" 
  }),
  mode: z.nativeEnum($Enums.TransactionMode),
  pastDues: z.number().optional(),
  adjust: z.coerce.number().optional(),
  reason: z.string().optional(),
  offer: z.string().optional(),

}).superRefine((val, ctx) => {
  if(val.adjust !== 0 && val.reason === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Specify the reason for adjustment.',
      path: ['adjust']
    })
  }
  if(val.adjust === 0 && val.reason !== "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'No adjustment to provide reason for.',
      path: ['reason']
    })
  }
})

export const patronUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/),
  altPhone: z.string().regex(/^$|^\d{8,10}$/),
  address: z.string().optional(),
  pincode: z.string().optional(),
  whatsapp: z.boolean().default(true),
  remarks: z.string().optional(),
})