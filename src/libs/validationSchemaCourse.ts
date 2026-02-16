
import { z } from 'zod';

// Konfigurasi sesuai Backend Go
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Contoh: 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const baseCourseSchema = z.object({
    // --- BAB 1: INFORMASI DASAR ---
    // id: z.string().min(1, "ID wajib diisi"),
    // image: z.any().optional().or(z.literal("")),
    name: z.string().min(1, "Nama wajib diisi"),
    slug: z.string().optional().or(z.literal("")),
    title: z.string().optional().or(z.literal("")), // Tambahkan ini
    description: z.string().optional().or(z.literal("")),

    // --- BAB 2: DETAIL KURSUS & MEDIA ---
    category_id: z.string().optional().or(z.literal("")),
    course_level_id: z.string().optional().or(z.literal("")),
    course_language_id: z.string().optional().or(z.literal("")),
    duration: z.string().optional().or(z.literal("")),
    timezone: z.string().optional().or(z.literal("")),
    thumbnail: z.string().optional().or(z.literal("")),
    demo_video_storage: z.string().optional().or(z.literal("")),
    demo_video_source: z.string().optional().or(z.literal("")),

    // --- BAB 3: HARGA & KAPASITAS ---
    price: z.string().optional().or(z.literal("")),
    discount: z.string().optional().or(z.literal("")),
    capacity: z.any().optional().or(z.literal("")),

    // --- BAB 4: PENGATURAN & REVIEW ---
    address: z.string().optional().or(z.literal("")),
    seo_description: z.string().optional().or(z.literal("")),
    certificate: z.string().optional().or(z.literal("")),
    message_for_reviewer: z.string().optional().or(z.literal("")),
    instructor_id: z.string().optional().or(z.literal("")),
    status: z.string().optional().or(z.literal("")),
    is_approved: z.string().optional().or(z.literal("")),
});

export const getCourseSchema = (isEdit: boolean) => {
    return baseCourseSchema.extend({
        image: z
            .any()
            .refine((files) => {
                // Jika mode Create, wajib ada file
                if (!isEdit) {
                    return files instanceof FileList && files.length > 0;
                }
                return true;
            }, "Gambar wajib diunggah")
            .refine((files) => {
                // Validasi ukuran jika user input file baru
                if (files instanceof FileList && files.length > 0) {
                    return files[0].size <= MAX_FILE_SIZE;
                }
                return true;
            }, "Maksimal 5MB")
            .refine((files) => {
                // Validasi tipe jika user input file baru
                if (files instanceof FileList && files.length > 0) {
                    return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
                }
                return true;
            }, "Format tidak didukung"),
    });
};



export type CourseFormData = z.infer<ReturnType<typeof getCourseSchema>>;