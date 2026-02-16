'use client';
import dashboardImage4 from "@/assets/images/dashbord/dashbord__4.jpg";
import dashboardImage5 from "@/assets/images/dashbord/dashbord__5.jpg";
import dashboardImage7 from "@/assets/images/dashbord/dashbord__7.jpg";
import dashboardImage8 from "@/assets/images/dashbord/dashbord__8.jpg";
import dashboardImage9 from "@/assets/images/dashbord/dashbord__9.jpg";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import { useForm } from "react-hook-form";
import FormInput from "@/components/shared/form-input/FormInput";
import { getCourseClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCourseSchema, CourseFormData } from "@/libs/validationSchemaCourse";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCourseId, saveCourseId } from "@/libs/courseStorage";
import { useSession } from "next-auth/react";
import { setGrpcCache } from "@/api/grpc/auth-interceptor";


const categoryOptions = [
  { value: "cat-2", label: "Design" },
  { value: "cat-3", label: "Marketing" },
  { value: "1db02880-fae4-4f4e-815b-58b39b84d635", label: "Programming" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "2db02880-fae4-4f4e-815b-58b39b84d635", label: "Bahasa Indonesia" },
];

const levelOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4db02880-fae4-4f4e-815b-58b39b84d635", label: "4" },
  { value: "5", label: "5" },
];

interface uploadImageResponse {
  course_id?: string;
  file_name: string;
  message: string;
  success: boolean;
}

