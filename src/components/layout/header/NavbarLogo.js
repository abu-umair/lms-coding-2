import Image from "next/image";
import React from "react";
import kodela from "@/assets/images/logo/kodela.webp";
import Link from "next/link";
const NavbarLogo = () => {
  return (
    <div className="lg:col-start-1 lg:col-span-2">
      <Link href="/" className="w-logo-sm lg:w-logo-lg ">
        <Image prioriy="fasle" src={kodela} alt="logo" className="w-full py-2" />
      </Link>
    </div>
  );
};

export default NavbarLogo;
