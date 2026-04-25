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


const CourseEnroll = ({ type, course, userId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Data Dummy sebagai fallback
  const dummyCourse = {
    id: 1,
    title: "Mastering Next.js 14 for Beginners",
    price: 49.99,
    image: blogImag8, // Menggunakan import image yang sudah ada
    name: "Mastering Next.js 14 for Beginners", // Seringkali 'title' dan 'name' tertukar
    lesson: "45 Lessons",
    categories: "Web Development",
    instructor_id: 1,
    // Tambahkan field lain yang dibutuhkan
  };

  // Gunakan data dari props 'course', jika tidak ada gunakan dummy
  const currentCourse = course || dummyCourse;

  // Sekarang proses destructuring dari currentCourse
  const { id, image, price, title, name } = currentCourse;
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
          <Image src={image || blogImage7} alt="" className="w-full" />
          <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
            <PopupVideo />
          </div>
        </div>
      )}
      {/* meeting thumbnail  */}

      <div
        className={`flex justify-between  ${type === 2 ? "mt-50px mb-5" : type === 3 ? "mb-50px" : "mb-5"
          }`}
      >
        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
          ${price ? price : "dummy"}{" "}
          <del className="text-sm text-lightGrey4 font-semibold">/ $67.00</del>
        </div>
        <div>
          <a
            href="#"
            className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark"
          >
            68% OFF
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

        <span className="text-size-13 text-contentColor dark:text-contentColor-dark leading-1.8">
          <i className="icofont-ui-rotation"></i> 45-Days Money-Back Guarantee
        </span>
      </div>
      <ul>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Instructor:
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            D. Willaim
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Start Date
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            05 Dec 2024
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Duration
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            08Hrs 32Min
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Enrolled
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            100
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Lectures
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            30
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Skill Level
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Basic
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Language
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Spanish
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Quiz
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Yes
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Certificate
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Yes
          </p>
        </li>
      </ul>
      <div className="mt-5" data-aos="fade-up">
        <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
          More inquery about course
        </p>
        <button
          type="submit"
          className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
        >
          <i className="icofont-phone"></i> +47 333 78 901
        </button>
      </div>
    </div>
  );
};

export default CourseEnroll;
