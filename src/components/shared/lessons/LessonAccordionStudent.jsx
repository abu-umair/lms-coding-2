"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getWatchHistoryClient } from "@/api/grpc/client";
import useGrpcApi from "@/components/shared/others/useGrpcApi";


const LessonAccordionStudent = ({ chapters = [], onSelectLesson, activeLesson, history, onToggleManual }) => {
  const { callApi, isLoading } = useGrpcApi();

  // Simpan index chapter yang terbuka (default: chapter dari activeLesson)
  const initialOpenIndex = useMemo(() => {
    const idx = chapters.findIndex(ch => ch.id === activeLesson?.chapterId);
    return idx !== -1 ? idx : 0;
  }, [chapters, activeLesson?.chapterId]);

  const [openIndex, setOpenIndex] = useState(initialOpenIndex);

  useEffect(() => {
    if (activeLesson) {
      // Gunakan chapter_id atau chapterId sesuai data JSON Anda
      const activeChapterId = activeLesson.chapterId;
      const idx = chapters.findIndex(ch => ch.id === activeChapterId);

      if (idx !== -1) {
        setOpenIndex(idx);
      }
    }
  }, [activeLesson, chapters]);
  // Ambil list ID lesson yang sudah selesai
  // 1. Buat "Kamus" history agar pencarian instan O(1)
  const historyMap = useMemo(() => {
    console.log(history);

    const map = {};
    history?.watchedLessonId?.forEach(h => {
      map[h.lessonId] = h; // Simpan seluruh objek history berdasarkan lessonId
    });
    return map;
  }, [history]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  console.log(history);
  console.log(initialOpenIndex);
  // console.log(completedLessonIds);

  const handleTouchLesson = async (lesson) => {
    console.log(lesson.id);

    try {
      // update_at di update
      await callApi(getWatchHistoryClient().editWatchHistory({
        lessonId: lesson.id,
        courseId: lesson.courseId,
        chapterId: lesson.chapterId
      }));
    } catch (err) {
      console.error("Gagal update timestamp:", err);
    }
  };

  return (
    <ul className="curriculum">
      {/* HEADER PROGRESS */}
      <div className="mb-4 p-3 bg-lightGreyColor rounded-md border border-borderColor/50">
        <p className="text-sm font-bold text-primaryColor">
          Progres: {history?.lessonCount || 0} Pelajaran Selesai
        </p>
      </div>

      {chapters.map((chapter, index) => {
        const isOpen = openIndex === index;
        const isChapterActive = chapter.id === activeLesson?.chapterId;

        return (
          // <li key={chapter.id || index} className={`accordion mb-25px overflow-hidden ${isOpen ? "active" : ""}`}>
          <li key={chapter.id || index} className={`accordion mb-25px overflow-hidden `}>
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md shadow-sm">

              {/* CONTROLLER */}
              <div
                onClick={() => toggleAccordion(index)}
                className={`accordion-controller cursor-pointer flex justify-between items-center px-5 py-18px transition-colors ${isChapterActive ? "bg-blue-50/50" : ""
                  }`}
              >
                <span className={`text-xl font-bold font-hind leading-[20px] ${isOpen ? "text-primaryColor" : "text-headingColor dark:text-headingColor-dark"
                  }`}>
                  {chapter.title}
                </span>

                {/* SVG Icon dengan Rotasi Dinamis */}
                <span className={`transition-all duration-500 transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                  <svg width="20" viewBox="0 0 16 16" fill={isOpen ? "#0c63e4" : "#212529"}>
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                  </svg>
                </span>
              </div>

              {/* CONTENT - CSS Grid Transition (Murni CSS, Tidak butuh JS Tinggi) */}
              <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}>
                <div className="overflow-hidden">
                  <div className="content-wrapper  border-t border-borderColor/50">
                    <ul className="list-none p-0">
                      {chapter.lessons?.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const hData = historyMap[lesson.id];
                        // isWatched hanya TRUE jika data ada DAN field is_completed bernilai "true"
                        const isWatched = hData?.isCompleted === "true" || hData?.isCompleted === true;
                        const watchHistoryId = hData?.id;



                        return (
                          <li
                            key={lesson.id}
                            className={`group py-15px p-10px md:px-30px flex items-center justify-between gap-4 border-b border-borderColor last:border-none transition-all duration-300 rounded-md my-1 ${isActive ? "bg-blue-50 dark:bg-slate-800" : " hover:bg-gray-50 dark:hover:bg-slate-900 "
                              }`}
                          >
                            <div className="flex items-center flex-grow min-w-0">
                              <button
                                onClick={() => {
                                  // 1. Jalankan fungsi select lesson bawaan (untuk ganti video di UI)
                                  onSelectLesson(lesson);

                                  // 2. Jalankan fungsi update timestamp ke Backend
                                  handleTouchLesson(lesson);
                                }}
                                className="flex items-start gap-3 w-full text-left"
                              >
                                <i className={`icofont-video-alt mt-1  ${isActive ? "text-primaryColor" : "text-gray-400"
                                  }`}></i>

                                <div className="overflow-hidden">
                                  <h4 className={`capitalize text-base font-medium leading-snug truncate ${isActive ? "text-primaryColor" : "text-headingColor dark:text-headingColor-dark"
                                    }`}>
                                    {lesson.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                                    <i className="icofont-clock-time"></i>
                                    <span>{lesson.duration || "0"} menit</span>
                                  </div>
                                </div>
                              </button>
                            </div>

                            {/* CHECKBOX PROGRESS */}
                            <div className="flex items-center pl-4 border-l border-borderColor2 dark:border-borderColor/50 ">
                              <input
                                type="checkbox"
                                // defaultChecked={isWatched} //?hanya UI saja
                                checked={isWatched} //? jika sudah integraasi di DB
                                // onChange={(e) => handleCheckboxClick(e, lesson)}
                                // readOnly
                                onChange={() => {
                                  // Hanya jalankan jika belum tercentang
                                  // if (!isWatched) {
                                  onToggleManual(lesson, isWatched, watchHistoryId);
                                  // }
                                }}
                                className="w-5 h-5 cursor-pointer accent-primaryColor transition-transform hover:scale-110"
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default LessonAccordionStudent;