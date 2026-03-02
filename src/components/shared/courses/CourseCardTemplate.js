"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseCard = ({ course, type }) => {
  const { addProductToWishlist } = useWishlistContext();

  //* DESTRUCTURING & MAPPING API
  //* Di sini kita memetakan field dari API Anda ke variabel lokal.
  //* Jika API Anda menggunakan 'course_title', ganti 'title' menjadi 'course_title'.
  const {
    id,
    title,            //* Judul kursus
    image,            //* URL Thumbnail kursus
    price,            //* Harga (number)
    is_free,          //* Status gratis (API gRPC biasanya snake_case)
    instructor,       //* Objek instruktur dari API
    categories: cat,  //* Array atau string kategori
    lessons_count,    //* Jumlah lesson
    total_duration,   //* Total durasi (string: "12h 30m")
    progress,         //* Persentase progres (0-100)
    status,           //* Status kursus
  } = course;

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
  const instructorImg = instructor?.image || "/assets/images/placeholder/user.png";
  const instructorName = instructor?.name || "Instructor";

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
                src={image || "/assets/images/placeholder/course.png"} //* Fallback image jika API null
                alt={title}
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
                <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                <span className="text-sm text-black dark:text-blackColor-dark">
                  {lessons_count || 0} Lessons
                </span>
              </div>
              <div className="flex items-center">
                <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                <span className="text-sm text-black dark:text-blackColor-dark">
                  {total_duration || "0h"}
                </span>
              </div>
            </div>

            <h5 className={`${type === "primaryMd" ? "text-lg " : "text-xl "}`}>
              <Link
                href={`/courses/${id}`}
                className="font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor block line-clamp-2 min-h-[54px]"
              >
                {title}
              </Link>
            </h5>

            {/* PRICE SECTION */}
            <div className="text-lg font-semibold text-primaryColor mb-4">
              {price > 0 ? `$${price.toFixed(2)}` : "Free"}
              {price > 0 && (
                <del className="text-sm text-lightGrey4 font-semibold ml-1 opacity-50">
                  / $67.00
                </del>
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
            {(progress > 0 || status === "ACTIVE") && (
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