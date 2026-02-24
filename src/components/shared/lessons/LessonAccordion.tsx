"use client";
import accordions from "@/libs/accordions";
import { CopyPlus, Grab, Grip, PencilLine, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CourseDialog } from "@/components/shared/course-dialog/CourseDialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getCourseChapterClient } from "@/api/grpc/client";
import useGrpcApi from "@/components/shared/others/useGrpcApi";



const LessonAccordion = ({ id, isInputCourse = false, chapters = [], instructorId, courseId, onSuccessAdd }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [items, setItems] = useState(chapters);
  const { callApi, isLoading } = useGrpcApi();


  // Sync data saat chapters dari parent berubah
  useEffect(() => {
    const sortedChapters = [...chapters].sort((a, b) => a.order_chapter - b.order_chapter);
    setItems(sortedChapters);
  }, [chapters]);


  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };


  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    // Update UI seketika
    setItems(reorderedItems);

    // Siapkan payload untuk API urutan baru
    try {
      // Kita gunakan perulangan untuk memanggil API satu per satu
      for (let i = 0; i < reorderedItems.length; i++) {
        const item = reorderedItems[i];
        const newOrder = i + 1;

        // Hanya panggil API jika orderChapter-nya berubah dari data asli
        if (item.orderChapter !== newOrder) {
          const payload = {
            id: item.id,
            instructorId: instructorId,
            courseId: courseId,
            title: item.title || item.chapter_name,
            orderChapter: newOrder,
            status: item.status,
          };

          // Memanggil API secara berurutan
          // Kita tidak perlu menampilkan toast sukses di setiap loop, 
          // cukup di item terakhir saja.
          await callApi(
            getCourseChapterClient().editCourseChapter(payload),
            {
              loadingMessage: i === 0 ? "Menyimpan urutan..." : undefined,
              successMessage: i === reorderedItems.length - 1 ? "Urutan diperbarui!" : undefined,
              useDefaultError: false,
              onSuccess: () => {
                if (i === reorderedItems.length - 1 && onSuccessAdd) {
                  onSuccessAdd();
                }
              }
            }
          );
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }

  };




  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters-list">
        {(provided) => (
          <ul {...provided.droppableProps}
            ref={provided.innerRef}
            className="accordion-container curriculum">
            {/* accordion  */}
            {items.length > 0 ? (
              items.map((chapter, index) => {
                const isOpen = openIndex === index;

                return (
                  <Draggable
                    key={chapter.id.toString()}
                    draggableId={chapter.id.toString()}
                    index={index}
                    isDragDisabled={!isInputCourse} // Drag mati jika bukan mode input
                  >
                    {(provided, snapshot) => (

                      <li
                        key={index}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`accordion mb-25px overflow-hidden ${isOpen ? "active" : ""} ${snapshot.isDragging ? "shadow-2xl z-50" : ""}`}
                        style={{ ...provided.draggableProps.style }}
                      >
                        <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">

                          {/* CONTROLLER */}
                          <div
                            onClick={() => toggleAccordion(index)}
                            className="accordion-controller cursor-pointer flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]"
                          >
                            <span>{chapter.title || `Lesson #${index + 1}`}</span>

                            <div className="flex items-center space-x-3">
                              {isInputCourse && (
                                <div
                                  className="flex space-x-2 bg-primaryColor text-whiteColor text-sm rounded py-0.5 px-0.5"
                                  onClick={(e) => e.stopPropagation()} // Mencegah accordion tertutup saat klik tombol aksi
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                    <Grip size={14} strokeWidth={2.5} className="!rotate-0 group-hover:text-primaryColor !fill-none" />
                                  </div>
                                  <CourseDialog
                                    instructorId={instructorId}
                                    courseId={courseId}
                                    title="Edit Topik"
                                    initialData={chapter} // Kirim data chapter yang mau diedit
                                    onSuccessAdd={onSuccessAdd} // Re-fetch data setelah edit
                                    trigger={
                                      <button className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                        <PencilLine size={14} strokeWidth={2.5} className="!fill-none" />
                                      </button>
                                    }
                                  />
                                  <button className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                    <Trash size={14} strokeWidth={2.5} className="!rotate-0 group-hover:text-primaryColor !fill-none" />
                                  </button>
                                </div>
                              )}

                              {/* SVG Icon dengan Rotasi & Warna Dinamis */}
                              <span className={`transition-all duration-500 transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                                <svg
                                  width="20"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    fill: isOpen ? "#0c63e4" : "#212529",
                                    transition: "fill 0.5s ease"
                                  }}
                                >
                                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                </svg>
                              </span>
                            </div>
                          </div>

                          {/* CONTENT - Menggunakan Teknik Grid Rows (Anti Jeda & Anti Terpotong) */}
                          <div
                            className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                              }`}
                          >
                            <div className="overflow-hidden">
                              <div className="content-wrapper p-10px md:px-30px border-t border-borderColor dark:border-borderColor-dark">

                                {isInputCourse && (
                                  <div className="mb-4 flex justify-end">
                                    <button className="flex items-center space-x-2 text-size-15 text-whiteColor bg-primaryColor px-3 py-1 border border-primaryColor hover:text-primaryColor hover:bg-whiteColor rounded transition-all">
                                      <CopyPlus size={14} strokeWidth={2.5} />
                                      <span>New Lesson</span>
                                    </button>
                                  </div>
                                )}

                                <ul className="list-none p-0">
                                  <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark last:border-b-0">
                                    <div className="flex items-center">
                                      <i className="icofont-video-alt mr-10px text-primaryColor"></i>
                                      <Link href="/lessons/1" className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor">
                                        Course Intro
                                      </Link>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                      {!isInputCourse && <span className="font-semibold text-sm">3.27</span>}

                                      <div className="flex space-x-2">
                                        {isInputCourse ? (
                                          <div className="flex space-x-1 bg-primaryColor p-0.5 rounded">
                                            <button className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"><Grip size={12} /></button>
                                            <button className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"><PencilLine size={12} /></button>
                                            <button className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"><Trash size={12} /></button>
                                          </div>
                                        ) : (
                                          <Link href="/lessons/1" className="bg-primaryColor text-whiteColor text-xs px-3 py-1 rounded border border-primaryColor hover:bg-whiteColor hover:text-primaryColor transition-all">
                                            <i className="icofont-eye mr-1"></i> Preview
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })
            ) : (

              <li className="accordion mb-25px overflow-hidden">
                <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
                  <div>
                    <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                      <span>Lesson #02</span>

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
                    </button>
                  </div>
                  <div className="accordion-content transition-all duration-500 h-0">
                    <div className="content-wrapper p-10px md:px-30px">
                      <ul>
                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-video-alt mr-10px"></i>
                              <Link
                                href="/lessons/1"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Course Intro
                              </Link>
                            </h4>
                          </div>
                          <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                            <p className="font-semibold">3.27</p>
                            <Link
                              href="/lessons/1"
                              className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                            >
                              <p className="px-10px">
                                <i className="icofont-eye"></i> Preview
                              </p>
                            </Link>
                          </div>
                        </li>

                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-video-alt mr-10px"></i>
                              <Link
                                href="/lessons/2"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Course Outline
                              </Link>
                            </h4>
                          </div>
                          <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                            <p className="font-semibold">5.00</p>
                            <Link
                              href="/lessons/2"
                              className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                            >
                              <p className="px-10px">
                                <i className="icofont-eye"></i> Preview
                              </p>
                            </Link>
                          </div>
                        </li>

                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-video-alt mr-10px"></i>
                              <Link
                                href="/lessons/3"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Course Outline
                              </Link>
                            </h4>
                          </div>
                          <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                            <p className="font-semibold">7.00</p>
                            <Link
                              href="/lessons/3"
                              className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                            >
                              <p className="px-10px">
                                <i className="icofont-eye"></i> Preview
                              </p>
                            </Link>
                          </div>
                        </li>
                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-file-text mr-10px"></i>
                              <Link
                                href="/lesson-course-materials"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Course Materials
                              </Link>
                            </h4>
                          </div>
                        </li>
                        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-audio mr-10px"></i>
                              <Link
                                href="/lesson-quiz"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Summer Quiz
                              </Link>
                            </h4>
                          </div>
                        </li>
                        <li className="py-4 flex items-center justify-between flex-wrap">
                          <div>
                            <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                              <i className="icofont-file-text mr-10px"></i>
                              <Link
                                href="/lesson-assignment"
                                className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                              >
                                Assignment
                              </Link>
                            </h4>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )}


            {/* <li className="accordion mb-25px overflow-hidden">
        <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
          <div>
            <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
              <span>Lesson #03</span>

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
            </button>
          </div>
          <div className="accordion-content transition-all duration-500 h-0">
            <div className="content-wrapper p-10px md:px-30px">
              <ul>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/1"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Intro
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">3.27</p>
                    <Link
                      href="/lessons/1"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>

                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/2"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Outline
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">5.00</p>
                    <Link
                      href="/lessons/2"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>

                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/3"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Outline
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">7.00</p>
                    <Link
                      href="/lessons/3"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-file-text mr-10px"></i>
                      <Link
                        href="/lesson-course-materials"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Materials
                      </Link>
                    </h4>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-audio mr-10px"></i>
                      <Link
                        href="/lesson-quiz"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Summer Quiz
                      </Link>
                    </h4>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-file-text mr-10px"></i>
                      <Link
                        href="/lesson-assignment"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Assignment
                      </Link>
                    </h4>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li> */}
            {/* <li className="accordion mb-25px overflow-hidden">
        <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-b-md">
          <div>
            <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
              <span>Lesson #04</span>

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
            </button>
          </div>
          <div className="accordion-content transition-all duration-500 h-0">
            <div className="content-wrapper p-10px md:px-30px">
              <ul>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/1"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Intro
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">3.27</p>
                    <Link
                      href="/lessons/1"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>

                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/2"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Outline
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">5.00</p>
                    <Link
                      href="/lessons/2"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>

                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-video-alt mr-10px"></i>
                      <Link
                        href="/lessons/3"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Outline
                      </Link>
                    </h4>
                  </div>
                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                    <p className="font-semibold">7.00</p>
                    <Link
                      href="/lessons/3"
                      className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                    >
                      <p className="px-10px">
                        <i className="icofont-eye"></i> Preview
                      </p>
                    </Link>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-file-text mr-10px"></i>
                      <Link
                        href="/lesson-course-materials"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Course Materials
                      </Link>
                    </h4>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-audio mr-10px"></i>
                      <Link
                        href="/lesson-quiz"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Summer Quiz
                      </Link>
                    </h4>
                  </div>
                </li>
                <li className="py-4 flex items-center justify-between flex-wrap">
                  <div>
                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                      <i className="icofont-file-text mr-10px"></i>
                      <Link
                        href="/lesson-assignment"
                        className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                      >
                        Assignment
                      </Link>
                    </h4>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li> */}
            {provided.placeholder}
          </ul>
        )
        }
      </Droppable>
    </DragDropContext>
  );
};

export default LessonAccordion;
