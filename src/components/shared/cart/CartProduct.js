"use client";
import Image from "next/image";
import Link from "next/link";
import QuantityInput from "../inputs/QuantityInput";
import { useEffect, useState } from "react";
import { useCartContext } from "@/contexts/CartContext";

const CartProduct = ({ product }) => {
  console.log("product course", product);

  const { id, title, price, quantity, image, isCourse } = product;

  const rowTotal = price * quantity;

  return product ? (
    <tr className="border-b border-borderColor dark:border-borderColor-dark">
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark">
        <Link href={`/${isCourse ? "courses" : "ecommerce/products"}/${id}`}>
          <Image
            loading="lazy"
            src={image}
            width={80}   // Sesuaikan dengan max-w-20 (20 * 4px = 80px)
            height={80}  // Sesuaikan rasio
            alt="product-1"
            className="max-w-20 w-full"
          />
        </Link>
      </td>
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark w-300px">
        <Link
          className="hover:text-primaryColor"
          href={`/${isCourse ? "courses" : "ecommerce/products"}/${id}`}
        >
          {title}
          {/* {title.length > 30 ? title.slice(0, 30) : title} */}
        </Link>
      </td>
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark">
        <span className="amount">Rp {price}</span>
      </td>
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark w-300px">
        <QuantityInput
          quantity={quantity}
          type={"box"}
          product={product}
          disabled
        />
      </td>
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark">
        {/* Rp {totalPrice <= 0 ? "0" : totalPrice} */}
        {rowTotal}
      </td>
      <td className="py-15px md:py-5">
        <button
          className="hover:text-primaryColor"
        >
          <svg
            width="25"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 ionicon"
            viewBox="0 0 512 512"
          >
            <title>Trash</title>
            <path
              d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="32"
              d="M80 112h352"
            ></path>
            <path
              d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            ></path>
          </svg>
        </button>
      </td>
    </tr>
  ) : (
    <p></p>
  );
};

export default CartProduct;
