"use client";
import lessons from "@/../public/fakedata/lessons.json";
import LessonAccordionStudent from "@/components/shared/lessons/LessonAccordionStudent";
import { useState } from "react";
import ReactPlayer from "react-player";
import YouTube from "react-youtube"; // Import library baru
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getWatchHistoryClient } from "@/api/grpc/client";



const LessonPrimary = ({ course, history: initialHistory }) => {
  const { callApi, isLoading } = useGrpcApi();

  // 1. Jadikan history sebagai State Lokal
  const [localHistory, setLocalHistory] = useState(initialHistory);

  const lastLessonId = localHistory?.lastWatchHistory[0]?.lessonId;
  // const initialLesson = course?.chapters?.[0]?.lessons?.[0];
  const initialLesson = course?.chapters
    ?.flatMap(ch => ch.lessons)
    ?.find(l => l.id === lastLessonId)
    || course?.chapters?.[0]?.lessons?.[0];

  console.log(localHistory);
  console.log(lastLessonId);
  console.log(initialLesson);



  const [activeLesson, setActiveLesson] = useState(initialLesson);
  console.log(activeLesson);


  // 1. Opsi konfigurasi player
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      rel: 0, // Tidak menampilkan video terkait dari channel lain
    },
  };

  // 2. Fungsi yang berjalan saat video di-pause (untuk ambil menit terakhir)
  const onPause = (event) => {
    // event.target adalah instance dari player
    const currentTime = event.target.getCurrentTime();
    console.log("Video berhenti di detik:", currentTime);
    // Di sinilah nanti kita akan memanggil API Go untuk simpan menit
  };

  // 3. Fungsi saat video selesai (untuk otomatis centang)
  const onEnd = (event) => {
    console.log("Video selesai ditonton!");
    // Di sinilah nanti kita panggil API untuk set is_completed = true
  };

  const handleUpdateProgress = async (lesson, isCurrentlyWatched, watchHistoryId) => {
    // 1. Tentukan status baru (kebalikan dari sekarang)
    const newStatus = !isCurrentlyWatched;

    // 2. UPDATE UI SECARA INSTAN (Optimistic)
    setLocalHistory(prev => ({
      ...prev,
      // Kita filter dulu ID yang lama (jika ada), lalu tambahkan yang baru jika statusnya true
      watchedLessonId: newStatus
        ? [...(prev.watchedLessonId || []), { id: watchHistoryId, lessonId: lesson.id }]
        : prev.watchedLessonId.filter(h => h.lessonId !== lesson.id),
      lessonCount: newStatus ? prev.lessonCount + 1 : prev.lessonCount - 1
    }));

    // 3. KIRIM KE BACKEND (Tanpa await agar tidak menghambat UI)
    callApi(getWatchHistoryClient().editLessonCompletion({
      id: "1674bd43-f120-4bbd-bd21-195b66bfe6b4", // Kirim string kosong jika null agar backend tahu ini "Create"
      lessonId: lesson.id,
      chapterId: lesson.chapterId,
      courseId: course.id,
      userId: 'ed28bf94-38fc-449d-a8c9-7399c5383625',
      isCompleted: newStatus
    })).catch(err => {
      // 4. ROLLBACK JIKA GAGAL (Kembalikan ke data awal)
      console.error("Gagal update:", err);
      setLocalHistory(initialHistory);
    });
  };

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
              activeLesson={activeLesson}
              history={localHistory} // Gunakan state lokal
              onToggleManual={handleUpdateProgress}
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
                  <YouTube
                    videoId="z7BHNGRteCg" // ID Video statis untuk testing
                    opts={opts}
                    onPause={onPause}
                    onEnd={onEnd}
                    className="w-full h-full" // Pastikan mengambil ukuran penuh container
                    containerClassName="w-full h-full"
                  />
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
