"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import { saveCourseId, setModeEdit } from "@/libs/courseStorage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getCourseClient } from "@/api/grpc/client";
import { useSession } from "next-auth/react";




const CourseCard = ({ course, type }) => {
  console.log(course);
  const router = useRouter();
  const { callApi, isLoading } = useGrpcApi();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role; // Ambil role user
  const isStudent = userRole === "user";




  const { addProductToWishlist } = useWishlistContext();

  //* DESTRUCTURING & MAPPING API
  //* Di sini kita memetakan field dari API Anda ke variabel lokal.
  //* Jika API Anda menggunakan 'course_name', ganti 'title' menjadi 'course_title'.
  const {
    id,
    name,            //* Judul kursus
    imageFileName,            //* URL Thumbnail kursus
    price,            //* Harga (number)
    is_free,          //* Status gratis (API gRPC biasanya snake_case)
    instructor,       //* Objek instruktur dari API
    categories: cat,  //* Array atau string kategori
    lessons_count,    //* Jumlah lesson
    total_duration,   //* Total durasi (string: "12h 30m")
    progress,         //* Persentase progres (0-100)
    status,           //* Status kursus
  } = course;

  //* menuju edit course
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    //* 1. Simpan ID ke LocalStorage
    saveCourseId(id);

    //* 2. seting mode edit
    setModeEdit();

    //* 2. Arahkan ke URL edit-course (hasil rewrite tadi)
    router.push("/dashboards/edit-course");
  };

  //* Daftar warna kategori (Tetap di sini atau pindahkan ke file konstanta)
  const depBgs = [
    { category: "Development", bg: "bg-blue" },
    { category: "Web Design", bg: "bg-greencolor2" },
    { category: "Business", bg: "bg-orange" },
    { category: "Art & Design", bg: "bg-secondaryColor" },
  ];

  //* Mencari background berdasarkan kategori pertama jika 'cat' adalah array
  const categoryName = Array.isArray(cat) ? cat[0]?.name : cat;
  const cardBg = depBgs?.find((c) => c.category === categoryName)?.bg || "bg-primaryColor";

  //* Logika Dinamis untuk ID Instruktur agar Link tidak mati
  const instructorId = instructor?.id || "unknown";
  const instructorImg = teacherImage2;
  const instructorName = instructor?.name || "Instructor";

  //* delete course 
  const handleDeleteCourse = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex flex-col">
          <p className="text-sm font-bold text-headingColor">Hapus Course?</p>
          <p className="text-xs text-contentColor">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-all shadow-sm"
            disabled={isLoading}
            onClick={async () => {
              toast.dismiss(t.id);
              await callApi(getCourseClient().deleteCourse({ id: id }), {
                loadingMessage: "Menghapus course...",
                successMessage: "Course berhasil dihapus!",
                onSuccess: () => {
                  router.refresh();
                },
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
    <div
      className={`group ${type === "primary" || type === "primaryMd"
        ? ""
        : `w-full sm:w-1/2 lg:w-1/3 grid-item ${type === "lg" ? "xl:w-1/4" : ""}`
        } ${course.filter_option || ""}`}
    >
      <div className={`${type === "primaryMd" ? "" : "sm:px-15px mb-30px"}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark rounded-md">

          {/* IMAGE SECTION */}
          <div className="relative mb-2">
            <Link href={`/courses/${id}`} className="w-full overflow-hidden rounded block">
              <Image
                src={imageFileName || teacherImage2} //* Fallback image jika API null
                alt={name}
                width={500}
                height={300}
                priority={true}
                className="w-full transition-all duration-300 group-hover:scale-110 object-cover h-[180px]"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <p className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold ${cardBg}`}>
                {categoryName || "General"}
              </p>
              <button
                onClick={() => addProductToWishlist({ ...course, quantity: 1 })}
                className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor transition-all"
              >
                <i className="icofont-heart-alt text-base py-1 px-2"></i>
              </button>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div>
            <div className="grid grid-cols-2 mb-3">
              <div className="flex items-center">
                <i className="icofont-users pr-5px text-primaryColor text-lg"></i>
                <span className="text-sm text-black dark:text-blackColor-dark">
                  1000 Students
                </span>
              </div>
              <div className="flex items-center">
                <i className="icofont-ui-video-play pr-5px text-primaryColor text-lg"></i>
                <span className="capitalize text-sm text-black dark:text-blackColor-dark">
                  {status}
                </span>
              </div>
            </div>

            <h5 className={`${type === "primaryMd" ? "text-lg " : "text-xl "}`}>
              <Link
                href={`/courses/${id}`}
                className="capitalize font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor block line-clamp-2 min-h-[54px]"
              >
                {name}
              </Link>
            </h5>

            {/* PRICE SECTION */}
            <div className=" gap-2 text-lg flex font-semibold text-primaryColor mb-4">
              {!isStudent ? (
                <>
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-primaryColor bg-primaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark border border-primaryColor h-30px w-full px-14px leading-30px justify-center rounded-md my-5px"
                  // href={`/dashboards/edit-course`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-edit"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(id)}
                    className="flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-secondaryColor bg-secondaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark border border-secondaryColor h-30px w-full px-14px leading-30px justify-center rounded-md my-5px"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-trash-2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>Delete
                  </button>
                </>
              ) : (
                // JIKA STUDENT, TAMPILKAN TOMBOL LANJUTKAN BELAJAR / HARGA
                <Link
                  // href={`/lessons/${id}`}
                  href={`/lessons/1`}
                  className="flex items-center gap-1 text-sm font-bold text-whiteColor bg-primaryColor h-30px w-full justify-center rounded-md my-5px"
                >
                  {progress > 0 ? "Continue Learning" : "Start Learning"}
                </Link>
              )}
            </div>

            {/* AUTHOR SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor items-center">
              <Link href={`/instructors/${instructorId}`} className="flex items-center hover:text-primaryColor">
                <Image
                  className="w-[30px] h-[30px] rounded-full mr-10px object-cover"
                  src={instructorImg}
                  alt={instructorName}
                  width={30}
                  height={30}
                />
                <span className="text-base font-bold dark:text-blackColor-dark truncate">
                  {instructorName}
                </span>
              </Link>
              <div className="text-start md:text-end text-yellow text-size-15">
                <i className="icofont-star"></i>
                <i className="icofont-star"></i>
                <i className="icofont-star"></i>
                <i className="icofont-star"></i>
                <span className="text-xs text-lightGrey6 ml-1">(44)</span>
              </div>
            </div>

            {/* PROGRESS BAR (Hanya tampil jika ada progres/aktif) */}
            {progress !== undefined && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-primaryColor h-full transition-all duration-500"
                    style={{ width: `${progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-[10px] mt-1 text-gray-500">{progress || 0}% Complete</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;