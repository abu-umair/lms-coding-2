import Link from 'next/link'
import React from 'react'
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { getChapterLessonClient } from '@/api/grpc/client';
import { Grip, PencilLine, Trash } from 'lucide-react';
import { CourseDialogLesson } from '../course-dialog/CourseDialogLesson';



const LessonItem = ({
    isInputCourse,
    courseId,
    instructorId,
    chapterId,
    initialData,
    onSuccessLessonAdd,
    onDelete
}) => {


    return (
        <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark last:border-b-0">
            <div className="flex items-center">
                <i className="icofont-video-alt mr-10px text-primaryColor"></i>
                <Link href="/lessons/1" className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor">
                    {initialData.title}
                </Link>
            </div>

            <div className="flex items-center space-x-3">
                {!isInputCourse && <span className="font-semibold text-sm">3.27</span>}

                {isInputCourse ? (
                    <div className="flex space-x-2">
                        <div className="flex space-x-1 bg-primaryColor p-0.5 rounded">
                            <button className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                <Grip size={12} />
                            </button>
                            <CourseDialogLesson
                                instructorId={instructorId}
                                courseId={courseId}
                                title="Edit Lesson"
                                initialData={initialData} //lesson data
                                chapterId={chapterId}
                                onSuccessLessonAdd={onSuccessLessonAdd} // fungsi refresh ke sini
                                trigger={
                                    <button className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                        <PencilLine size={12} />
                                    </button>
                                }
                            />
                            {/* Menghapus lesson */}
                            <button
                                type='button'
                                onClick={() => onDelete(initialData.id)}
                                className="p-1 text-whiteColor hover:bg-whiteColor hover:text-primaryColor rounded transition-all">
                                <Trash size={12} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href="/lessons/1" className="bg-primaryColor text-whiteColor text-xs px-3 py-1 rounded border border-primaryColor hover:bg-whiteColor hover:text-primaryColor transition-all">
                        <i className="icofont-eye mr-1"></i> Preview
                    </Link>
                )}
            </div>
        </li>
    )
}

export default LessonItem