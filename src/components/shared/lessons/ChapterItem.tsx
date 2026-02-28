"use client";
import React, { useEffect, useState } from "react";
import { Grip, PencilLine, Trash, CopyPlus } from "lucide-react";
import { CourseDialog } from "@/components/shared/course-dialog/CourseDialog";
import Link from "next/link";
import LessonItem from "./LessonItem";
import { CourseDialogLesson } from "../course-dialog/CourseDialogLesson";
import { getChapterLessonClient } from "@/api/grpc/client";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


interface getLessons {
    id?: string;
    title?: string;
    orderLesson?: number;
}

const ChapterItem = ({
    chapter,
    index,
    isOpen,
    toggleAccordion,
    isInputCourse,
    instructorId,
    courseId,
    onDelete,
    onSuccessAdd,
}) => {
    const { callApi, isLoading } = useGrpcApi();
    const [lessons, setLessons] = useState<getLessons[]>([]);
    const [lastOrder, setLastOrder] = useState(0);

    const chapterId = chapter.id;





    // fetchLesson
    const fetchLesson = async () => {
        await callApi(getChapterLessonClient().getAllChapterLesson({
            chapterId: chapterId,
            // Implementasi field_mask sesuai input Postman Anda
            fieldMask: {
                paths: [
                    "title",
                    "order_lesson",
                    "instructor_id",
                    "course_id",
                    "chapter_id",
                    "slug",
                    "description",
                    "file_path",
                    "storage_lesson",
                    "lesson_type",
                    "volume",
                    "duration",
                    "file_type",
                    "downloadable",
                    "is_preview",
                    "status"
                ]
            }
        }),
            {
                loadingMessage: "Mengambil data lesson...",
                onSuccess: (res) => {
                    const data = res.response.lessons || [];
                    console.log(data);

                    setLessons(data as getLessons[]);
                    // MENCARI ORDER TERTINGGI
                    if (data.length > 0) {
                        const orders = data.map((c: any) => {
                            // Coba ambil dari order_lesson atau orderLesson (tergantung respons gRPC)
                            const val = c.order_lesson || c.orderLesson || 0;
                            return Number(val);
                        });

                        const maxOrder = Math.max(...orders);
                        console.log(maxOrder);

                        setLastOrder(maxOrder);
                    } else {
                        setLastOrder(0);
                    }

                },
                useDefaultError: true,
            }
        );
    };

    useEffect(() => {
        if (chapterId) {
            console.log(chapterId);

            fetchLesson();
        }


    }, [chapterId]);

    // --- LOGIKA DRAG END UNTUK LESSON ---
    const onLessonDragEnd = async (result: any) => {
        if (!result.destination) return;

        // 1. Optimistic Update UI
        const reorderedLessons = Array.from(lessons);
        const [removed] = reorderedLessons.splice(result.source.index, 1);
        reorderedLessons.splice(result.destination.index, 0, removed);

        setLessons(reorderedLessons);

        // 2. Update ke Database (Iterasi dan edit order)
        try {
            for (let i = 0; i < reorderedLessons.length; i++) {
                const lesson = reorderedLessons[i];
                const newOrder = i + 1;

                // Hanya panggil API jika urutan berubah
                if (lesson.orderLesson !== newOrder) {
                    await callApi(getChapterLessonClient().editChapterLesson({
                        id: lesson.id,
                        chapterId: chapterId,
                        courseId: courseId,
                        instructorId: instructorId,
                        title: lesson.title,
                        orderLesson: newOrder,
                        // Masukkan field lain yang wajib ada di payload edit Anda
                    }), {
                        useDefaultError: false,
                        // Tampilkan loading hanya pada item pertama agar tidak spam toast
                        loadingMessage: i === 0 ? "Menyimpan urutan lesson..." : undefined,
                        onSuccess: () => {
                            if (i === reorderedLessons.length - 1) fetchLesson();
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui urutan lesson");
            fetchLesson(); // Rollback jika gagal
        }
    };


    // delete lesson
    const handleDeleteLesson = (lessonId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-headingColor">Hapus Lesson?</p>
                    <p className="text-xs text-contentColor">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-all shadow-sm"
                        disabled={isLoading}
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await callApi(getChapterLessonClient().deleteChapterLesson({ id: lessonId }), {
                                loadingMessage: "Menghapus lesson...",
                                successMessage: "Lesson berhasil dihapus!",
                                onSuccess: () => { fetchLesson() },
                            });
                        }}
                    >
                        {isLoading ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-xs px-3 py-1.5 border border-borderColor rounded hover:bg-gray-100 transition-all"
                    >
                        Batal
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    return (
        <Draggable
            key={chapter.id.toString()}
            draggableId={chapter.id.toString()}
            index={index}
            isDragDisabled={!isInputCourse}
        >
            {(provided, snapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`accordion mb-25px overflow-hidden ${isOpen ? "active" : ""} ${snapshot.isDragging ? "shadow-2xl z-50" : ""
                        }`}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">

                        {/* CONTROLLER (Area klik untuk buka/tutup accordion) */}
                        <div
                            onClick={() => toggleAccordion(index)}
                            className="accordion-controller cursor-pointer flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]"
                        >
                            <span>{chapter.title || `Chapter #${index + 1}`}</span>

                            <div className="flex items-center space-x-3">
                                {isInputCourse && (
                                    <div
                                        className="flex space-x-2 bg-primaryColor text-whiteColor text-sm rounded py-0.5 px-0.5"
                                        onClick={(e) => e.stopPropagation()} // Mencegah accordion terpicu saat klik tombol aksi
                                    >
                                        {/* Pegangan Drag */}
                                        <div
                                            {...provided.dragHandleProps}
                                            className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all cursor-grab active:cursor-grabbing"
                                        >
                                            <Grip size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                        </div>

                                        {/* Tombol Edit */}
                                        <CourseDialog
                                            instructorId={instructorId}
                                            courseId={courseId}
                                            title="Edit Lesson"
                                            initialData={chapter}
                                            onSuccessAdd={onSuccessAdd}
                                            trigger={
                                                <button
                                                    type="button"
                                                    className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"
                                                >
                                                    <PencilLine size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                                </button>
                                            }
                                        />

                                        {/* Tombol Delete */}
                                        <button
                                            type="button"
                                            onClick={() => onDelete(chapter.id)}
                                            className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"
                                        >
                                            <Trash size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                        </button>
                                    </div>
                                )}

                                {/* Icon Panah Panah */}
                                <span className={`transition-all duration-500 transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                                    <svg
                                        width="20"
                                        viewBox="0 0 16 16"
                                        style={{
                                            fill: isOpen ? "#0c63e4" : "#212529",
                                            transition: "fill 0.5s ease",
                                        }}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* CONTENT (Daftar Lesson) */}
                        <div
                            className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="content-wrapper p-10px md:px-30px border-t border-borderColor dark:border-borderColor-dark">
                                    {isInputCourse && (
                                        <div className="mb-4 flex justify-end">
                                            <CourseDialogLesson
                                                id={1}//?bisa dengan param
                                                instructorId={instructorId}
                                                courseId={courseId}
                                                title="Tambah Lesson Baru"
                                                chapterId={chapter.id}
                                                onSuccessLessonAdd={fetchLesson} // fungsi refresh ke sini
                                                nextOrder={lastOrder + 1}
                                                trigger={
                                                    <span className="cursor-pointer flex items-center space-x-2 text-size-15 text-whiteColor bg-primaryColor px-3 py-1 border border-primaryColor hover:text-primaryColor hover:bg-whiteColor rounded transition-all">
                                                        <CopyPlus size={14} strokeWidth={2.5} />
                                                        <span>New Lesson</span>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    )}

                                    <DragDropContext onDragEnd={onLessonDragEnd}>
                                        <Droppable droppableId={`lessons-${chapterId}`}>
                                            {(provided) => (
                                                <ul
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {lessons?.length > 0 ? (
                                                        lessons.map((lesson, idx) => (
                                                            <LessonItem
                                                                key={lesson.id} // Gunakan ID unik
                                                                index={idx}
                                                                isInputCourse={isInputCourse}
                                                                initialData={lesson}
                                                                onSuccessLessonAdd={fetchLesson}
                                                                courseId={courseId}
                                                                chapterId={chapter.id}
                                                                instructorId={instructorId}
                                                                onDelete={handleDeleteLesson}
                                                            />
                                                        ))
                                                    ) : (
                                                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark last:border-b-0">
                                                            <div className="flex items-center">
                                                                <span className="font-semibold text-sm">No Lessons</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default ChapterItem;