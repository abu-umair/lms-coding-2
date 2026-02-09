// src/lib/validationSchemas.ts

import { z } from 'zod';

export const PasswordSchema = z.object({
    current_password: z.string().min(6, { message: "Current Password minimal harus 6 karakter." }),
    new_password: z.string().min(6, { message: "New Password minimal harus 6 karakter." }),
    password_confirmation: z.string().min(6, { message: "Re-Type New Password minimal harus 6 karakter." }),


}).refine(data => data.new_password === data.password_confirmation, {
    message: "Password dan Konfirmasi Password tidak cocok.",
    path: ["password_confirmation"],
});




export type PasswordFormData = z.infer<typeof PasswordSchema>;