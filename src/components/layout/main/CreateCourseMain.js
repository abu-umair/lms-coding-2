import CreateCoursePrimary from "@/components/sections/create-course/CreateCoursePrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CreateCourseMain = ({ searchParams }) => {
  const modeEdit = searchParams.mode === "edit";

  return (
    <>
      <HeroPrimary
        title={modeEdit ? "Edit Course" : "Create Course"}
        path={modeEdit ? "Edit Course" : "Create Course"}
      />
      <CreateCoursePrimary />
    </>
  );
};

export default CreateCourseMain;
