// CourseDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import FormInput from "@/components/shared/form-input/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChapterFormData, getChapterSchema } from "@/libs/validationSchemaChapter";
import { useForm } from "react-hook-form";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getCourseChapterClient } from "@/api/grpc/client";
import toast from "react-hot-toast";



interface CourseDialogProps {
    id?: number;
    instructorId: string;
    courseId: string;
    trigger: ReactNode; // Untuk menerima button dari luar
    title: string;
}



export const CourseDialog = ({ trigger, title, id: id1, instructorId, courseId }: CourseDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { callApi, isLoading } = useGrpcApi();


    const isEditMode = false;

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ChapterFormData>({
        resolver: zodResolver(getChapterSchema(isEditMode)) as any,
        defaultValues: {
            // instructor_id: "11",
            title: "",
            // order_chapter: "1",
            status: "",
        }
    });

    const onSubmit = async (values: ChapterFormData) => {
        console.log(values);
        const chapterPayload = {
            id: "",
            instructorId: instructorId,
            courseId: courseId,
            orderChapter: 1,
            title: values.title,
            status: "",
        };
        await callApi(
            getCourseChapterClient().createCourseChapter(chapterPayload),
            {
                loadingMessage: "Memperbarui chapter...",
                successMessage: "Chapter berhasil diperbarui!",
                onSuccess: () => {
                    reset(),
                        setOpen(false); // Menutup Dialog
                },
                useDefaultError: false,
                defaultError: (res) => {
                    console.log(res);

                    toast.error("Gagal menambah chapter.");
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