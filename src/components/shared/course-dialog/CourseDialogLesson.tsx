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
import axios from "axios";



interface CourseDialogLessonProps {
    id?: number;
    instructorId?: string;
    courseId: string;
    chapterId?: string;
    trigger: ReactNode; // Untuk menerima button dari luar
    title?: string;
    description?: string;
    storage_lesson?: string;
    file_path?: string;
    lesson_type?: string;
    // duration?: string;
    is_preview?: number;
    onSuccessLessonAdd?: () => void;
    initialData?: any; // Gunakan objek lesson jika ada
    nextOrder?: number;
}

const isPreviewOptions = [
    { value: '0', label: "No" },
    { value: '1', label: "Yes" },
];

interface uploadFileResponse {
    course_id?: string;
    lesson_id?: string;
    file_name: string;
    message: string;
    success: boolean;
}


export const CourseDialogLesson = ({ trigger, title, id: id1, instructorId, courseId, chapterId, onSuccessLessonAdd, initialData, nextOrder }: CourseDialogLessonProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const { callApi, isLoading } = useGrpcApi();
    // const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);

    const GoGrpc_API_URL = process.env.NEXT_PUBLIC_GRPC_FIBER;



    const isEditMode = !!initialData?.id;

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<LessonFormData>({

        resolver: zodResolver(getLessonSchema(isEditMode)) as any,
        defaultValues: {
            // instructor_id: "11",
            title: "",
            slug: "",
            description: "",
            storage_lesson: "",
            file_path: null,
            lesson_type: "video",
            duration: null,
            is_preview: null,
            // status: "",
        }
    });

    const lessonType = watch("lesson_type");
    const watchDocument = watch("file_path");

    useEffect(() => {
        if (open) {
            if (isEditMode) {
                console.log(initialData);

                setValue("title", initialData.title);
                setValue("slug", initialData.slug);
                setValue("description", initialData.description);
                setValue("storage_lesson", initialData.storageLesson);
                setValue("file_path", initialData.filePath);
                setValue("duration", initialData.duration);
                setValue("is_preview", initialData.isPreview);
                setValue("lesson_type", initialData.lessonType);
                // Set values lainnya jika ada
            } else {
                reset({
                    title: "",
                    slug: "",
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

        let finalDocumentFileName = "";
        let currentLessonId = initialData?.id;

        if (values.file_path && values.file_path[0] instanceof File && values.storage_lesson) {
            toast.error("File dan storage lesson ada datanya, Mohon dipilih salah satu saja");
            return
        }

        if (values.file_path && values.file_path[0] instanceof File) {
            // ADA FILE BARU: Upload ke server
            const formData = new FormData();
            formData.append('document', values.file_path[0]);
            formData.append('course_id', courseId);
            if (initialData?.id) {
                formData.append('lesson_id', initialData.id);
            }

            console.log(formData);

            const toastId = toast.loading("wait...");
            const uploadResponse = await axios.post<uploadFileResponse>(`${GoGrpc_API_URL}/course/upload/lesson/document`, formData);
            toast.dismiss(toastId);

            if (uploadResponse.status !== 200) {
                toast.error("Upload File Gagal");

                return
            }

            finalDocumentFileName = uploadResponse.data.file_name;
            currentLessonId = uploadResponse.data.lesson_id || initialData.id;
        }
        else {
            if (values.storage_lesson && !isEditMode) {
                currentLessonId = crypto.randomUUID();
            }

        }

        console.log(currentLessonId);
        console.log(finalDocumentFileName);

        const finalOrder = isEditMode
            ? initialData.orderLesson
            : nextOrder;

        const lessonPayload = {
            id: isEditMode ? initialData.id : currentLessonId,
            instructorId: instructorId,
            courseId: courseId,
            chapterId: chapterId,
            // Pastikan nilainya adalah Number agar tidak error di writer.int32
            orderLesson: Number(finalOrder) || 0,
            title: values.title,
            slug: values.slug,
            description: values.description,
            storageLesson: values.storage_lesson,
            filePath: finalDocumentFileName || "",
            duration: String(values.duration),
            isPreview: Number(values.is_preview),
            lessonType: values.lesson_type,
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
                            // onSubmit={handleSubmit(onSubmit, (err) => console.log("Validasi Gagal:", err))}
                            onSubmit={handleSubmit(onSubmit)}
                            className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
                        // data-aos="fade-up"
                        >
                            <div className="grid grid-cols-1 mb-15px gap-15px">
                                <div>

                                    <div className="mb-8">
                                        <label className="mb-3 block font-semibold text-blackColor dark:text-blackColor-dark">
                                            Jenis Lesson
                                        </label>

                                        <div className="grid grid-cols-2 gap-4">

                                            {/* VIDEO */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setValue("lesson_type", "video")
                                                    setValue("file_path", null); //Kosongkan file_path jika pilih Video
                                                }}
                                                className={`rounded-2xl border p-5 text-left transition-all 
                                                    ${lessonType === "video"
                                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                                        : "border-gray-200 bg-white"}
                                                        `}>
                                                <div className="text-3xl mb-2">🎥</div>

                                                <h3 className="font-semibold text-lg">
                                                    Video Lesson
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    YouTube, Vimeo, atau video tutorial.
                                                </p>
                                            </button>

                                            {/* DOCUMENT */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setValue("lesson_type", "document")
                                                    setValue("storage_lesson", ""); // Kosongkan video URL jika pilih Dokumen
                                                    setValue("duration", null);     // Kosongkan durasi jika pilih Dokumen
                                                }}
                                                className={`rounded-2xl border p-5 text-left transition-all 
                                                    ${lessonType === "document" ? "border-blue-500 bg-blue-50 shadow-md" :
                                                        "border-gray-200 bg-white"}`}
                                            >
                                                <div className="text-3xl mb-2">📄</div>

                                                <h3 className="font-semibold text-lg">
                                                    Document Lesson
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    PDF, DOCX, atau modul pembelajaran.
                                                </p>
                                            </button>

                                        </div>
                                    </div>
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
                                    <FormInput
                                        label="Slug Course"
                                        name="slug"
                                        type="text"
                                        placeholder="Masukkan Slug Lesson"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                        isInputCourse={true}
                                    />
                                    <FormInput
                                        label="Description"
                                        name="description"
                                        type="editor" // Ubah type menjadi 'editor'
                                        placeholder="Masukkan Description lesson"
                                        register={register}
                                        control={control} // WAJIB dikirim untuk tipe editor
                                        errors={errors}
                                        disabled={isLoading}
                                        isInputCourse={true}
                                    // lableRequired={true}
                                    />


                                    {lessonType === "video" && (
                                        <>
                                            <FormInput
                                                label="Video URL"
                                                name="storage_lesson"
                                                type="text"
                                                placeholder="https://www.youtube.com/watch?....."
                                                register={register}
                                                errors={errors}
                                                disabled={isLoading}
                                                isInputCourse={true}
                                            />

                                            <FormInput
                                                label="Durasi Video"
                                                name="duration"
                                                type="number"
                                                placeholder="Masukkan durasi video dalam menit"
                                                register={register}
                                                errors={errors}
                                                disabled={isLoading}
                                                isInputCourse={true}
                                            />
                                        </>
                                    )}

                                    {lessonType === "document" && (
                                        <>
                                            <FormInput
                                                label="Upload Document"
                                                name="file_path"
                                                type="file"
                                                register={register}
                                                errors={errors}
                                                disabled={isLoading}
                                                isInputCourse={true}

                                                // TAMBAHAN
                                                watchValueFile={watchDocument}
                                                initialFileUrl={initialData?.filePath} // Kirim path file lama dari database ke sini
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                            />

                                            <p className="text-sm text-gray-500 mt-2">
                                                Supported format:
                                                PDF, TXT
                                            </p>
                                        </>
                                    )}

                                    <FormInput
                                        label="Preview Video"
                                        name="is_preview"
                                        type="select"
                                        placeholder="Jadikan Preview Video"
                                        options={isPreviewOptions}
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                        isInputCourse={true}
                                    />

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