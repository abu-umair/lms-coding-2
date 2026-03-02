import DashboardCoursesTab from "@/components/shared/dashboards/DashboardCoursesTab";
import { authOptions } from "@/libs/authOptions";
import { getCourseClient } from "@/api/grpc/client";
import { getServerSession } from "next-auth";

const InstructorCourseMain = async () => {
  // Ambil session di server
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  const instructorId = session?.user?.id;

  const client = getCourseClient();


  // Kirim token ke gRPC melalui metadata jika diperlukan
  const res = await client.getAllCourse({
    instructorId: instructorId,
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



  return <DashboardCoursesTab courses={formattedCourses} />;
};

export default InstructorCourseMain;
