
import { z } from 'zod';


export const baseChapterSchema = z.object({
    // instructor_id: z.string().min(1, "Instructor ID wajib diisi").optional().or(z.literal("")),
    title: z.string().min(1, "Title wajib diisi"),
    // order_chapter: z.string().min(1, "Order Chapter wajib diisi").optional().or(z.literal("")),
});

export const getChapterSchema = (isEdit: boolean) => {
    return baseChapterSchema.extend({
        status: z.any().optional().or(z.literal("")),

    });
};

export type ChapterFormData = z.infer<ReturnType<typeof getChapterSchema>>;