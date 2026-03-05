"use client";
import accordions from "@/libs/accordions";
import Link from "next/link";
import React, { useEffect } from "react";

const LessonAccordionStudent = ({ chapters, onSelectLesson, activeLessonId }) => {
  useEffect(() => {
    //* Inisialisasi ulang fungsi accordion agar bisa diklik setelah data render
    accordions();
  }, [chapters]);

  return (
    <ul className="accordion-container curriculum">
      {/* //* Looping Chapter Dinamis */}
      {chapters?.map((chapter, index) => (
        <li key={chapter.id} className={`accordion mb-25px overflow-hidden ${index === 0 ? "active" : ""}`}>
          <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md">
            {/* controller */}
            <div>
              <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                <span>{chapter.title}</span>
                <svg className="transition-all duration-500 rotate-0" width="20" viewBox="0 0 16 16" fill="#212529">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                </svg>
              </button>
            </div>

            {/* content */}
            <div className="accordion-content transition-all duration-500">
              <div className="content-wrapper p-10px md:px-30px">
                <ul>
                  {/* //* Looping Lesson Dinamis di dalam Chapter */}
                  {chapter.lessons?.map((lesson) => (
                    <li
                      key={lesson.id}
                      className={`group py-15px px-20px flex items-center justify-between gap-4 border-b border-borderColor last:border-none transition-all duration-300
    ${activeLessonId === lesson.id ? "bg-blue-50 dark:bg-slate-800" : "hover:bg-gray-50 dark:hover:bg-slate-900"}`}
                    >
                      <div className="flex items-center flex-grow min-w-0">
                        <button
                          onClick={() => onSelectLesson(lesson)}
                          className="flex items-start gap-3 w-full text-left transition-colors"
                        >
                          {/* Icon Video dengan warna aksen saat aktif */}
                          <i className={`icofont-video-alt text-lg mt-1 ${activeLessonId === lesson.id ? "text-primaryColor" : "text-gray-400"}`}></i>

                          <div className="overflow-hidden">
                            <h4 className={`text-base font-medium leading-snug truncate ${activeLessonId === lesson.id ? "text-primaryColor" : "text-headingColor dark:text-headingColor-dark"}`}>
                              {lesson.title}
                            </h4>

                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                              <i className="icofont-clock-time text-xs"></i>
                              <p className="text-xs font-light">{lesson.duration || "0"} menit</p>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Checkbox Section dengan pemisah visual yang halus */}
                      <div className="flex items-center pl-4 border-l border-borderColor/50">
                        <input
                          type="checkbox"
                          // Menggunakan checked berdasarkan data dari backend
                          // checked={lesson.is_completed}
                          // onChange={() => onToggleComplete(lesson)}
                          className="w-5 h-5 cursor-pointer accent-primaryColor transition-transform hover:scale-110"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LessonAccordionStudent;
