import CourseCard from "../courses/CourseCard";
const PublishContent = ({ courses }) => {

  return courses?.map((course, idx) => (
    console.log(course.image),

    <CourseCard key={idx} course={course} type={"primary"} />
  ));
};

export default PublishContent;
