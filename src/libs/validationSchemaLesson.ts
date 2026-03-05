
import { z } from 'zod';


export const baseLessonSchema = z.object({
    // instructor_id: z.string().min(1, "Instructor ID wajib diisi").optional().or(z.literal("")),
    title: z.string().min(1, "Title wajib diisi"),
    // order_Lesson: z.string().min(1, "Order Lesson wajib diisi").optional().or(z.literal("")),
});

export const getLessonSchema = (isEdit: boolean) => {
    return baseLessonSchema.extend({
        slug: z.string().min(1, "Slug diisi"),
        description: z.string().min(1, "description diisi"),
        storage_lesson: z.string().min(1, "storage lesson diisi"),
        duration: z.any().optional().or(z.literal("")),
        is_preview: z.any().optional().or(z.literal("")),
        // status: z.any().optional().or(z.literal("")),

    });
};

export type LessonFormData = z.infer<ReturnType<typeof getLessonSchema>>;