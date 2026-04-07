import { getCourseClient } from "@/api/grpc/client";
import StudentEnrolledCourses from "@/components/sections/sub-section/dashboards/StudentEnrolledCourses";
import React from "react";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";

const StudentEnrolledCoursesMain = async () => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  const client = getCourseClient();


  const res = await client.getAllCourseUser({
    userId: userId,
    fieldMask: {
      paths: [
        "name",
        "image_file_name",
        "slug",
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
        "certificate",
        "message_for_reviewer",
        "is_approved",
        "status",
        "progress",
      ]
    }
  }, {
    meta: { // Gunakan 'meta', bukan 'metadata' untuk protobuf-ts
      "authorization": accessToken ? `Bearer ${accessToken}` : ''
    }
  });


  //* 3. Transformasi Data agar sesuai dengan kebutuhan template CourseCard
  const formattedCourses = res.response.courses?.map((course) => ({
    ...course,
    title: course.name, //* Template butuh 'title'
    // imgFile: course.imageFileName, //* Template butuh 'image'
    price: parseFloat(course.price || "0"), //* Konversi string ke number
    lesson: "0 Lessons", //* Default jika data tidak ada di API
    insName: session.user.name || "Instructor", //* Dari session
    // insImg: session.user.image || "/assets/images/placeholder/user.png",
  })) || [];

  console.log(formattedCourses);


  return <StudentEnrolledCourses courses={formattedCourses} />;
};

export default StudentEnrolledCoursesMain;
