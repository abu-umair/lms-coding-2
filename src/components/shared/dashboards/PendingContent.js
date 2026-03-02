import CourseCard from "../courses/CourseCard";

const PendingContent = ({ courses }) => {
  console.log(courses);

  return courses?.map((course, idx) => (
    <CourseCard key={idx} course={course} type={"primary"} />
  ));
};

export default PendingContent;
