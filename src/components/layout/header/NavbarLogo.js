import Image from "next/image";
import React from "react";
import nusavia from "@/assets/images/logo/nusavia-academy.webp";
import Link from "next/link";
const NavbarLogo = () => {
  return (
    <div className="lg:col-start-1 lg:col-span-2">
      <Link href="/" className="w-logo-sm lg:w-logo-lg ">
        <Image prioriy="fasle" src={nusavia} alt="logo" className="w-full py-2" />
      </Link>
    </div>
  );
};

export default NavbarLogo;
