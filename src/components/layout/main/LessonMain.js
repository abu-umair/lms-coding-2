import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LessonPrimary from "@/components/sections/lessons/LessonPrimary";
import React from "react";

const LessonMain = ({ course }) => {
  return <LessonPrimary course={course} />;
};

export default LessonMain;
