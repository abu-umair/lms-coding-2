// src/lib/validationSchemas.ts

import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email tidak boleh kosong" })
        .email({ message: "Format email tidak valid" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter" })
});


export type LoginFormSchema = z.infer<typeof LoginSchema>;