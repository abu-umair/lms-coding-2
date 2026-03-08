import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LessonPrimary from "@/components/sections/lessons/LessonPrimary";
import React from "react";

const LessonMain = ({ course, history }) => {
  console.log(history);

  return <LessonPrimary course={course} history={history} />;
};

export default LessonMain;
