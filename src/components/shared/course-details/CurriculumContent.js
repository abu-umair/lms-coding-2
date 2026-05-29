"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDuration } from "@/utils/formatDuration";
import PopupVideoPreview from "../popup/PopupVideoPreview";
import PopupPdfPreview from "../popup/PopupPdfPreview";

const CurriculumContent = ({ chapters }) => {
  // State untuk menyimpan index bab yang sedang terbuka
  // Default: 0 (Bab pertama terbuka otomatis)
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    // Jika mengklik bab yang sudah terbuka, maka tutup. Jika tidak, buka yang baru.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <ul className="curriculum">
        {chapters?.map((chapter, index) => {
          const isOpen = openIndex === index;

          return (
            <li key={index} className={`accordion mb-25px overflow-hidden ${isOpen ? "active" : ""}`}>
              <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">

                {/* Header / Controller */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px] text-left"
                >
                  <div className="flex items-center">
                    <span className="capitalize">{chapter.title}</span>
                  </div>

                  {/* Icon Panah (SVG) */}
                  <svg
                    className={`transition-all duration-500 ${isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="#212529"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </button>

                {/* Content Area dengan Animasi Smooth */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">

                    <div className="content-wrapper p-10px md:px-30px">
                      <ul>
                        {chapter.lessons?.map((lesson, lessonIdx) => {

                          const videoUrl = lesson.storageLesson || "";
                          const pdfUrl = lesson.filePath || "";
                          const isPdfFile = pdfUrl.split(".").pop()?.toLowerCase() === "pdf";

                          return (
                            <li
                              key={lessonIdx}
                              className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark last:border-b-0"
                            >
                              <div>
                                <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light flex items-center">
                                  <i className={`mr-10px text-primaryColor ${isPdfFile ? "icofont-file-text text-emerald-600" : "icofont-video-alt"}`}></i>
                                  {lesson.title}
                                </h4>
                              </div>
                              <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center gap-4">
                                {/* Tombol Preview (Hanya jika isPreview === 1) */}
                                {lesson.isPreview === 1 && (
                                  <>
                                    {isPdfFile ? (
                                      // Jika file berakhiran .pdf, tampilkan preview PDF aman
                                      <PopupPdfPreview fileUrl={pdfUrl} />
                                    ) : (
                                      // Jika bukan pdf (video), gunakan modal video bawaan
                                      <PopupVideoPreview videoUrl={videoUrl} />
                                    )}
                                  </>
                                )}

                                <p className="flex items-center">
                                  <i className={`${isPdfFile ? "icofont-paper" : "icofont-clock-time"} mr-1`}></i>{" "}
                                  {isPdfFile ? lesson.pages : formatDuration(lesson.duration)}
                                </p>


                              </div>
                            </li>
                          )
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
    </div >
  );
};

export default CurriculumContent;