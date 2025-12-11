"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import HeaderTop from "./HeaderTop";

import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";


const Header = () => {
  const router = useRouter(); // <-- Panggil useRouter
  const { data: session, status } = useSession();
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  useEffect(() => {
    stickyHeader();
    smoothScroll();
    // AOS Scroll Animation
    Aos.init({
      offset: 1,
      duration: 1000,
      once: true,
      easing: "ease",
    });
  }, []);

  const loading = status === 'loading';

  // Handler untuk tombol Login
  const handleLoginClick = () => {
    // NAVIGASI LANGSUNG ke halaman kustom Anda
    router.push('/login');
  };
  return (
    <header>
      <div>
        {/* header top */}
        {isHome2Dark || isHome2 ? "" : <HeaderTop />}
        {/* navbar */}
        <Navbar />
        <div>
          {loading ? (
            <span>Memuat Auth...</span>
          ) : session ? (
            <button onClick={() => signOut()}>Logout ({session.user?.name})</button>
          ) : (
            // GUNAKAN HANDLER NAVIGASI
            <button onClick={handleLoginClick}>Login</button>
          )}
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
