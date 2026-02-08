// src/lib/validationSchemas.ts

import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string().min(1, { message: "Nama wajib diisi." }),
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(6, { message: "Password minimal harus 6 karakter." }),
    password_confirmation: z.string().min(6, { message: "Konfirmasi Password minimal harus 6 karakter." }),

    // HANYA TERAPKAN ENUM, HAPUS ARGUMEN KEDUA UNTUK MENGHINDARI ERROR OVERLOAD
    // gender: z.enum(["1", "2"]),

    // HANYA TERAPKAN LITERAL, HAPUS ARGUMEN KEDUA
    isAccepted: z.boolean().refine((val) => val === true, {
        message: "Anda harus menyetujui Syarat dan Ketentuan.",
    }),


}).refine(data => data.password === data.password_confirmation, {
    message: "Password dan Konfirmasi Password tidak cocok.",
    path: ["password_confirmation"],
});

// }).refine(data => data.isAccepted, {
//     // TAMBAH REFINEMENT untuk pesan error isAccepted
//     message: "Anda harus menyetujui Syarat dan Ketentuan.",
//     path: ["isAccepted"],
// }).refine(data => ["1", "2"].includes(data.gender), {
//     // TAMBAH REFINEMENT untuk pesan error gender yang lebih jelas
//     message: "Jenis Kelamin wajib dipilih.",
//     path: ["gender"],
// });


export type SignUpFormData = z.infer<typeof SignUpSchema>;