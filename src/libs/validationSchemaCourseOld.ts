
import { z } from 'zod';

// Konfigurasi sesuai Backend Go
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Contoh: 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const CourseSchemaOld = z.object({
    // --- BAB 1: INFORMASI DASAR ---
    id: z.string().min(1, "ID wajib diisi").max(255),
    name: z.string().min(1, "Nama wajib diisi").max(255),
    image: z
        .any(),
    // .refine((file) => file instanceof File, "Gambar wajib diunggah")
    // .refine((file) => file?.size <= MAX_FILE_SIZE, `Ukuran maksimal adalah 5MB.`)
    // .refine(
    //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //     "Format tidak didukung. Gunakan jpg, jpeg, png, atau webp."
    // )
    // .refine((file) => {
    //     const ext = file?.name ? file.name.substring(file.name.lastIndexOf(".")).toLowerCase() : "";
    //     return ACCEPTED_EXTENSIONS.includes(ext);
    // }, "Ekstensi file tidak valid."),
    slug: z.string().max(255).nullable().or(z.literal("")),
    title: z.string().max(255).nullable().or(z.literal("")),
    description: z.string().max(1000, "Deskripsi terlalu panjang").nullable().or(z.literal("")),

    // --- BAB 2: DETAIL KURSUS & MEDIA ---
    category_id: z.string().max(255).nullable().or(z.literal("")),
    course_level_id: z.string().max(255).nullable().or(z.literal("")),
    course_language_id: z.string().max(255).nullable().or(z.literal("")),
    duration: z.string().max(255).nullable().or(z.literal("")),
    timezone: z.string().max(255).nullable().or(z.literal("")),
    thumbnail: z.string().max(255).nullable().or(z.literal("")),
    demo_video_storage: z.string().max(255).nullable().or(z.literal("")),
    demo_video_source: z.string().max(255).nullable().or(z.literal("")),

    // --- BAB 3: HARGA & KAPASITAS ---
    // Mengikuti pattern regex proto: "^[0-9]+(\\.[0-9]{1,2})?$"
    price: z.string()
        .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Format harga tidak valid (contoh: 100.00)")
        .nullable().or(z.literal("")),
    discount: z.string()
        .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Format diskon tidak valid")
        .nullable().or(z.literal("")),
    capacity: z.string(),

    // --- BAB 4: PENGATURAN & REVIEW ---
    address: z.string().max(1000).min(1, "Alamat diisi").nullable().or(z.literal("")),
    seo_description: z.string().max(255).nullable().or(z.literal("")),
    certificate: z.string().max(255).nullable().or(z.literal("")),
    message_for_reviewer: z.string().max(255).nullable().or(z.literal("")),
    instructor_id: z.string().max(255).nullable().or(z.literal("")),

    // Status (Biasanya diatur sistem, tapi tetap dimasukkan jika perlu input)
    status: z.string().max(255).nullable().or(z.literal("")),
    is_approved: z.string().max(255).nullable().or(z.literal("")),
});




export type CourseFormDataold = z.infer<typeof CourseSchemaOld>;