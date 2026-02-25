"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Grip, PencilLine, Trash, CopyPlus } from "lucide-react";
import { CourseDialog } from "@/components/shared/course-dialog/CourseDialog";
import Link from "next/link";
import LessonItem from "./LessonItem";

const ChapterItem = ({
    chapter,
    index,
    isOpen,
    toggleAccordion,
    isInputCourse,
    instructorId,
    courseId,
    onDelete,
    onSuccessAdd,
}) => {
    return (
        <Draggable
            key={chapter.id.toString()}
            draggableId={chapter.id.toString()}
            index={index}
            isDragDisabled={!isInputCourse}
        >
            {(provided, snapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`accordion mb-25px overflow-hidden ${isOpen ? "active" : ""} ${snapshot.isDragging ? "shadow-2xl z-50" : ""
                        }`}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">

                        {/* CONTROLLER (Area klik untuk buka/tutup accordion) */}
                        <div
                            onClick={() => toggleAccordion(index)}
                            className="accordion-controller cursor-pointer flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]"
                        >
                            <span>{chapter.title || chapter.chapter_name || `Chapter #${index + 1}`}</span>

                            <div className="flex items-center space-x-3">
                                {isInputCourse && (
                                    <div
                                        className="flex space-x-2 bg-primaryColor text-whiteColor text-sm rounded py-0.5 px-0.5"
                                        onClick={(e) => e.stopPropagation()} // Mencegah accordion terpicu saat klik tombol aksi
                                    >
                                        {/* Pegangan Drag */}
                                        <div
                                            {...provided.dragHandleProps}
                                            className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all cursor-grab active:cursor-grabbing"
                                        >
                                            <Grip size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                        </div>

                                        {/* Tombol Edit */}
                                        <CourseDialog
                                            instructorId={instructorId}
                                            courseId={courseId}
                                            title="Edit Topik"
                                            initialData={chapter}
                                            onSuccessAdd={onSuccessAdd}
                                            trigger={
                                                <button
                                                    type="button"
                                                    className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"
                                                >
                                                    <PencilLine size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                                </button>
                                            }
                                        />

                                        {/* Tombol Delete */}
                                        <button
                                            type="button"
                                            onClick={() => onDelete(chapter.id)}
                                            className="flex items-center px-2 py-0.5 border border-primaryColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all"
                                        >
                                            <Trash size={14} strokeWidth={2.5} className="!rotate-0 !fill-none" />
                                        </button>
                                    </div>
                                )}

                                {/* Icon Panah Panah */}
                                <span className={`transition-all duration-500 transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                                    <svg
                                        width="20"
                                        viewBox="0 0 16 16"
                                        style={{
                                            fill: isOpen ? "#0c63e4" : "#212529",
                                            transition: "fill 0.5s ease",
                                        }}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* CONTENT (Daftar Lesson) */}
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

                                    <ul>
                                        {/* Lesson items placeholder */}
                                        <LessonItem isInputCourse={isInputCourse} />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default ChapterItem;