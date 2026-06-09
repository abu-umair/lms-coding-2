import { getServerSession } from "next-auth";
import CourseCardGuest from "./CourseCardGuest";
import { getCourseClient } from "@/api/grpc/client";
import { authOptions } from "@/libs/authOptions";

const FilterCards = async ({ type }) => {

  const client = getCourseClient();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const res = await client.listCourse({
    // 1. Tambahkan bagian Pagination & Sort
    pagination: {
      currentPage: 1,
      itemPerPage: 60,
      sort: {
        field: "id",
        direction: "asc"
      }
    },

    // 2. Bagian FieldMask yang sudah kamu buat
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
        "total_sold",
        "total_lesson",
        "chapters"
      ]
    }
  });


  // 2. Transformasi Data (Sesuai dengan logika yang kamu pakai di Instructor)
  const formattedCourses = res.response.courses?.map((course) => ({
    ...course,
    title: course.name,
    price: parseFloat(course.price || "0"),
    totalSold: typeof course.totalSold === 'bigint'
      ? Number(course.totalSold)
      : (course.totalSold || 0)
  })) || [];
  console.log("detail formattedCourses : ", formattedCourses);

  return (
    <div
      className={` filter-contents flex flex-wrap sm:-mx-15px box-content mt-7 lg:mt-25px`}
      data-aos="fade-up"
    >
      {formattedCourses.length ? (
        formattedCourses.map((course, idx) => (
          <CourseCardGuest
            key={idx}
            type={type}
            course={course}
            userId={userId}
          />
        ))
      ) : (
        <div className="text-center w-full mt-10">
          <span className="text-gray-500">No courses found.</span>
        </div>
      )}
    </div>
  );
};

export default FilterCards;
