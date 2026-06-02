import React from "react";
import About1Fix from "./About1Fix";
import aboutImage17 from "@/assets/images/about/about_17.png";

const About4 = () => {
  return (
    <About1Fix image={aboutImage17} hideCounter={true}>
      Masa Depan Pendidikan:{" "}
      <span className="relative inline-block after:w-full after:h-[7px] z-0  after:absolute after:left-0 after:bottom-3 after:-z-1 md:after:bottom-5">
        Dibimbing oleh Ahli.
      </span>{" "}
      Disempurnakan oleh Teknologi.
    </About1Fix>
  );
};

export default About4;