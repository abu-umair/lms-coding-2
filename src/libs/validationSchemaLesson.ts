
import { z } from 'zod';


export const baseLessonSchema = z.object({
    // instructor_id: z.string().min(1, "Instructor ID wajib diisi").optional().or(z.literal("")),
    title: z.string().min(1, "Title wajib diisi"),
    // order_Lesson: z.string().min(1, "Order Lesson wajib diisi").optional().or(z.literal("")),
});

export const getLessonSchema = (isEdit: boolean) => {
    return baseLessonSchema.extend({
        status: z.any().optional().or(z.literal("")),

    });
};

export type LessonFormData = z.infer<ReturnType<typeof getLessonSchema>>;