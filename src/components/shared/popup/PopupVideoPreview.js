"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import videoModal from "@/libs/videoModal";
const PopupVideoPreview = ({ videoUrl }) => {
  console.log(videoUrl);

  useEffect(() => {
    videoModal();
  }, []);
  return (
    <div>
      <button
        data-url={videoUrl}
        className="lvideo bg-primaryColor hover:bg-secondaryColor text-whiteColor text-xs rounded py-1 px-3 transition-colors"
      >
        <span className="flex items-center">
          <i className="icofont-eye mr-1"></i> Preview
        </span>
      </button>
    </div>
  );
};

export default PopupVideoPreview;
