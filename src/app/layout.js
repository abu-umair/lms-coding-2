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

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
export const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata = {
  title: "Home 1 | Edurock - Education LMS Template",
  description: "Home description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hind.variable}`}>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0  ${inter.className}`}
      >
        <NextAuthProvider>
          <GrpcSyncProvider>
            <PreloaderPrimary />
            <Toaster position="top-center"
              reverseOrder={false} toastOptions={{
                style: {
                  zIndex: 10000000, // Paksa z-index sangat tinggi
                },
              }} />
            {children}

            {/* theme fixed shadow */}
            <div>
              <FixedShadow />
              <FixedShadow align={"right"} />
            </div>
          </GrpcSyncProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
