// src/lib/validationSchemas.ts

import { z } from 'zod';

export const VerifySchema = z.object({
    email: z.string()
        .min(1, { message: "Email tidak boleh kosong" })
        .email({ message: "Format email tidak valid" }),
    // type: z.string()
    //     .min(1, { message: "Type tidak boleh kosong" }),
});

export type VerifyFormData = z.infer<typeof VerifySchema>;