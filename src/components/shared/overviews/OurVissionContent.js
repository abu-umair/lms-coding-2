import Image from "next/image";
import vissionImage from "@/assets/images/about/vision.jpg";

const OurVissionContent = () => {
  return (
    <div>
      <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-25px">
        Visi kami adalah menyediakan wadah dan standar baru dalam dunia pendidikan digital. Sebuah ekosistem elit yang mandiri, tepercaya, dan berkinerja tinggi, di mana teknologi bekerja di balik layar untuk menyempurnakan setiap proses transfer ilmu pengetahuan dari sang ahli langsung ke ruang belajar Anda.
      </p>

      {/* 8 Poin Keunggulan Utama Ekosistem Premium */}
      <ul className="space-y-3 grid grid-cols-1 lg:grid-cols-2 mb-25px">
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Kurasi Instruktur yang Sangat Ketat
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Sistem Jalur Belajar Adaptif Otomatis
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Otomatisasi Beban Administrasi Guru
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Analisis Capaian Berbasis Data Riil
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Lingkungan Belajar Bersih & Bebas Iklan
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Akses Infrastruktur Server Global 24/7
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Laporan Kinerja Informatif untuk Orang Tua
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Sertifikasi Profesional yang Diakui
          </p>
        </li>
      </ul>

      <Image
        src={vissionImage}
        alt="Visi Masa Depan Platform"
        className="w-full rounded-lg shadow-md"
        placeholder="blur"
      />
    </div>
  );
};

export default OurVissionContent;