import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import lessons from "@/../public/fakedata/lessons.json";
import LessonMain from "@/components/layout/main/LessonMain";
import { notFound } from "next/navigation";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { getCourseClient } from "@/api/grpc/client";
import { cache } from "react";


//* 1. Gunakan React Cache untuk membungkus fungsi fetch.
//* Next.js akan "menghafal" hasil fetch ini selama satu siklus request yang sama.
const getCachedCourse = cache(async (slug) => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const client = await getCourseClient();

  console.log('test');

  // Kirim token ke gRPC melalui metadata jika diperlukan
  const res = await client.detailCourseUser({
    slug: slug,
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
        // "course_level_id",
        // "course_language_id",
        // "instructor_id",
        "chapters"
      ]
    }
  }, {
    meta: { // Gunakan 'meta', bukan 'metadata' untuk protobuf-ts
      "authorization": accessToken ? `Bearer ${accessToken}` : ''
    }
  });

  return res.response
});

//* 2. Metadata sekarang memanggil fungsi yang di-cache
export async function generateMetadata({ params }) {
  const course = await getCachedCourse(params.id)
  console.log(course);

  if (!course) return { title: "Course Not Found" };

  return {
    title: `${course.name} | Edurock`,
    description: course.name,
  };
}

//* 3. Komponen Utama juga memanggil fungsi yang di-cache
const Lesson = async ({ params }) => {
  const course = await getCachedCourse(params.id)


  if (!course) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <LessonMain course={course} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export async function generateStaticParams() {
  return lessons?.map(({ id }) => ({ id: id.toString() }));
}
export default Lesson;
