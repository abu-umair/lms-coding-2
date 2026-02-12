
import { z } from 'zod';

// Konfigurasi sesuai Backend Go
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Contoh: 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const CourseSchema = z.object({
    // id: z.string().min(1, "ID wajib diisi"),
    image: z.any().optional().or(z.literal("")),
    name: z.string().min(1, "Nama wajib diisi"),
    slug: z.string().optional().or(z.literal("")),
    title: z.string().optional().or(z.literal("")), // Tambahkan ini
    description: z.string().optional().or(z.literal("")),

    // Field yang belum ada inputnya di UI:
    category_id: z.string().optional().or(z.literal("")),
    course_level_id: z.string().optional().or(z.literal("")),
    course_language_id: z.string().optional().or(z.literal("")),
    duration: z.string().optional().or(z.literal("")),
    timezone: z.string().optional().or(z.literal("")),
    thumbnail: z.string().optional().or(z.literal("")),
    demo_video_storage: z.string().optional().or(z.literal("")),
    demo_video_source: z.string().optional().or(z.literal("")),

    // Untuk angka yang belum ada inputnya:
    price: z.string().optional().or(z.literal("")),
    discount: z.string().optional().or(z.literal("")),
    capacity: z.any().optional().or(z.literal("")),

    address: z.string().optional().or(z.literal("")),
    seo_description: z.string().optional().or(z.literal("")),
    certificate: z.string().optional().or(z.literal("")),
    message_for_reviewer: z.string().optional().or(z.literal("")),
    instructor_id: z.string().optional().or(z.literal("")),
    status: z.string().optional().or(z.literal("")),
    is_approved: z.string().optional().or(z.literal("")),
});




export type CourseFormData = z.infer<typeof CourseSchema>;