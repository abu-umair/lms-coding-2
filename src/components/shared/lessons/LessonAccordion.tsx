"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { getCourseChapterClient } from "@/api/grpc/client";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import toast from "react-hot-toast";
import ChapterItem from "./ChapterItem";

const LessonAccordion = ({ isInputCourse = false, chapters = [], instructorId, courseId, onSuccessAdd }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [items, setItems] = useState(chapters);
  const { callApi, isLoading } = useGrpcApi();

  // Sinkronisasi data saat prop chapters berubah (misal setelah add/edit/delete)
  useEffect(() => {
    const sortedChapters = [...chapters].sort((a, b) => a.order_chapter - b.order_chapter);
    setItems(sortedChapters);
  }, [chapters]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    // UI Update langsung (Optimistic Update)
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setItems(reorderedItems);

    try {
      for (let i = 0; i < reorderedItems.length; i++) {
        const item = reorderedItems[i];
        const newOrder = i + 1;

        // Hanya tembak API jika urutannya memang berubah
        if (item.order_chapter !== newOrder) {
          const payload = {
            id: item.id,
            instructorId,
            courseId,
            title: item.title,
            orderChapter: newOrder,
            status: item.status,
          };

          await callApi(getCourseChapterClient().editCourseChapter(payload), {
            loadingMessage: i === 0 ? "Menyimpan urutan..." : undefined,
            successMessage: i === reorderedItems.length - 1 ? "Urutan diperbarui!" : undefined,
            useDefaultError: false,
            onSuccess: () => {
              if (i === reorderedItems.length - 1 && onSuccessAdd) onSuccessAdd();
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Gagal memperbarui urutan");
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex flex-col">
          <p className="text-sm font-bold text-headingColor">Hapus Chapter?</p>
          <p className="text-xs text-contentColor">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-all shadow-sm"
            disabled={isLoading}
            onClick={async () => {
              toast.dismiss(t.id);
              await callApi(getCourseChapterClient().deleteCourseChapter({ id: chapterId }), {
                loadingMessage: "Menghapus chapter...",
                successMessage: "Chapter berhasil dihapus!",
                onSuccess: () => { if (onSuccessAdd) onSuccessAdd(); },
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters-list">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="accordion-container curriculum"
          >
            {items.length > 0 ? (
              items.map((chapter, index) => (
                <ChapterItem
                  key={chapter.id} // Sangat penting menggunakan ID asli untuk DND
                  chapter={chapter}
                  index={index}
                  isOpen={openIndex === index}
                  toggleAccordion={toggleAccordion}
                  isInputCourse={isInputCourse}
                  instructorId={instructorId}
                  courseId={courseId}
                  onDelete={handleDeleteChapter}
                  onSuccessAdd={onSuccessAdd}
                />
              ))
            ) : (
              <li className="accordion mb-25px overflow-hidden text-center p-5 border border-dashed border-borderColor rounded">
                <p className="text-contentColor">Belum ada konten topik.</p>
              </li>
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LessonAccordion;