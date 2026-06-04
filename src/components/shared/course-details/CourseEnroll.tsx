"use client";
import Image from "next/image";
import PopupVideo from "../popup/PopupVideo";
import blogImage7 from "@/assets/images/blog/blog_7.png";
import blogImag8 from "@/assets/images/blog/blog_8.png";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { useCartContext } from "@/contexts/CartContext";
import getAllCourses from "@/libs/getAllCourses";
import { CartFormData, getCartSchema } from "@/libs/validationSchemaCart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCartClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatToIDR } from "@/utils/number";
import { formatDuration } from "@/utils/formatDuration";
import Link from "next/link";
import { premiumToast } from "@/utils/toastCustom";


const CourseEnroll = ({ type, course, userId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  console.log(course);

  // Link WhatsApp
  const message = "Halo Nusavia Academy, saya ingin berkonsultasi mengenai program kelas-kelas onlinenya";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/6289654238373?text=${encodedMessage}`;




  const currentCourse = course;

  // Sekarang proses destructuring dari currentCourse
  const {
    imageFileName,
    price,
    discount,
    duration,
    totalLesson,
    levelName,
    languageName,
    certificate,
    instructorName,
    title,
    name,
    demoVideoSource,
    totalSold

  } = currentCourse;

  const isFree = price === 0;
  // hitung jumlah final price setelah diskon  
  const discountAmount = price * (discount / 100);
  const finalPrice = price - discountAmount;

  console.log('price:', course);


  const displayTitle = title || name || "Judul tidak ditemukan";
  const isEditMode = false;
  const { callApi, isLoading } = useGrpcApi();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CartFormData>({
    resolver: zodResolver(getCartSchema(isEditMode)) as any,
    defaultValues: {
      course_id: "",
      // cart_id: "",
      // new_quantity: 1,
    }
  });

  const addProductToCart = async (values: CartFormData) => {
    if (!userId) {
      premiumToast.success("Silakan login terlebih dahulu untuk menambah ke keranjang.");
      router.push("/login"); // Arahkan ke halaman login
      return;
    }
    console.log("value course:", course);

    const cartPayload = {
      courseId: values.course_id,
    };

    // const apiCall = isEditMode
    //   ? (getCartClient().addCourseToCart(cartPayload) as any)
    //   : getCartClient().updateCartQuantity(cartPayload);
    const apiCall = getCartClient().addCourseToCart(cartPayload);

    await callApi(
      apiCall,
      {
        loadingMessage: "Memperbarui cart...",
        successMessage: "Cart berhasil diperbarui!",
        onSuccess: () => {
          // Memberitahu TanStack Query bahwa data dengan key 'cart-count' sudah basi
          // Ini akan memicu Navbar untuk fetch ulang secara otomatis
          queryClient.invalidateQueries({ queryKey: ["cart-count"] });
        },
        useDefaultError: false,
        defaultError: (res) => {
          console.log(res);

          premiumToast.error("Gagal memperbarui cart.");
        }
      }
    );

  };

  const handleBuyNow = (e: React.MouseEvent) => {
    if (!userId) {
      premiumToast.success("Silakan login terlebih dahulu untuk membeli.");
      router.push("/login"); // Arahkan ke halaman login
      return;
    }
    // Jalankan logika checkout / langsung arahkan ke halaman detail pembayaran jika ada
    router.push("/checkout");
  };

  return (
    <div
      className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
      data-aos="fade-up"
    >
      {type === 3 ? (
        ""
      ) : (
        <div className="overflow-hidden relative mb-5">
          <Image src={imageFileName} alt="" className="w-full" />
          <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
            <PopupVideo videoUrl={demoVideoSource} />
          </div>
        </div>
      )}
      {/* meeting thumbnail  */}

      <div
        className={`flex justify-between  ${type === 2 ? "mt-50px mb-5" : type === 3 ? "mb-50px" : "mb-5"
          }`}
      >
        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
          {finalPrice ? formatToIDR(finalPrice) : "Gratis"}{" "}
          <del className="text-sm text-lightGrey4 font-semibold">{price ? ` / ${formatToIDR(price)}` : ""}</del>
        </div>
        <div>
          <a
            className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark"
          >
            {discount}% OFF
          </a>
        </div>
      </div>
      <div className="mb-5" data-aos="fade-up">
        <button
          onClick={handleBuyNow}
          className="w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px mb-10px leading-1.8 border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark">
          <i className="icofont-flash"></i>
          Beli Sekarang
        </button>
        <button
          disabled={isLoading}
          onClick={() =>
            addProductToCart({
              course_id: course.id,
              // cart_id: "1", // Tambahkan ini
              // new_quantity: 1, // Tambahkan ini
            })
          }
          className={`w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border mb-10px leading-1.8 border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <i className="icofont-shopping-cart"></i>
          {isLoading ? "Processing..." : " Keranjang"}
        </button>


        {/* <span className="text-size-13 text-contentColor dark:text-contentColor-dark leading-1.8">
          <i className="icofont-ui-rotation"></i> 45-Days Money-Back Guarantee
        </span> */}
      </div>
      <ul>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Instructor:
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {instructorName}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Tanggal Mulai
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Segera
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Durasi
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {formatDuration(duration)}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Telah Bergabung
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {Number(totalSold)} Pelajar
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Materi
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {Number(totalLesson)} Lesson
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Tingkat Kesulitan
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {levelName}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Bahasa
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {languageName}
          </p>
        </li>
        {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Kuis Interaktif
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Yes
          </p>
        </li> */}
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Sertifikat Resmi
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {certificate == "no" ? "Tidak" : "Ya"}
          </p>
        </li>
      </ul>
      <div className="mt-5" data-aos="fade-up">
        <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
          Ada Pertanyaan? Kami Siap Membantu!
        </p>
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full">
          <button
            type="button"
            className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
          >
            <i className="icofont-whatsapp"></i> +62 896-54238373
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseEnroll;
