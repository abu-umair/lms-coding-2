// src/lib/validationSchemas.ts

import { z } from 'zod';

export const CheckoutSchema = z.object({
    user_full_name: z.string().min(1, { message: "Full Name wajib diisi." }),
    email: z.string().email({ message: "Format Email tidak valid." }),
    phone: z.string().min(1, { message: "Phone wajib diisi." }),
    address: z.string().min(1, { message: "Address wajib diisi." }),
});




export type CheckoutFormData = z.infer<typeof CheckoutSchema>;