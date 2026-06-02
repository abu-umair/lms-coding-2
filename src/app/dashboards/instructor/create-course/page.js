import CreateCourseMain from "@/components/layout/main/CreateCourseMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Course | Edurock - Education LMS Template",
  description: "Create Course | Edurock - Education LMS Template",
};
const Create_Course = ({ searchParams }) => {
  return (
    <PageWrapper>
      <main>
        <CreateCourseMain searchParams={searchParams} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Create_Course;
