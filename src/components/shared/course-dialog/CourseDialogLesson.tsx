// CourseDialogLesson.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import FormInput from "@/components/shared/form-input/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonFormData, getLessonSchema } from "@/libs/validationSchemaLesson";
import { useForm } from "react-hook-form";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getChapterLessonClient } from "@/api/grpc/client";
import toast from "react-hot-toast";



interface CourseDialogLessonProps {
    id?: number;
    instructorId?: string;
    courseId: string;
    chapterId?: string;
    trigger: ReactNode; // Untuk menerima button dari luar
    title?: string;
    onSuccessLessonAdd?: () => void;
    initialData?: any; // Gunakan objek lesson jika ada
    nextOrder?: number;
}



export const CourseDialogLesson = ({ trigger, title, id: id1, instructorId, courseId, chapterId, onSuccessLessonAdd, initialData, nextOrder }: CourseDialogLessonProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { callApi, isLoading } = useGrpcApi();


    const isEditMode = !!initialData?.id;

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LessonFormData>({
        resolver: zodResolver(getLessonSchema(isEditMode)) as any,
        defaultValues: {
            // instructor_id: "11",
            title: "",
            // order_lesson: "1",
            // status: "",
        }
    });

    useEffect(() => {
        if (open) {
            if (isEditMode) {
                console.log(initialData);

                setValue("title", initialData.title);
                // Set values lainnya jika ada
            } else {
                reset({
                    title: "",
                    // status: "active"
                }); // Reset jika mode tambah
            }
        }
    }, [open, isEditMode, initialData, setValue, reset]);

    const onSubmit = async (values: LessonFormData) => {
        console.log(values);
        console.log(instructorId);
        console.log(courseId);
        console.log(initialData);
        console.log('chapter' + chapterId);

        const finalOrder = isEditMode
            ? initialData.orderLesson
            : nextOrder;

        const lessonPayload = {
            id: isEditMode ? initialData.id : "",
            instructorId: instructorId,
            // courseId: courseId,
            chapterId: chapterId,
            // Pastikan nilainya adalah Number agar tidak error di writer.int32
            orderLesson: Number(finalOrder) || 0,
            title: values.title,
            // status: "",
        };

        const apiCall = isEditMode
            ? (getChapterLessonClient().editChapterLesson(lessonPayload) as any)
            : getChapterLessonClient().createChapterLesson(lessonPayload);


        await callApi(
            apiCall,
            {
                loadingMessage: "Memperbarui lesson...",
                successMessage: "Lesson berhasil diperbarui!",
                onSuccess: () => {
                    reset(),
                        setOpen(false); // Menutup Dialog
                    if (onSuccessLessonAdd) onSuccessLessonAdd(); // 2. Trigger auto-update di parent
                },
                useDefaultError: false,
                defaultError: (res) => {
                    console.log(res);

                    toast.error("Gagal memperbarui lesson.");
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] md:max-w-[50vw] max-h-[90vh] overflow-y-auto bg-whiteColor dark:bg-whiteColor-dark">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* TEMPAT CRUD / FORM ANDA */}
                <div className="py-4">
                    <div className="xl:col-start-1 xl:col-span-4" >
                        <form
                            onSubmit={handleSubmit(onSubmit, (err) => console.log("Validasi Gagal:", err))}
                            className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
                        // data-aos="fade-up"
                        >
                            <div className="grid grid-cols-1 mb-15px gap-15px">
                                <div>
                                    <FormInput
                                        label="Title Course"
                                        name="title"
                                        type="text"
                                        placeholder="Masukkan Title Course"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                        isInputCourse={true}
                                        lableRequired={true}
                                    />
                                </div>
                                <div>
                                    <div className="mb-3 block">
                                        Example: Membuat Login Dengan React JS
                                    </div>
                                </div>
                            </div>
                            <div className="mt-15px">
                                <ButtonPrimary
                                    type={"submit"}
                                    disabled={isLoading}

                                >
                                    {isLoading ? 'Sedang Memproses..' : 'Update Chapter'}
                                </ButtonPrimary>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};