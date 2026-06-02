import About4 from "@/components/sections/abouts/About4";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Overview from "@/components/sections/overviews/Overview";
import Testimonials from "@/components/sections/testimonials/Testimonials";

const AboutMain = () => {
  return (
    <>
      <HeroPrimary title="Tentang Kami" path={"Tentang Kami"} />
      <About4 />
      <Overview />
      <FeatureCourses
        title={
          <>
            Pilih Paket Terbaik <br />
            Untuk Akselerasi Belajarmu
          </>
        }
        course="2"
        subTitle="Kelas Populer"
      />
      <Testimonials />
      <Brands />
    </>
  );
};

export default AboutMain;