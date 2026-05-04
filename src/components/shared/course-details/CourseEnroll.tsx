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


const CourseEnroll = ({ type, course, userId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  console.log(course);




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
    demoVideoSource
  } = currentCourse;
  const basePrice = Number(price) + Number(discount);
  // 2. Hitung Persentase Diskon
  // Gunakan Math.round agar tidak muncul banyak angka di belakang koma (misal 68.123%)
  const discountPercentage = basePrice > 0
    ? Math.round((Number(discount) / basePrice) * 100)
    : 0;
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
      toast.success("Silakan login terlebih dahulu untuk menambah ke keranjang.");
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

          toast.error("Gagal memperbarui cart.");
        }
      }
    );

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
          {price ? formatToIDR(price) : "-"}{" "}
          <del className="text-sm text-lightGrey4 font-semibold">/ {basePrice ? formatToIDR(basePrice) : "-"}</del>
        </div>
        <div>
          <a
            className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark"
          >
            {discountPercentage}% OFF
          </a>
        </div>
      </div>
      <div className="mb-5" data-aos="fade-up">
        <button
          disabled={isLoading}
          onClick={() =>
            addProductToCart({
              course_id: course.id,
              // cart_id: "1", // Tambahkan ini
              // new_quantity: 1, // Tambahkan ini
            })
          }
          className={`w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? "Processing..." : "Add To Cart"}
        </button>
        <button className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark">
          Buy Now
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
            05 Dec 2024 (belum)
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
            Peserta Terdaftar
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            100+ (belum)
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Materi
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {Number(totalLesson)}
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
          <p className="text-xs capitalize text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {certificate}
          </p>
        </li>
      </ul>
      <div className="mt-5" data-aos="fade-up">
        <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
          Ada Pertanyaan? Kami Siap Membantu!
        </p>
        <button
          type="submit"
          className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
        >
          <i className="icofont-phone"></i> +62 801-2345 (belum)
        </button>
      </div>
    </div>
  );
};

export default CourseEnroll;
