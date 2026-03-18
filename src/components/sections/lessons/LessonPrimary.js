"use client";
import lessons from "@/../public/fakedata/lessons.json";
import LessonAccordionStudent from "@/components/shared/lessons/LessonAccordionStudent";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import YouTube from "react-youtube"; // Import library baru
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getWatchHistoryClient } from "@/api/grpc/client";



const LessonPrimary = ({ course, history: initialHistory }) => {
  const { callApi, isLoading } = useGrpcApi();
  const [localHistory, setLocalHistory] = useState(initialHistory);
  const [activeLesson, setActiveLesson] = useState(null);

  // *** TAMBAHAN 1: useRef untuk akses player di luar event YouTube ***
  const playerRef = useRef(null);

  // *** TAMBAHAN 2: Helper Function untuk Ekstrak Video ID ***
  const getID = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  useEffect(() => {
    if (!course) return;

    const lastLessonId = localHistory?.lastWatchHistory[0]?.lessonId;
    // const initialLesson = course?.chapters?.[0]?.lessons?.[0];
    const initialLesson = course?.chapters
      ?.flatMap(ch => ch.lessons)
      ?.find(l => l.id === lastLessonId)
      || course?.chapters?.[0]?.lessons?.[0];
    setActiveLesson(initialLesson);
  }, [course]);

  // *** TAMBAHAN 3: Tangkap progress saat ganti lesson atau tutup tab ***
  useEffect(() => {
    // Fungsi ini dijalankan saat activeLesson berubah (berpindah video)
    // ATAU saat komponen LessonPrimary hilang/tutup (Cleanup function)
    return () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
          console.log(`[SAVE] Menit terakhir dari lesson ${activeLesson?.title}:`, currentTime);
          // Nanti panggil callApi di sini
        }
      }
    };
  }, [activeLesson]); // Perhatikan dependency [activeLesson]


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

  const onReady = (event) => {
    playerRef.current = event.target;

    // Cari data di watchedLessonId (yang sekarang berisi SEMUA riwayat berkat update BE)
    const hData = localHistory?.watchedLessonId?.find(h => h.lessonId === activeLesson?.id);

    if (hData?.lastPosition) {
      const seekToSeconds = parseInt(hData.lastPosition);
      // Hanya seek jika durasi lebih dari 2 detik agar tidak tanggung
      if (seekToSeconds > 2) {
        event.target.seekTo(seekToSeconds);
        console.log(`[RESUME] Berhasil melompat ke: ${seekToSeconds}s`);
      }
    }

  };

  // 2. Fungsi yang berjalan saat video di-pause (untuk ambil menit terakhir)
  const onPause = (event) => {
    // event.target adalah instance dari player
    const currentTime = event.target.getCurrentTime();
    // Jalankan fungsi simpan

    // ? ada edit disini
    // handleUpdateProgress(activeLesson, true, activeLesson.id);

    const roundedTime = Math.floor(currentTime);
    touchLessonUpdateAt(activeLesson, roundedTime);
  };

  // 3. Fungsi saat video selesai (untuk otomatis centang)
  const onEnd = (event) => {
    console.log("Video selesai ditonton!");
    console.log(activeLesson);
    handleUpdateProgress(activeLesson, false, activeLesson.id);
    // Di sinilah nanti kita panggil API untuk set is_completed = true
    touchLessonUpdateAt(activeLesson, 0);

  };

  const handleUpdateProgress = (lesson, isCurrentlyWatched, watchHistoryId) => {
    // 1. Tentukan status baru (kebalikan dari sekarang)
    const newStatus = !isCurrentlyWatched;

    setLocalHistory(prev => {
      const existingHistory = prev.watchedLessonId || [];
      const isAlreadyInList = existingHistory.some(h => h.lessonId === lesson.id);

      let updatedList;
      if (isAlreadyInList) {
        // Jika sudah ada, update status isCompleted-nya saja (pertahankan lastPosition)
        updatedList = existingHistory.map(h =>
          h.lessonId === lesson.id
            ? { ...h, isCompleted: newStatus.toString() }
            : h
        );
      } else {
        // Jika belum ada (data baru), tambahkan ke array
        updatedList = [
          ...existingHistory,
          {
            id: watchHistoryId || "",
            lessonId: lesson.id,
            isCompleted: newStatus.toString(),
            lastPosition: "0"
          }
        ];
      }

      return {
        ...prev,
        watchedLessonId: updatedList,
        // Count hanya bertambah jika status barunya true
        lessonCount: newStatus ? prev.lessonCount + 1 : Math.max(0, prev.lessonCount - 1)
      };
    });

    // 3. KIRIM KE BACKEND (Tanpa await agar tidak menghambat UI)
    callApi(getWatchHistoryClient().editLessonCompletion({
      lessonId: lesson.id,
      chapterId: lesson.chapterId,
      courseId: course.id,
      isCompleted: newStatus
    })).catch(err => {
      // 4. ROLLBACK JIKA GAGAL (Kembalikan ke data awal)
      console.error("Gagal update:", err);
      setLocalHistory(initialHistory);
    });
  };

  const progressStats = useMemo(() => {
    // 1. Hitung total seluruh lesson (Denominator)
    const total = course?.chapters?.reduce(
      (acc, chapter) => acc + (chapter.lessons?.length || 0),
      0
    ) || 0;

    // 2. Ambil jumlah selesai dari state yang selalu terupdate
    const completed = localHistory?.lessonCount || 0;

    // 3. Hitung persentase
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }, [course, localHistory]); // Re-calculate hanya jika data ini berubah

  // FUNGSI BARU: Untuk update timestamp/updated_at di backend
  const touchLessonUpdateAt = async (lesson, seconds) => {
    if (!lesson) return;

    // const stringSeconds = Math.floor(seconds || 0).toString();
    const stringSeconds = Math.floor(seconds || 0);

    // UPDATE STATE LOKAL DULU (Optimistic Update)
    // Ini kunci agar saat pindah-pindah lesson, datanya langsung "ingat" tanpa nunggu refresh
    setLocalHistory(prev => {
      const currentList = prev.watchedLessonId || [];
      const isExist = currentList.find(h => h.lessonId === lesson.id);

      let newList;
      if (isExist) {
        newList = currentList.map(h =>
          h.lessonId === lesson.id ? { ...h, lastPosition: stringSeconds } : h
        );
      } else {
        newList = [...currentList, { lessonId: lesson.id, lastPosition: stringSeconds, isCompleted: "false" }];
      }

      return { ...prev, watchedLessonId: newList };
    });

    try {
      await callApi(getWatchHistoryClient().editWatchHistory({
        lessonId: lesson.id,
        courseId: course.id,
        chapterId: lesson.chapterId,
        lastPosition: seconds //?permasalahan tidak mau masuk, nilainya
      }));
    } catch (err) {
      console.error("Gagal update timestamp via Navigasi:", err);
    }
  };


  // Mengumpulkan semua lesson menjadi satu array datar (next and prev)
  const allLessons = course?.chapters?.flatMap(ch => ch.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);

  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];

  const handleNavigation = async (lesson) => {
    if (lesson) {
      // Simpan menit terakhir video lama jika perlu sebelum pindah
      if (playerRef.current) {
        const lastTime = playerRef.current.getCurrentTime();
        // Simpan progress video yang sedang aktif SEBELUM pindah ke video baru
        await touchLessonUpdateAt(activeLesson, lastTime);
      }

      setActiveLesson(lesson);
      // Scroll otomatis ke atas video saat ganti lesson
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <div className="container-fluid-2 pt-50px pb-100px">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-30px">
          {/* lesson left  */}
          <div className="xl:col-start-1 xl:col-span-4 sticky top-20px h-fit max-h-[85vh] overflow-y-auto custom-scrollbar" data-aos="fade-up">
            {/* curriculum  */}
            {/* //* Kirim data chapters dan fungsi untuk mengubah video */}
            <LessonAccordionStudent
              chapters={course?.chapters}
              onSelectLesson={(lesson) => {
                // *** TAMBAHAN 5: Sebelum pindah, simpan menit terakhir video lama ***
                if (playerRef.current) {
                  touchLessonUpdateAt(activeLesson, playerRef.current.getCurrentTime());
                }
                setActiveLesson(lesson)
              }}
              activeLesson={activeLesson}
              history={localHistory} // Gunakan state lokal
              progressStats={progressStats}
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
                  {activeLesson?.title || "Select a Lesson"}
                </h3>
                <a href="course-details.html" className="">
                  Close
                </a>
              </div>

              <div className="aspect-[16/9]">
                {activeLesson?.storageLesson ? (
                  <YouTube
                    // *** TAMBAHAN 6: Gunakan fungsi getID agar dinamis ***
                    videoId={getID(activeLesson.storageLesson)}
                    opts={opts}
                    onReady={onReady}
                    onPause={onPause}
                    onEnd={onEnd}
                    className="w-full h-full" // Pastikan mengambil ukuran penuh container
                    containerClassName="w-full h-full"
                    // Properti key memaksa player reload saat ganti lesson
                    key={activeLesson.id}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Memuat Pelajaran..
                  </div>
                )}
              </div>

              <div className="p-5 flex justify-between items-center bg-lightGreyColor dark:bg-whiteColor-dark border-t border-borderColor dark:border-borderColor-dark">
                <button
                  onClick={() => handleNavigation(prevLesson)}
                  disabled={!prevLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${!prevLesson ? "opacity-30 cursor-not-allowed" : "hover:bg-primaryColor hover:text-white text-primaryColor border border-primaryColor"
                    }`}
                >
                  <i className="icofont-arrow-left"></i> Previous
                </button>

                <button
                  onClick={() => handleNavigation(nextLesson)}
                  disabled={!nextLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${!nextLesson ? "opacity-30 cursor-not-allowed" : "bg-primaryColor text-white hover:bg-opacity-90"
                    }`}
                >
                  Next <i className="icofont-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonPrimary;
