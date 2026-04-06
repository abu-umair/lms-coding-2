import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import lessons from "@/../public/fakedata/lessons.json";
import LessonMain from "@/components/layout/main/LessonMain";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { getCourseClient } from "@/api/grpc/client";
import { getWatchHistoryClient } from "@/api/grpc/client";
import { cache } from "react";
import { checkCourseUserBuy } from "@/components/auth/CourseGuard";



//* 1. Gunakan React Cache untuk membungkus fungsi fetch.
//* Next.js akan "menghafal" hasil fetch ini selama satu siklus request yang sama.
const getCachedCourse = cache(async (slug) => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const client = await getCourseClient();
  const historyClient = await getWatchHistoryClient();


  //nanti ganti by slug, bukan by courseId 
  await checkCourseUserBuy(slug, accessToken);

  console.log('test');
  const meta = {
    meta: { "authorization": accessToken ? `Bearer ${accessToken}` : '' }
  };


  //* Memanggil dua API secara paralel (Lebih cepat daripada satu-satu)
  const courseRes = await client.detailCourseUser({
    slug: slug,
    fieldMask: {
      paths: [
        "id",
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
        // "course_level_id",
        // "course_language_id",
        // "instructor_id",
        "chapters"
      ]
    }
  }, meta);

  const courseData = courseRes.response;
  if (!courseData?.id) return { course: courseData, history: null };


  // 2. Gunakan ID dari hasil pertama untuk ambil history
  const historyRes = await historyClient.watchLessonId({
    courseId: courseData.id,
    fieldMask: {
      paths: [
        "user_id",
        "course_id",
        "chapter_id",
        "lesson_id",
        "is_completed"
      ]
    }
  }, meta);



  return {
    course: courseData,
    history: historyRes.response
  };

});




//* 2. Metadata sekarang memanggil fungsi yang di-cache
export async function generateMetadata({ params }) {
  const data = await getCachedCourse(params.id)

  if (!data) return { title: "Course Not Found" };

  return {
    title: `${data.course.name} | Edurock`,
    description: data.course.name,
  };
}

//* 3. Komponen Utama juga memanggil fungsi yang di-cache
const Lesson = async ({ params }) => {
  const data = await getCachedCourse(params.id)
  console.log(data);
  console.log(data.history.lastWatchHistory[0].lessonId);
  console.log('test');



  if (!data) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <LessonMain course={data.course} history={data.history} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export async function generateStaticParams() {
  return lessons?.map(({ id }) => ({ id: id.toString() }));
}
export default Lesson;
