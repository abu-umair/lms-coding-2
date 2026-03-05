"use client";
import lessons from "@/../public/fakedata/lessons.json";
import LessonAccordionStudent from "@/components/shared/lessons/LessonAccordionStudent";
import { useState } from "react";

const LessonPrimary = ({ course }) => {
  //* State untuk melacak lesson mana yang sedang diputar (default lesson pertama dari chapter pertama)
  const [activeLesson, setActiveLesson] = useState(course?.chapters?.[0]?.lessons?.[0]);

  return (
    <section>
      <div className="container-fluid-2 pt-50px pb-100px">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-30px">
          {/* lesson left  */}
          <div className="xl:col-start-1 xl:col-span-4" data-aos="fade-up">
            {/* curriculum  */}
            {/* //* Kirim data chapters dan fungsi untuk mengubah video */}
            <LessonAccordionStudent
              chapters={course?.chapters}
              onSelectLesson={(lesson) => setActiveLesson(lesson)}
              activeLessonId={activeLesson?.id}
            />
          </div>
          {/*//! Lanjut cari file lessonPrimary dari yang ori, kemudian lihat syntax dari menampilkan video dan URL nya  */}
          {/* lesson right  */}
          <div
            className="xl:col-start-5 xl:col-span-8 relative"
            data-aos="fade-up"
          >
            <div>
              <div className="absolute top-0 left-0 w-full flex justify-between items-center px-5 py-10px bg-primaryColor leading-1.2 text-whiteColor">
                <h3 className="sm:text-size-22 font-bold">
                  {/* //* Nama lesson dinamis */}
                  {activeLesson?.name || "Select a Lesson"}
                </h3>
                <a href="course-details.html" className="">
                  Close
                </a>
              </div>

              <div className="aspect-[16/9]">
                {activeLesson?.storageLesson ? (
                  <iframe
                    //* Link video dinamis dari database
                    src={activeLesson.storageLesson}
                    allowFullScreen
                    allow="autoplay"
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Video tidak tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonPrimary;
