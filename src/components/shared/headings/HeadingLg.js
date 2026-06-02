const HeadingLg = ({ children, color }) => {
  return (
    <div>
      <h1
        className={`text-3xl ${color === "white"
          ? "bg-gradient-to-r from-[#ffb703] via-[#ffc947] to-[#fb8500] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          : "bg-gradient-to-r from-blackColor via-slate-800 to-primaryColor dark:from-whiteColor dark:via-slate-200 dark:to-secondaryColor bg-clip-text text-transparent"
          } md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-extrabold mb-15px tracking-tight`}
      >
        {children}
      </h1>
    </div>
  );
};

export default HeadingLg;
