import { $Enums } from '@prisma/client';
import * as z from 'zod';
import { addonDurations, durations } from './utils';

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

const adjustRefine = (val: any, ctx: z.RefinementCtx) => {
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
}

export const LoginFormSchema = z.object({
  username: z.string().min(1, 'ID required'),
  password: z.string().min(1, 'Password required'),
  callbackUrl: z.string().optional()
});

export const supportCreateSchema = z.object({
  username: z.string().min(1, 'ID required'),
  password: z.string().min(1, 'Password required'),
  role: z.nativeEnum($Enums.Role),
});

export const patronCreateSchema = z.object({
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/, { message: "Invalid Phone" }),
  altPhone: z.string().regex(/^$|^\d{8,10}$/),
  address: optString,
  pincode: optString,
  whatsapp: z.boolean().default(true),
  deposit: z.number().default(499),
  remarks: optString,

  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => durations.includes(val), {
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
  duration: z.number().refine((val) => durations.includes(val), {
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
  expiry: z.date(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{8,10}$/),
  altPhone: z.string().regex(/^$|^\d{8,10}$/),
  address: optString,
  pincode: optString,
  whatsapp: z.boolean().default(true),
  remarks: z.string(),
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

const { SIGNUP, RENEWAL, CLOSURE, ...m } = $Enums.TransactionType;
export const MiscTransactionType = m;

export const patronMiscDDSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of transaction!' })
  }),
  // optIntString, but with min(1)
  numDD: z.preprocess(
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
      z.number().min(1, { message: "Mininum 1 DD required!" }),
      z.literal('')
    ])
  ),

  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine(adjustRefine);

export const patronMiscAddonSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of transaction!' })
  }),

  plan: z.number().min(1).max(6),
  duration: z.number().refine((val) => addonDurations.includes(val), {
    message: "Duration can only be 1, 2, 3 or 4 months"
  }).optional(),
  tillExpiry: z.boolean(),

  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine((val, ctx) => {
    if (!val.tillExpiry && !val.duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Specify a duration, or Addon till expiry.',
        path: ['duration']
      })
    }
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

export const patronMiscRefundSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of transaction!' })
  }),

  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine(adjustRefine);

export const patronMiscClosureSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of transaction!' })
  }),
  depositRefund: z.boolean(),
  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine(adjustRefine);

export const patronMiscLostSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of transaction!' })
  }),

  // optIntString, but with min(1)
  amount: z.preprocess(
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
      z.number().min(1, { message: "Mininum 1 DD required!" }),
      z.literal('')
    ])
  ),

  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine(adjustRefine);

export const patronMiscOtherSchema = z.object({
  id: z.number(),
  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({
      message: "Select the mode of transaction!",
    }),
  }),

  // non zero numbers, but the default value is an empty string
  amount: z.preprocess(
    (intStr) => {
      if (typeof intStr === "number") return intStr;
      if (!intStr || typeof intStr !== "string") return null;

      if (/^-?\d+$/.test(intStr)) {
        return parseInt(intStr);
      }
    },
    z.union([z.number({
      errorMap: () => ({
        message: "Amount needs to be entered."
      })
    }).safe(), z.literal("")]),
  ),

  offer: optString,
  remarks: optString,
  adjust: optSignedIntString,
  reason: optString,
})
  .superRefine(adjustRefine)
  .superRefine((val: any, ctx: z.RefinementCtx) => {
    if (val.amount !== 0 && !val.remarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Specify the reason for this transaction.",
        path: ["remarks"],
      });
    }
  });

export const expenseSchema = z.object({
  category: z.string(),

  mode: z.nativeEnum($Enums.TransactionMode, {
    errorMap: () => ({ message: 'Select the mode of expense!' })
  }),

  // non zero numbers, but the default value is an empty string
  amount: z.preprocess(
    (intStr) => {
      if (typeof intStr === "number") return intStr;
      if (!intStr || typeof intStr !== "string") return null;

      if (/^-?\d+$/.test(intStr)) {
        return parseInt(intStr);
      }
    },
    z.union([z.number({
      errorMap: () => ({
        message: "Amount needs to be entered."
      })
    }).safe(), z.literal("")]),
  ),

  remarks: optString,
})

export const cashReportSchema = z.object({
  // non zero numbers, but the default value is an empty string
  amount: z.number().gt(0),
})

export const transactionSchema = z.object({
  id: z.number().min(0),
  newPlan: z.nullable(z.number()),
  newExpiry: z.nullable(z.date()),
  type: z.nativeEnum($Enums.TransactionType),

  registration: optSignedIntString,
  deposit: optSignedIntString,
  readingFees: optSignedIntString,
  DDFees: optSignedIntString,
  discount: optSignedIntString,
  pastDues: optSignedIntString,

  netPayable: optSignedIntString,
  adjust: optSignedIntString,
  mode: z.nativeEnum($Enums.TransactionMode),
  offer: optString,
})
