import CourseDetails3Main from "@/components/layout/main/CourseDetails3Main";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { getCourseClient } from "@/api/grpc/client";
import { cache } from 'react';


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
  const { slug } = params;
  const res = await getCourseData(slug);
  console.log("judul saya :", res?.response?.name);

  return (
    <PageWrapper>
      <main>
        <CourseDetails3Main course={res.response} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_3;
