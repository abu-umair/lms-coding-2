// src/lib/validationSchemas.ts

import { z } from 'zod';

export const ResetPasswordSchema = z.object({
    code_otp: z.string().min(1, { message: "Code OTP minimal harus 1 karakter." }),
    email: z
        .string()
        .min(1, { message: "Email tidak boleh kosong" })
        .email({ message: "Format email tidak valid" }),
    new_password: z.string().min(6, { message: "New Password minimal harus 6 karakter." }),
    password_confirmation: z.string().min(6, { message: "Re-Type New Password minimal harus 6 karakter." }),


}).refine(data => data.new_password === data.password_confirmation, {
    message: "Password dan Konfirmasi Password tidak cocok.",
    path: ["password_confirmation"],
});




export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;