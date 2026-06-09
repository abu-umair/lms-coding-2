"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import HeaderTop from "./HeaderTop";

import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";


const Header = ({ accessToken, cartCount, isAuthenticated, userVerified, userNotVerified, verifyUrl, role }) => {

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
  return (
    <header>
      <div>
        {/* header top */}
        {isHome2Dark || isHome2 ? "" : <HeaderTop />}
        {/* navbar */}
        <Navbar
          accessToken={accessToken}
          cartCount={cartCount}
          isAuthenticated={isAuthenticated}
          userVerified={userVerified}
          userNotVerified={userNotVerified}
          verifyUrl={verifyUrl}
          role={role}
        />
        {/* mobile menu */}
        <MobileMenu
          isAuthenticated={isAuthenticated}
          userVerified={userVerified}
          userNotVerified={userNotVerified}
          verifyUrl={verifyUrl}
          role={role}
        />
      </div>
    </header>
  );
};

export default Header;
