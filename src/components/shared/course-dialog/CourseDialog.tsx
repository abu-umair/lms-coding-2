// CourseDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import LessonAccordionShadcn from "@/components/shared/lessons/LessonAccordionShadcn";
import lessons from "@/../public/fakedata/lessons.json";


interface CourseDialogProps {
    id: number;
    trigger: ReactNode; // Untuk menerima button dari luar
    title: string;
}

export const CourseDialog = ({ trigger, title, id: id1 }: CourseDialogProps) => {
    // 1. Cari data secara eksplisit
    const foundLesson = lessons?.find((lesson) => lesson.id === id1);

    // 2. Gunakan ID dari hasil pencarian, atau gunakan id1 langsung jika data tidak ketemu
    const activeId = foundLesson?.id || id1 || 1;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-whiteColor dark:bg-whiteColor-dark">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* TEMPAT CRUD / FORM ANDA */}
                <div className="py-4">
                    <div className="xl:col-start-1 xl:col-span-4" >
                        curriculum
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};