import CourseDetailsPrimary from "@/components/sections/course-details/CourseDetailsPrimary";
import HeroPrimary2 from "@/components/sections/hero-banners/HeroPrimary2";
import React from "react";

const CourseDetails3Main = ({ course }) => {
  return (
    <>
      <HeroPrimary2 type={3} course={course} />
      <CourseDetailsPrimary type={3} course={course} />
    </>
  );
};

export default CourseDetails3Main;