const CreateCoursePrimary = () => {
  const { callApi, isLoading } = useGrpcApi();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<string | null>(null);
  const { data: session, status: authStatus } = useSession();
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const isEditMode = !!courseId;

  // 1. Cek localStorage saat pertama kali halaman dibuka (Refresh)
  useEffect(() => {
    const savedId = getCourseId();
    if (savedId) {
      setCourseId(savedId);
    }
  }, []);



  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(getCourseSchema(isEditMode)) as any,
    defaultValues: {

      name: "",
      image: undefined,
      slug: "",
      title: "",
      description: "",
      category_id: "",
      course_level_id: "",
      course_language_id: "",
      duration: "",
      timezone: "",
      thumbnail: "",
      demo_video_storage: "",
      demo_video_source: "",
      price: "",
      discount: "",
      capacity: 0,
      address: "",
      seo_description: "",
      certificate: "",
      message_for_reviewer: "",
      instructor_id: "",
      status: "",
      is_approved: "",
    }
  });

  // Pantau field image
  const imageValue = watch("image");

  // Jika ada courseId, panggil fungsi GetCourse (gRPC/API)
  useEffect(() => {
    const fetchDetail = async () => {
      const accessToken = (session as any)?.accessToken;

      if (!courseId && authStatus !== "authenticated" && !accessToken) {
        return;
      }


      if (courseId && authStatus == "authenticated" && accessToken) {
        setGrpcCache(accessToken);//?mengupdate token lebih cepat, menghindari race condition

        await callApi(getCourseClient().detailCourse({
          id: courseId,
          // Implementasi field_mask sesuai input Postman Anda
          fieldMask: {
            paths: [
              "name",
              "image_file_name",
              "slug",
              "title",
              "description",
              "category_id",
              "course_level_id",
              "course_language_id",
              "duration",
              "timezone",
              "thumbnail",
              "demo_video_storage",
              "demo_video_source",
              "instructor_id",
              "price",
              "discount",
              "capacity",
              "address",
              "seo_description",
              "is_approved",
              "status",
            ]
          }
        }),
          {
            loadingMessage: "Mengambil data detail...",
            onSuccess: (res) => {
              const data = res.response;
              // Gunakan reset() dari react-hook-form untuk mengisi form otomatis
              reset({
                name: data.name || "",
                slug: data.slug || "",
                title: data.title || "",
                description: data.description || "",
                category_id: data.categoryId || "",
                course_level_id: data.courseLevelId || "",
                course_language_id: data.courseLanguageId || "",
                duration: data.duration || "",
                timezone: data.timezone || "",
                thumbnail: data.thumbnail || "",
                demo_video_source: data.demoVideoSource || "",
                demo_video_storage: data.demoVideoStorage || "",
                instructor_id: data.instructorId || "", // camelCase dari gRPC ke snake_case Form

                // Pastikan field lain juga dipetakan
                price: data.price || "0",
                discount: data.discount || "0",
                capacity: Number(data.capacity) || 0,
                address: data.address || "",
                seo_description: data.seoDescription || "",
                is_approved: data.isApproved || "",

                // Untuk status, pastikan tidak mengambil status dari metadata gRPC
                status: data.status || "",
              });
              if (data.imageFileName) {
                setExistingImageUrl(data.imageFileName);
              }
            },
          }
        );
      }



    };

    fetchDetail();
  }, [courseId, authStatus, session]); // Tambahkan reset ke dependency agar sinkron


  const onSubmit = async (values: CourseFormData) => {
    let finalImageFileName = "";
    let currentCourseId = courseId; // Menggunakan state courseId yang ada

    if (values.image && values.image[0] instanceof File) {
      // ADA FILE BARU: Upload ke server
      const formData = new FormData();
      formData.append('image', values.image[0]);
      if (courseId) {
        formData.append('course_id', courseId);
      }

      console.log(formData);

      const toastId = toast.loading("wait...");
      const uploadResponse = await axios.post<uploadImageResponse>('http://127.0.0.1:3000/course/upload', formData);
      toast.dismiss(toastId);

      if (uploadResponse.status !== 200) {
        toast.error("Upload Gambar Gagal");

        return
      }

      finalImageFileName = uploadResponse.data.file_name;
      currentCourseId = uploadResponse.data.course_id || courseId;
    } else {
      if (existingImageUrl) {
        // menghapus bagian "http://localhost:3000/storage/58f983da-6160-48bf-ad0a-8699c6c97de9/course/"
        // split('/') akan memecah string berdasarkan karakter "/"
        // pop() akan mengambil elemen paling terakhir dari hasil pecahan tersebut
        finalImageFileName = existingImageUrl.split('/').pop() || "";
        console.log(finalImageFileName);
      } else {
        finalImageFileName = "";
      }

    }

    // Persiapkan Payload (Agar tidak nulis berulang kali)
    const coursePayload = {
      id: currentCourseId || "", // Pakai ID yang ada atau dari upload
      name: values.name,
      imageFileName: finalImageFileName,
      slug: values.slug,
      title: values.title,
      description: values.description,
      categoryId: values.category_id || undefined,
      courseLevelId: values.course_level_id || undefined,
      courseLanguageId: values.course_language_id || undefined,
      duration: values.duration,
      timezone: values.timezone,
      thumbnail: values.thumbnail,
      demoVideoStorage: values.demo_video_storage,
      demoVideoSource: values.demo_video_source,
      price: values.price || undefined,
      discount: values.discount || undefined,
      capacity: Number(values.capacity) || undefined,
      address: values.address,
      seoDescription: values.seo_description,
      certificate: values.certificate,
      messageForReviewer: values.message_for_reviewer,
      instructorId: values.instructor_id || undefined,
      status: values.status,
      isApproved: values.is_approved,
    };

    if (courseId) { //?jika edit course
      console.log(courseId);

      await callApi(
        getCourseClient().editCourse(coursePayload),
        {
          loadingMessage: "Memperbarui Course",
          successMessage: "Course berhasil diupdate!", // Otomatis muncul toast success
          // onSuccess: () => reset(),
          useDefaultError: true,
        }
      );

    } else {

      await callApi(
        getCourseClient().createCourse(coursePayload),
        {
          loadingMessage: "Memperbarui Course",
          successMessage: "Course berhasil diperbarui!", // Otomatis muncul toast success
          // onSuccess: () => reset(),
          useDefaultError: true,
        }
      );
    }



    saveCourseId(currentCourseId);

  };

  return (
    <div>
      <div className="container pt-100px pb-100px" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-5">
          {/*  create course left */}
          <div data-aos="fade-up" className="lg:col-start-1 lg:col-span-8">
            <ul className="accordion-container curriculum create-course">
              {/*  accordion */}
              <li className="accordion mb-5 active">
                <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md">
                  {/*  controller */}
                  <div className="py-5 px-30px">
                    <div className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px rounded-t-md">
                      <div>
                        <span>Course Info</span>
                      </div>
                      <svg
                        className="transition-all duration-500 rotate-0"
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
                    </div>
                  </div>
                  {/*  content */}
                  <div className="accordion-content transition-all duration-500 overflow-hidden">
                    <div className="content-wrapper py-4 px-5">
                      <div>
                        <form
                          onSubmit={handleSubmit(onSubmit, (err) => console.log("Validasi Gagal:", err))}
                          className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
                          data-aos="fade-up"
                        >
                          <div className="grid grid-cols-1 mb-15px gap-15px">
                            <FormInput
                              label="Course Title"
                              name="name"
                              type="text"
                              placeholder="Course Title"
                              register={register}
                              errors={errors}
                              disabled={isLoading}
                              isInputCourse={true}
                              lableRequired={true}
                            />

                            <FormInput
                              label="Course Slug"
                              name="slug"
                              type="text"
                              placeholder="Course Slug"
                              register={register}
                              errors={errors}
                              disabled={isLoading}
                              isInputCourse={true}
                              lableRequired={true}
                            />

                            <FormInput
                              label="Course Image"
                              name="image"
                              type="image"
                              // placeholder=""
                              register={register}
                              errors={errors}
                              disabled={isLoading}
                              isInputCourse={true}
                              lableRequired={true}
                              watchValueImg={imageValue}
                              initialImageUrl={existingImageUrl}
                            />
                            {/* <div>
                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                The Course Price Includes Your Author Fee.
                              </p>
                              <label className="mb-3 block font-semibold">
                                Discounted Price ($)
                              </label>
                              <input
                                type="text"
                                placeholder="Discounted Price ($)"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              />
                            </div> */}
                            {/* <div>
                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                The Course Price Includes Your Author Fee.
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-30px">
                                <div>
                                  <label className="text-xs uppercase text-placeholder block font-semibold text-opacity-50 leading-1.8">
                                    COURSES
                                  </label>
                                  <div className="bg-whiteColor relative rounded-md">
                                    <select className="text-base bg-transparent text-blackColor2 w-full p-13px pr-30px focus:outline-none block appearance-none relative z-20 focus:shadow-select rounded-md">
                                      <option>All</option>
                                      <option defaultValue="1">
                                        Web Design
                                      </option>
                                      <option defaultValue="2">Graphic</option>
                                      <option defaultValue="3">English</option>
                                      <option defaultValue="4">
                                        Spoken English
                                      </option>
                                      <option defaultValue="5">
                                        Art Painting
                                      </option>
                                      <option defaultValue="6">
                                        App Development
                                      </option>
                                      <option defaultValue="7">
                                        Web Application
                                      </option>
                                      <option defaultValue="7">
                                        Php Development
                                      </option>
                                    </select>
                                    <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-lg z-10"></i>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs uppercase text-placeholder block font-semibold text-opacity-50 leading-1.8">
                                    SHORT BY OFFER
                                  </label>
                                  <div className="bg-whiteColor relative rounded-md">
                                    <select className="text-base bg-transparent text-blackColor2 w-full p-13px pr-30px focus:outline-none block appearance-none relative z-20 focus:shadow-select rounded-md">
                                      <option>premium</option>
                                      <option defaultValue="1">Free</option>
                                      <option defaultValue="2">paid</option>
                                    </select>
                                    <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-lg z-10"></i>
                                  </div>
                                </div>
                              </div>
                            </div> */}
                          </div>
                          <FormInput
                            label="Course Description"
                            name="description"
                            type="textarea"
                            // placeholder=""
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                            isInputCourse={true}
                          />

                          <div className="mt-15px">
                            <ButtonPrimary
                              type={"submit"}
                              disabled={isLoading}

                            >
                              {isLoading ? 'Sedang Memproses..' : 'Update Info'}
                            </ButtonPrimary>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/*  accordion */}
              <li className="accordion mb-5">
                <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                  {/*  controller */}
                  <div className="py-5 px-30px">
                    <div className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px">
                      <div>
                        <span>Course Details & Media</span>
                      </div>
                      <svg
                        className="transition-all duration-500 rotate-0"
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
                    </div>
                  </div>


                  {/*  content */}
                  <div className="accordion-content transition-all duration-500 overflow-hidden h-0">
                    <div className="content-wrapper py-4 px-5">
                      <div>
                        <form
                          onSubmit={handleSubmit(onSubmit, (err) => console.log("Validasi Gagal:", err))}
                          className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
                        // data-aos="fade-up"
                        >
                          <div className="grid grid-cols-1 mb-15px gap-15px">
                            <div className="grid grid-cols-1 xl:grid-cols-2 mb-15px gap-y-15px gap-x-30px">
                              <FormInput
                                label="Kategori"
                                name="category_id"
                                type="select"
                                placeholder="Pilih Kategori Kursus"
                                options={categoryOptions}
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                isInputCourse={true}
                              />

                              <FormInput
                                label="Bahasa"
                                name="course_language_id"
                                type="select"
                                placeholder="Pilih Bahasa"
                                options={languageOptions}
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                isInputCourse={true}
                              />
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 mb-15px gap-y-15px gap-x-30px">
                              <FormInput
                                label="Level Kursus"
                                name="course_level_id"
                                type="select"
                                placeholder="Pilih Level Kursus"
                                options={levelOptions}
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                isInputCourse={true}
                              />
                              <FormInput
                                label="Durasi Kursus (menit)"
                                name="duration"
                                type="text"
                                placeholder="Masukkan Durasi Kursus"
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                isInputCourse={true}
                              // lableRequired={true}
                              />
                            </div>
                            <div>
                              <FormInput
                                label="Demo Video URL"
                                name="demo_video_source"
                                type="text"
                                placeholder="Masukkan Demo Video URL"
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                isInputCourse={true}
                              // lableRequired={true}
                              />
                            </div>
                            <div>
                              <div className="mb-3 block">
                                Example:
                                <a
                                  className="hover:text-primaryColor"
                                  href="https://www.youtube.com/watch?v=yourvideoid"
                                >
                                  https://www.youtube.com/watch?v=yourvideoid
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="mt-15px">
                            <ButtonPrimary
                              type={"submit"}
                              disabled={isLoading}

                            >
                              {isLoading ? 'Sedang Memproses..' : 'Update Details'}
                            </ButtonPrimary>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/*  accordion */}
              <li className="accordion mb-5">
                <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                  {/*  controller */}
                  <div className="py-5 px-30px">
                    <div className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px">
                      <div>
                        <span>Course Builder</span>
                      </div>
                      <svg
                        className="transition-all duration-500 rotate-0"
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
                    </div>
                  </div>
                  {/*  content */}
                  <div className="accordion-content transition-all duration-500 overflow-hidden h-0">
                    <div className="content-wrapper py-4 px-5">
                      <div>
                        <div className="mt-15px">
                          <a
                            href="#"
                            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                          >
                            Add New Topic
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/*  accordion */}
              <li className="accordion mb-5">
                <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                  {/*  controller */}
                  <div className="py-5 px-30px">
                    <div className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px">
                      <div>
                        <span>Additional Information</span>
                      </div>
                      <svg
                        className="transition-all duration-500 rotate-0"
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
                    </div>
                  </div>
                  {/*  content */}
                  <div className="accordion-content transition-all duration-500 overflow-hidden h-0">
                    <div className="content-wrapper py-4 px-5">
                      <div>
                        <form
                          className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
                          data-aos="fade-up"
                        >
                          <div className="grid grid-cols-1 xl:grid-cols-2 mb-15px gap-y-15px gap-x-30px">
                            <div>
                              <label className="mb-3 block font-semibold">
                                Start Date
                              </label>
                              <input
                                type="text"
                                placeholder="mm/dd/yyy"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
                              />
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Language
                              </label>
                              <input
                                type="text"
                                placeholder="English"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-30px">
                            <div>
                              <label className="mb-3 block font-semibold">
                                Requirements
                              </label>
                              <textarea
                                defaultValue={"Add your course benefits here."}
                                className="w-full py-10px px-5 mb-15px text-sm text-contentColor dark:text-contentColor-dark text-start bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                cols={30}
                                rows={10}
                              />

                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Enter for per line.
                              </p>
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Description
                              </label>
                              <textarea
                                className="w-full py-10px px-5 mb-15px text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                defaultValue={"Add your course benefits here."}
                                cols={30}
                                rows={10}
                              />

                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Enter for per line.
                              </p>
                            </div>
                          </div>
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              Course Tags
                            </label>
                            <textarea
                              className="w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              cols={30}
                              rows={10}
                            />
                          </div>

                          <div className="mt-15px">
                            <button
                              type="submit"
                              className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                            >
                              Update Info
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/*  accordion */}
              <li className="accordion mb-5">
                <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-b-md">
                  {/*  controller */}
                  <div className="cursor-pointer py-5 px-30px">
                    <div className="accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px rounded-b-md">
                      <div>
                        <span>Certificate Template</span>
                      </div>
                      <svg
                        className="transition-all duration-500 rotate-0"
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
                    </div>
                  </div>
                  {/*  content */}
                  <div className="accordion-content transition-all duration-500 overflow-hidden h-0">
                    <div className="content-wrapper py-4 px-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-5">
                        <div>
                          <Image
                            src={dashboardImage8}
                            className="w-full"
                            alt=""
                          />
                        </div>

                        <div>
                          <Image
                            src={dashboardImage4}
                            className="w-full"
                            alt=""
                          />
                        </div>

                        <div>
                          <Image
                            src={dashboardImage5}
                            className="w-full"
                            alt=""
                          />
                        </div>

                        <div>
                          <Image
                            src={dashboardImage9}
                            className="w-full"
                            alt=""
                          />
                        </div>
                        <div>
                          <Image
                            src={dashboardImage7}
                            className="w-full"
                            alt=""
                          />
                        </div>
                        <div>
                          <Image
                            src={dashboardImage8}
                            className="w-full"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-10 leading-1.8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-30px gap-y-5">
              <div data-aos="fade-up" className="lg:col-start-1 lg:col-span-4">
                <a
                  href="#"
                  className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-secondaryColor text-center"
                >
                  Preview
                </a>
              </div>

              <div data-aos="fade-up" className="lg:col-start-5 lg:col-span-8">
                <a
                  href="#"
                  className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-secondaryColor text-center"
                >
                  Create Course
                </a>
              </div>
            </div>
          </div>
          {/*  create course righ */}
          <div data-aos="fade-up" className="lg:col-start-9 lg:col-span-4">
            <div className="p-30px border-2 border-primaryColor">
              <ul>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Set the Course Price option make it free.
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Standard size for the course thumbnail.
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Video section controls the course overview video.
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Course Builder is where you create course.
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Add Topics in the Course Builder section to create lessons,
                    .
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Prerequisites refers to the fundamental courses .
                  </p>
                </li>
                <li className="my-7px flex gap-10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-check flex-shrink-0"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      className="text-greencolor"
                    ></polyline>
                  </svg>
                  <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                    Information from the Additional Data section.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePrimary;
