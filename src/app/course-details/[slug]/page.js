import CourseDetails3Main from "@/components/layout/main/CourseDetails3Main";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { getCourseClient } from "@/api/grpc/client";
import { cache } from 'react';
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";


const client = getCourseClient();
// Helper untuk memanggil API agar tidak menulis ulang paths
const getCourseData = cache(async (slug) => {
  return await client.detailCourseGuest({
    fieldMask: {
      paths: [
        "name", "image_file_name", "slug", "description",
        "category_id", "course_level_id", "course_language_id",
        "duration", "timezone", "thumbnail", "demo_video_storage",
        "demo_video_source", "instructor_id", "price", "discount",
        "capacity", "address", "seo_description", "certificate",
        "message_for_reviewer", "is_approved", "status", "total_sold"
      ]
    },
    slug: slug
  });
});


// 1. METADATA DINAMIS
export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    const res = await getCourseData(slug);
    return {
      title: `${res.response.name} | Edurock`,
      description: res.response.description || "Course details",
    };
  } catch (error) {
    return { title: "Course Not Found" };
  }
}

const Course_Details_3 = async ({ params }) => {
  // Ambil session di server
  const session = await getServerSession(authOptions);
  // const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  const { slug } = params;
  const res = await getCourseData(slug);

  return (
    <PageWrapper>
      <main>
        <CourseDetails3Main course={res.response} userId={userId} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_3;
