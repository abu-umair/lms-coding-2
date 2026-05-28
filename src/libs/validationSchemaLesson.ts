
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB dalam satuan Bytes
const ALLOWED_MIME_TYPES = ["application/pdf", "text/plain"];

export const baseLessonSchema = z.object({
    // instructor_id: z.string().min(1, "Instructor ID wajib diisi").optional().or(z.literal("")),
    title: z.string().min(1, "Title wajib diisi"),
    // order_Lesson: z.string().min(1, "Order Lesson wajib diisi").optional().or(z.literal("")),
});

export const getLessonSchema = (isEdit: boolean) => {
    return baseLessonSchema.extend({
        slug: z.string().min(1, "Slug diisi"),
        description: z.string().min(1, "description diisi"),
        pages: z.any().optional().or(z.literal("")),
        storage_lesson: z.string().optional(),
        file_path: z
            .any() // Gunakan z.any() terlebih dahulu agar bisa menerima FileList ataupun String (data lama)
            .optional()
            .nullable()
            .refine(
                (files) => {
                    // Jika tidak ada file, atau datanya berupa string (data dari DB), lolos validasi tipe berkas
                    if (!files || typeof files === "string" || files.length === 0) return true;
                    if (files instanceof FileList) {
                        return ALLOWED_MIME_TYPES.includes(files[0]?.type);
                    }
                    return true;
                },
                {
                    message: "Format file tidak didukung! Hanya diperbolehkan file .pdf dan .txt",
                }
            )
            .refine(
                (files) => {
                    // Jika tidak ada file, atau datanya berupa string (data dari DB), lolos validasi ukuran
                    if (!files || typeof files === "string" || files.length === 0) return true;
                    if (files instanceof FileList) {
                        return files[0]?.size <= MAX_FILE_SIZE;
                    }
                    return true;
                },
                {
                    message: "Ukuran file terlalu besar! Maksimal diperbolehkan 5MB",
                }
            ),
        lesson_type: z.enum(["video", "document"]),
        duration: z.any().optional().or(z.literal("")),
        is_preview: z.any().optional().or(z.literal("")),
        // status: z.any().optional().or(z.literal("")),

    });
};

export type LessonFormData = z.infer<ReturnType<typeof getLessonSchema>>;