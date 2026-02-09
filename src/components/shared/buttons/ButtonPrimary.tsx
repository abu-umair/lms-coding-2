"use client";
import Link from "next/link";
import React from "react";

// 1. Definisikan tipe data untuk Props
// Tanda tanya (?) berarti prop tersebut bersifat opsional (tidak wajib diisi)
interface ButtonPrimaryProps {
  children: React.ReactNode;
  color?: "primary" | "secondary"; // Opsional
  type?: "button" | "submit" | "link"; // Opsional
  path?: string; // Opsional
  arrow?: boolean; // Opsional
  width?: "full" | "auto"; // Opsional
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Opsional
  disabled?: boolean; // Opsional
}

const ButtonPrimary = ({
  children,
  color = "primary", // Memberikan default value
  type = "button",   // Memberikan default value
  path = "#",        // Memberikan default value
  arrow = false,
  width,
  onClick,
  disabled = false,
}: ButtonPrimaryProps) => {
  
  // Render sebagai Button (untuk form atau aksi)
  if (type === "button" || type === "submit") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`text-size-15 text-whiteColor px-25px py-10px border inline-block rounded transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-whiteColor"
        } ${
          width === "full" ? "w-full" : ""
        } ${
          color === "secondary"
            ? "bg-secondaryColor border-secondaryColor hover:text-secondaryColor dark:hover:text-whiteColor"
            : "bg-primaryColor border-primaryColor hover:text-primaryColor dark:hover:text-whiteColor"
        }`}
      >
        {children} {arrow && <i className="icofont-long-arrow-right"></i>}
      </button>
    );
  }

  // Render sebagai Link (untuk navigasi)
  return (
    <Link
      href={path}
      className={`text-size-15 text-whiteColor px-25px py-10px border hover:bg-whiteColor inline-block rounded transition-all duration-300 ${
        color === "secondary"
          ? "bg-secondaryColor border-secondaryColor hover:text-secondaryColor dark:hover:text-whiteColor"
          : "bg-primaryColor border-primaryColor hover:text-primaryColor dark:hover:text-whiteColor"
      }`}
    >
      {children} {arrow && <i className="icofont-long-arrow-right"></i>}
    </Link>
  );
};

export default ButtonPrimary;