import { $Enums } from '@prisma/client';
import * as z from 'zod';

export const optString = z.preprocess(
  (str) => {
    if (!str || typeof str !== 'string') return undefined
    return str === '' ? undefined : str
  },
  z
    .string()
    .optional(),
);

export const optPhoneString = z.preprocess(
  (str) => {
    if (!str || typeof str !== 'string') return undefined
    return str === '' ? undefined : str
  },
  z
    .string().regex(/^$|^\d{8,10}$/)
    .optional(),
);

export const optIntString = z.preprocess(
  (intStr) => {
    if (typeof intStr === 'number') return intStr;
    if (!intStr || typeof intStr !== 'string') return 0

    if (intStr === '') {
      return 0;
    } else if (/^\d+$/.test(intStr)) {
      return parseInt(intStr);
    }
  },
  z.union([
    z.number().min(0),
    z.literal('')
  ])
);


export const optSignedIntString = z.preprocess(
  (intStr) => {
    // this is needed as server side revalidation checks on a number, not a string
    // why this isn't needed for the unsigned int string is a mystery, but i'm keeping a check there just in case
    if (typeof intStr === 'number') return intStr;
    
    if (!intStr || typeof intStr !== 'string') return 0;

    if (intStr === '') {
      return 0;
    } else if (/^-?\d+$/.test(intStr)) {
      return parseInt(intStr);
    }
  },
  z.union([
    z.number().safe(),
    z.literal('')
  ])
);

export const LoginFormSchema = z.object({
  id: z.string().min(1, 'ID required'),
  password: z.string().min(1, 'Password required'),
});

export const patronCreateSchema = z.object({
  name: z.string().min(1, {message: "Name required"}),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/, { message: "Invalid Phone"}),
  altPhone: optPhoneString,
  address: optString,
  pincode: optString,
  whatsapp: z.boolean().default(true),
  deposit: z.number().default(499),
  remarks: optString,

  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => [1, 3, 6, 12].includes(val), {
    message: "Duration can only be 1, 3, 6 or 12 months"
  }),
  paidDD: optIntString,

  mode: z.nativeEnum($Enums.TransactionMode),
  pastDues: optIntString,
  adjust: optSignedIntString,
  reason: optString,
  offer: optString,
})
  .superRefine((val, ctx) => {
    if (val.adjust != 0 && !val.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Specify the reason for adjustment.',
        path: ['reason']
      })
    }
    if (val.adjust == 0 && val.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No adjustment to provide reason for.',
        path: ['adjust']
      })
    }
  });

export const patronRenewSchema = z.object({
  id: z.number().min(0),
  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => [1, 3, 6, 12].includes(val), {
    message: "Duration can only be 1, 3, 6 or 12 months"
  }),
  paidDD: optIntString,
  mode: z.nativeEnum($Enums.TransactionMode),
  adjust: optSignedIntString,
  reason: optString,
  offer: optString,
  remarks: optString,

  renewFromExpiry: z.boolean().default(false)
})
  .superRefine((val, ctx) => {
    if (val.adjust !== 0 && !val.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Specify the reason for adjustment.',
        path: ['reason']
      })
    }
    if (val.adjust === 0 && !!val.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No adjustment to provide reason for: adjust: ${val.adjust}, reason: ${val.reason}`,
        path: ['reason']
      })
    }
  });

export const patronUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/),
  altPhone: optPhoneString,
  address: optString,
  pincode: optString,
  whatsapp: z.boolean().default(true),
  remarks: optString,
});

export const footfallFormSchema = z.object({
  id: z.number(),
  type: z.nativeEnum($Enums.FootfallType),
  offer: optString,
  remarks: optString,

  isDD: z.boolean().default(false),
  DDType: z.nativeEnum($Enums.DDType),
  numBooks: z.number().min(1),
  scheduledDate: z.date(),
  message: optString
})