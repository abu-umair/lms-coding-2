"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDuration } from "@/utils/formatDuration";

const CourseCardGuest = ({ course, type }) => {
  const router = useRouter();
  const { addProductToWishlist } = useWishlistContext();

  // Destructuring field dari API
  const {
    id,
    name,
    slug,
    imageFileName,
    price,
    instructor,
    categories: cat,
    duration,
    sold,
  } = course;

  // Logika dinamis untuk status gratis berdasarkan nominal harga dari API
  const isFree = price === 0;

  // Handlers untuk interaksi siswa di Halaman Home
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    // Jalankan logika checkout / langsung arahkan ke halaman detail pembayaran jika ada
    toast.success(`Melanjutkan pembelian untuk kelas: ${name}`);
    router.push(`/course/details/${slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Di sini Anda bisa mengintegrasikan fungsi context keranjang belanja (CartContext) Anda
    toast.success(`Berhasil menambahkan "${name}" ke keranjang belanja!`);
  };

  // Daftar warna badge kategori adaptif
  const depBgs = [
    { category: "Teknologi", bg: "bg-blue" },
    { category: "Sains", bg: "bg-greencolor2" },
    { category: "Kreatif", bg: "bg-orange" },
    { category: "Karir", bg: "bg-secondaryColor" },
  ];

  const categoryName = Array.isArray(cat) ? cat[0]?.name : cat;
  const cardBg = depBgs?.find((c) => c.category === categoryName)?.bg || "bg-primaryColor";

  const instructorId = instructor?.id || "unknown";
  const instructorImg = teacherImage2;
  const instructorName = instructor?.name || "Pengajar Ahli";

  return (
    <div
      className={`group ${type === "primary" || type === "primaryMd"
        ? ""
        : `w-full sm:w-1/2 lg:w-1/3 grid-item ${type === "lg" ? "xl:w-1/4" : ""}`
        } ${course.filter_option || ""}`}
    >
      <div className={`${type === "primaryMd" ? "" : "sm:px-15px mb-30px"}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark rounded-md border border-borderColor/10 hover:border-primaryColor/30 transition-all duration-300">

          {/* IMAGE SECTION */}
          <div className="relative mb-4 overflow-hidden rounded">
            <Link href={`/course/details/${slug}`} className="w-full block">
              <Image
                src={imageFileName || teacherImage2}
                alt={name}
                width={500}
                height={300}
                priority={true}
                className="w-full transition-all duration-500 group-hover:scale-105 object-cover h-[180px]"
              />
            </Link>
            <div className="absolute left-2 top-2 flex justify-between w-[92%] items-center">
              <p className={`text-xs text-whiteColor px-3 py-[4px] rounded-full font-semibold shadow-sm ${cardBg}`}>
                {categoryName || "Umum"}
              </p>

              {/* Tombol Wishlist aktifkan jika context sudah siap */}
              {/* <button
                onClick={() => {
                  addProductToWishlist({ ...course, quantity: 1 });
                  toast.success("Ditambahkan ke Wishlist");
                }}
                className="text-whiteColor bg-blackColor/40 backdrop-blur-sm p-1 rounded-full hover:bg-secondaryColor transition-all shadow"
              >
                <i className="icofont-heart text-base px-1"></i>
              </button> */}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div>
            <div className="flex justify-between items-center mb-3 text-contentColor dark:text-contentColor-dark">
              <div className="flex items-center">
                <i className="icofont-users pr-5px text-primaryColor text-base"></i>
                <span className="text-xs font-medium">
                  {sold || 0} Siswa
                </span>
              </div>
              <div className="flex items-center">
                <i className="icofont-clock-time pr-5px text-primaryColor text-base"></i>
                <span className="text-xs font-medium">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            <h5 className={`${type === "primaryMd" ? "text-base" : "text-lg"} mb-2 min-h-[54px] line-clamp-2`}>
              <Link
                href={`/course/details/${slug}`}
                className="font-bold text-blackColor dark:text-blackColor-dark hover:text-primaryColor transition-colors duration-200 block leading-normal"
              >
                {name}
              </Link>
            </h5>

            {/* PRICE SECTION */}
            <div className="flex items-center gap-2 text-xl font-extrabold text-primaryColor mb-4">
              {isFree ? (
                <span className="text-greencolor bg-greencolor/10 text-sm px-2 py-0.5 rounded">
                  Gratis
                </span>
              ) : (
                <>
                  <span>Rp {price.toLocaleString("id-ID")}</span>
                  {/* Simulasi Coretan Diskon Agar Menarik (Opsional) */}
                  <del className="text-xs text-lightGrey4 font-normal">
                    Rp {(price * 1.5).toLocaleString("id-ID")}
                  </del>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleBuyNow}
                className="flex items-center gap-1.5 text-xs font-bold text-whiteColor bg-primaryColor hover:bg-primaryColor/90 transition-all h-35px w-full justify-center rounded-md"
              >
                <i className="icofont-flash"></i> Beli Sekarang
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 text-xs font-bold text-secondaryColor bg-secondaryColor/10 hover:bg-secondaryColor hover:text-whiteColor transition-all h-35px w-full justify-center rounded-md"
              >
                <i className="icofont-shopping-cart"></i> + Keranjang
              </button>
            </div>

            {/* AUTHOR SECTION */}
            <div className="flex justify-between pt-3 border-t border-borderColor dark:border-borderColor-dark items-center">
              <Link href={`/instructors/${instructorId}`} className="flex items-center hover:text-primaryColor transition-colors max-w-[65%]">
                <Image
                  className="w-[26px] h-[26px] rounded-full mr-2 object-cover ring-1 ring-primaryColor/20"
                  src={instructorImg}
                  alt={instructorName}
                  width={26}
                  height={26}
                />
                <span className="text-xs font-semibold dark:text-blackColor-dark truncate">
                  {instructorName}
                </span>
              </Link>
              <div className="text-yellow text-xs flex items-center gap-0.5">
                <i className="icofont-star"></i>
                <span className="font-bold text-blackColor dark:text-blackColor-dark ml-0.5">4.8</span>
                <span className="text-[10px] text-lightGrey6 dark:text-lightGrey4">(44)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseCardGuest;