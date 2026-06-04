import BalbImage from "@/components/shared/animaited-images/BalbImage";
import BookImage from "@/components/shared/animaited-images/BookImage";
import GlobImage from "@/components/shared/animaited-images/GlobImage";
import TriangleImage from "@/components/shared/animaited-images/TriangleImage";
import PopupVideo from "@/components/shared/popup/PopupVideo";
import Image from "next/image";
import blogImage7 from "@/assets/images/blog/blog_7.png";
import { log } from "node:console";
import { convertStringToTime } from "@/utils/date";
import Link from "next/link";

const HeroPrimary2 = ({ type, course, slug }) => {
  const {
    imageFileName,
    demoVideoSource,
    updatedAt,
    totalLesson,
    categoryName,
  } = course;
  console.log(course);
  const updateCourse = convertStringToTime(updatedAt);

  // Daftar warna badge kategori adaptif
  const depBgs = [
    { category: "Teknologi", bg: "bg-blue" },
    { category: "Sains", bg: "bg-greencolor2" },
    { category: "Kreatif", bg: "bg-orange" },
    { category: "Karir", bg: "bg-secondaryColor" },
    { category: "Web Development", bg: "bg-primaryColor" },

  ];
  const cardBg = depBgs?.find((c) => c.category === categoryName)?.bg || "bg-red-500";

  return (
    <section data-aos="fade-up">
      {/* banner section */}
      <div
        className={`bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible ${type === 3 ? "pt-50px" : "py-50px"
          }`}
      >
        {/* animated icons */}
        <div>
          <BookImage type={"secondary"} />
          <GlobImage type={"secondary"} />
          <BalbImage type={"secondary"} />
          <TriangleImage type={"secondary"} />
        </div>
        <div className="container">
          <div>
            <ul className="flex gap-1">
              <li>
                <Link
                  href="/"
                  className="text-lg text-blackColor2 dark:text-blackColor2-dark"
                >
                  Home <i className="icofont-simple-right"></i>
                </Link>
              </li>
              <li>
                <span className="text-lg text-blackColor2 dark:text-blackColor2-dark">
                  Details <i className="icofont-simple-right"></i>
                </span>
              </li>
              <li>
                <span className="capitalize text-lg text-blackColor2 dark:text-blackColor2-dark">
                  {slug}
                </span>
              </li>
            </ul>
            <div className="pt-70px">
              <div
                className="flex items center gap-6 mb-30px"
                data-aos="fade-up"
              >
                <button className={`text-sm text-whiteColor border ${cardBg} px-26px py-0.5 leading-23px font-semibold rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor`}>
                  {categoryName}
                </button>
              </div>
              {/* titile */}
              <h4
                className="capitalize text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                data-aos="fade-up"
              >
                {course.name}
              </h4>
              {/* price and rating */}
              <div
                className="flex gap-5 flex-wrap items-center mb-30px"
                data-aos="fade-up"
              >
                <div className="flex items-center">
                  <div>
                    <i className="icofont-book-alt pr-5px text-primaryColor text-sm"></i>
                  </div>
                  <div>
                    <span className="text-sm text-black dark:text-blackColor-dark font medium">
                      {Number(totalLesson)} Lesson
                    </span>
                  </div>
                </div>
                {/* <div className="text-start md:text-end">
                  <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                  <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                  <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                  <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                  <i className="icofont-star text-size-15 text-yellow"></i>{" "}
                  <span className="text-xs text-blackColor dark:text-blackColor-dark">
                    (44)
                  </span>
                </div> */}
                <div>
                  <p className="text-sm text-contentColor dark:text-contentColor-dark font-medium">
                    Last Update:{" "}
                    <span className="text-blackColor dark:text-blackColor-dark">
                      {updateCourse}
                    </span>
                  </p>
                </div>
              </div>

              {/* thumbnail */}
              {type === 3 ? (
                <div className="overflow-hidden relative mb-5 aspect-video">
                  <Image
                    src={imageFileName}
                    alt="asdfasf"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
                    <PopupVideo videoUrl={demoVideoSource} />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPrimary2;
