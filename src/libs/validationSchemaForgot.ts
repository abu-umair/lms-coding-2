// src/lib/validationSchemas.ts

import { z } from 'zod';

export const ForgotSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email tidak boleh kosong" })
        .email({ message: "Format email tidak valid" }),
});


export type ForgotFormSchema = z.infer<typeof ForgotSchema>;