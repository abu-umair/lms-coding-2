"use client";
import Image from "next/image";
import overviewImage from "@/assets/images/about/overview.jpg";
import overviewKidImage from "@/assets/images/about/overview_kg.png";
import useIsTrue from "@/hooks/useIsTrue";

const AboutContent = () => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const isAbout = useIsTrue("/about");
  const isAboutDark = useIsTrue("/about-dark");

  return (
    <div>
      <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-25px">
        Kami membangun sebuah infrastruktur pembelajaran modern yang dirancang untuk menjawab tantangan edukasi digital hari ini. Platform ini hadir bukan sekadar untuk menampung video pembelajaran, melainkan sebagai ekosistem cerdas yang mengintegrasikan keahlian para instruktur berkompeten dengan sistem manajemen belajar otomatis yang sangat efisien.
      </p>
      {isAbout || isAboutDark ? (
        <>
          <h4 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
            🚀 Efisiensi Mutlak bagi Pengajar
          </h4>
          <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-25px">
            Kami mengotomatisasi beban administrasi pengajar seperti pembuatan silabus, penyusunan bank soal, hingga kalkulasi data capaian, sehingga para ahli dapat fokus 100% pada kualitas konten materi.
          </p>

          <h4 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
            🎯 Pengalaman Belajar yang Dipersonalisasi
          </h4>
          <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-30px">
            Setiap murid mendapatkan perhatian penuh melalui sistem penyesuaian otomatis materi. Alur belajar akan melambat jika ada konsep yang belum dipahami, dan berakselerasi saat murid menunjukkan penguasaan cepat.
          </p>

          <h4 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
            📊 Transparansi Data untuk Orang Tua
          </h4>
          <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-30px">
            Tidak ada lagi tebak-tebakan dalam melihat tumbuh kembang anak. Sistem kami menyajikan analisis perilaku belajar yang jujur, presisi, dan mudah dipahami sebagai bahan evaluasi berkala.
          </p>
        </>
      ) : (
        <Image
          src={isHome9 || isHome9Dark ? overviewKidImage : overviewImage}
          alt="Tentang Platform Kami"
          className="w-full rounded-lg shadow-md"
          placeholder="blur"
        />
      )}
    </div>
  );
};

export default AboutContent;