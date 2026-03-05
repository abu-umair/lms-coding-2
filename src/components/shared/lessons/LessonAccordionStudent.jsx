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
                      className={`py-4 flex items-center justify-between flex-wrap border-b border-borderColor last:border-none ${activeLessonId === lesson.id ? "bg-lightGreyColor" : ""}`}
                    >
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-video-alt mr-10px"></i>
                          <button
                            //* Klik untuk mengganti video yang aktif
                            onClick={() => onSelectLesson(lesson)}
                            className={`font-medium text-left hover:text-primaryColor transition-colors ${activeLessonId === lesson.id ? "text-primaryColor" : "text-contentColor"}`}
                          >
                            {lesson.title}
                          </button>
                        </h4>
                      </div>
                      <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                        {/* //* Durasi dinamis */}
                        <p className="font-semibold">{lesson.duration || "0:00"}</p>
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
