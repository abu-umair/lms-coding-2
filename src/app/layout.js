"use client"; // Kita butuh state untuk mengontrol hidrasi

import { useState, useEffect } from "react";
import { Hind, Inter } from "next/font/google";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "./globals.css";

import FixedShadow from "@/components/shared/others/FixedShadow";
import PreloaderPrimary from "@/components/shared/others/PreloaderPrimary";
import NextAuthProvider from "@/components/shared/others/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import GrpcSyncProvider from "@/components/shared/others/GrpcSyncProvider";

// Fon Config
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // Efek ini hanya akan dijalankan di Browser
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className={`${hind.variable}`}>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0 ${inter.className}`}
        // Mencegah browser extension merusak hidrasi (seperti Grammarly atau Translator)
        suppressHydrationWarning={true}
      >
        <NextAuthProvider>
          <GrpcSyncProvider>
            {/* Kuncinya di sini: 
               Jika belum mounted (Server Side), jangan render komponen yang memanipulasi DOM.
            */}
            {mounted ? (
              <>
                <PreloaderPrimary />
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    style: { zIndex: 10000000 },
                  }}
                />
                {children}
                <div>
                  <FixedShadow />
                  <FixedShadow align={"right"} />
                </div>
              </>
            ) : (
              /* Tampilan sementara (Server-Rendered) agar tidak kosong */
              <div className="min-h-screen bg-bodyBg">
                {/* Kamu bisa masukkan skeleton loader sederhana di sini */}
              </div>
            )}
          </GrpcSyncProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}