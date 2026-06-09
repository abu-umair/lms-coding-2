"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
// import PopupVideo from "@/components/shared/popup/PopupVideo";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import toast from "react-hot-toast";
// 1. Import Turnstile
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

const Registration = () => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    programType: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Validasi apakah token Turnstile sudah ada
    if (!turnstileToken) {
      toast.error("Silakan selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    // Kirim data formData beserta turnstileToken ke Backend API Anda
    console.log("Data siap dikirim ke backend:", { ...formData, token: turnstileToken });

    toast.success("Permintaan konsultasi terkirim! Tim Admin kami akan segera menghubungi Anda.");

    // Reset form & captcha setelah sukses
    setFormData({ name: "", email: "", phone: "", programType: "", note: "" });
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  };

  return (
    <section className="bg-register bg-cover bg-center bg-no-repeat lg:mb-150px">
      <div className="overlay bg-blueDark bg-opacity-90 py-20 lg:pt-[90px] lg:pb-0 relative z-0">
        {/* Konten dekorasi gambar tetap sama */}
        <div>
          <Image className="absolute top-0 left-0 lg:left-[8%] 2xl:top-10 animate-move-hor block z--1" src={registrationImage1} alt="" />
          <Image className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z--1" src={registrationImage2} alt="" />
          <Image className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z--1" src={registrationImage3} alt="" />
        </div>

        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 pt-30px gap-x-30px">
            {/* Kop Kiri */}
            <div className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7" data-aos="fade-up">
              <div className="relative">
                <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                  Konsultasi Gratis
                </span>
                <h3 className="text-3xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px">
                  Bingung Pilih Kelas? <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-2 md:after:bottom-4 z-0 after:z-[-1]">Diskusikan</span> Kebutuhan Belajar Anda Bersama Konsultan Kami
                </h3>
                <div className="flex gap-x-5 items-center">
                  {/* <PopupVideo /> */}
                  <div>
                    <p className="text-size-15 md:text-[22px] lg:text-lg 2xl:text-[22px] leading-6 md:leading-9 lg:leading-8 2xl:leading-9 font-semibold text-white">
                      Tersedia program Private & Corporate Training yang dirancang khusus untuk akselerasi karier serta bisnis Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Kanan */}
            <div className="overflow-visible lg:col-start-8 lg:col-span-5 relative z-1 lg:-mb-150px">
              <form onSubmit={handleSubmit} className="p-35px pt-10 bg-lightGrey10 dark:bg-lightGrey10-dark rounded shadow-experience" data-aos="fade-up">
                <h3 className="text-xl text-blackColor dark:text-blackColor-dark font-semibold mb-5 font-inter">
                  Hubungi Kami / Konsultasi
                </h3>

                <input
                  type="text" required placeholder="Nama Lengkap" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-15px py-3 bg-lightGrey8 dark:bg-lightGrey8-dark text-base mb-25px focus:outline-none rounded border border-transparent focus:border-primaryColor"
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-30px">
                  <input
                    type="email" required placeholder="Alamat Email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-15px py-3 bg-lightGrey8 dark:bg-lightGrey8-dark text-base mb-25px focus:outline-none rounded border border-transparent focus:border-primaryColor"
                  />
                  <input
                    type="tel" required placeholder="Nomor WhatsApp/HP" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-15px py-3 bg-lightGrey8 dark:bg-lightGrey8-dark text-base mb-25px focus:outline-none rounded border border-transparent focus:border-primaryColor"
                  />
                </div>

                <select
                  required value={formData.programType}
                  onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                  className="w-full px-15px py-3 bg-lightGrey8 dark:bg-lightGrey8-dark text-base mb-25px focus:outline-none rounded border border-transparent focus:border-primaryColor text-contentColor"
                >
                  <option value="" disabled hidden>Pilih Tipe Program</option>
                  <option value="corporate">Corporate / Pelatihan Perusahaan</option>
                  <option value="private">Private Mentoring 1-on-1</option>
                  <option value="regular">Kelas Reguler / Rekomendasi Alur</option>
                  <option value="other">Tanya Info Lainnya</option>
                </select>

                <textarea
                  placeholder="Ceritakan singkat kebutuhan belajar atau kendala karier Anda saat ini..." value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-15px pb-3 pt-5 bg-lightGrey8 dark:bg-lightGrey8-dark text-base mb-25px h-[130px] placeholder:text-blackColor/50 focus:outline-none rounded border border-transparent focus:border-primaryColor"
                  cols={30} rows={10}
                />

                {/* 3. Komponen Turnstile Widget diletakkan sebelum tombol submit */}
                <div className="mb-25px">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey="1x00000000000000000000AA" // Ganti dengan Site Key asli Anda
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                    options={{
                      size: "normal", // Tetap ringkas agar ramah UI/UX sidebar
                      theme: "light",  // 🌟 DIUBAH DI SINI: Mengunci warna agar selalu putih bersih
                    }}
                  />
                </div>

                <div>
                  <ButtonPrimary type="submit" arrow={true}>
                    Hubungi Saya Sekarang
                  </ButtonPrimary>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;