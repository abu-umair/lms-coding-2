import { z } from 'zod';

// 1. Definisikan Skema Dasar (Data yang umum ada di keduanya)
const baseCartSchema = z.object({
    course_id: z.string().min(1, "Course ID wajib diisi"),
});

export const getCartSchema = (isEdit: boolean) => {
    if (isEdit) {
        // MODE EDIT:
        // - course_id dibuat opsional (.partial)
        // - Tambahkan cart_id dan new_quantity
        return baseCartSchema.partial().extend({
            cart_id: z.string().min(1, "Cart ID wajib diisi"),
            new_quantity: z.number().min(1, "Quantity minimal 1"),
        });
    }

    // MODE TAMBAH (Default):
    return baseCartSchema;
};

// 2. Cara mendapatkan Tipe yang akurat
// Kita ambil inferensi dari masing-masing kemungkinan
type AddCartType = z.infer<typeof baseCartSchema>;
type EditCartType = z.infer<ReturnType<typeof getCartSchema>>; // Ini akan mengambil versi terluas

// Gabungkan dalam satu Type Alias agar fleksibel di komponen
export type CartFormData = AddCartType & Partial<EditCartType>;