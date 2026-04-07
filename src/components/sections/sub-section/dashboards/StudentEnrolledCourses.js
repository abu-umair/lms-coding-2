"use client";
import useTab from "@/hooks/useTab";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import TabButtonSecondary from "@/components/shared/buttons/TabButtonSecondary";
import EnrolledContent from "@/components/shared/dashboards/EnrolledContent";

// Terima props 'courses' dari parent (page dashboard student)
const StudentEnrolledCourses = ({ courses = [] }) => {
  const { currentIdx, handleTabClick } = useTab();

  // Logika Filter Dinamis berdasarkan data API
  // ENROLLED: Semua kursus yang dimiliki student
  const enrolledCourses = courses;
  console.log(courses);
  

  // ACTIVE: Kursus yang progresnya > 0 tapi < 100
  const activeCourses = courses?.filter(
    (course) => (course.progress || 0) > 0 && (course.progress || 0) < 100
  );

  // COMPLETED: Kursus yang progresnya sudah 100%
  const completedCourses = courses?.filter(
    (course) => (course.progress || 0) === 100
  );

  const tabbuttons = [
    {
      name: "ENROLLED COURSES",
      content: <EnrolledContent courses={enrolledCourses} />,
    },
    {
      name: "ACTIVE COURSES",
      content: <EnrolledContent courses={activeCourses} />,
    },
    {
      name: "COMPLETED COURSES",
      content: <EnrolledContent courses={completedCourses} />,
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Courses
        </h2>
      </div>
      <div className="tab">
        <div className="tab-links flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons?.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              idx={idx}
              currentIdx={currentIdx}
              handleTabClick={handleTabClick}
              button={"small"}
            />
          ))}
        </div>
        <div>
          {tabbuttons?.map(({ content }, idx) => (
            <TabContentWrapper key={idx} isShow={idx === currentIdx}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:-mx-15px ">
                {content}
              </div>
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;