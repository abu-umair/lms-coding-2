"use client";
import Image from "next/image";
import Link from "next/link";
import QuantityInput from "../inputs/QuantityInput";
import { useEffect, useState } from "react";
import { useCartContext } from "@/contexts/CartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatToIDR } from "@/utils/number";

const CartProduct = ({ product }) => {
  const router = useRouter();
  console.log("product course", product);

  const { callApi } = useGrpcApi();
  const queryClient = useQueryClient();

  const { id, title, price, discount, quantity, image, isCourse, cartId } = product;


  //*1. Deklarasi Mutation untuk hapus item
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await callApi(
        //* Pastikan nama method di gRPC client Anda sesuai (misal: deleteCart)
        getCartClient().deleteCart({
          cartId: id,
        }),
        {
          loadingMessage: "Menghapus item...",
          successMessage: "Item berhasil dihapus",
        }
      );
    },
    onSuccess: () => {
      //* 2. Refresh data keranjang dan hitungan di navbar setelah hapus berhasil
      queryClient.invalidateQueries({ queryKey: ["cart-data"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  //* 3. Handler untuk tombol hapus
  const handleDeleteConfirm = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex flex-col">
          <p className="text-sm font-bold text-headingColor">Hapus Produk?</p>
          <p className="text-xs text-contentColor">Course ini akan dihapus dari keranjang Anda.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-all shadow-sm"
            onClick={() => {
              toast.dismiss(t.id); //* Tutup toast konfirmasi
              deleteMutation.mutate(cartId); //* Jalankan mutation hapus
            }}
          >
            Ya, Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-xs px-3 py-1.5 border border-borderColor rounded hover:bg-gray-100 transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const hasDiscount = Number(discount) > 0; //* Cek apakah item memiliki diskon
  const finalPricePerItem = hasDiscount ? price - (price * (Number(discount) / 100)) : price; //* Harga per item setelah dipotong diskon
  const rowOriginalTotal = price * quantity; //* Total harga kotor (sebelum diskon) untuk row ini
  const rowFinalTotal = finalPricePerItem * quantity; //* Total harga bersih (setelah diskon) untuk row ini

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
          className="hover:text-primaryColor block font-medium"
          href={`/${isCourse ? "courses" : "ecommerce/products"}/${id}`}
        >
          {title}
          {/* {title.length > 30 ? title.slice(0, 30) : title} */}
        </Link>
        {hasDiscount && (
          <span className="inline-block mt-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
            Hemat {Number(discount)}%
          </span>
        )}
      </td>
      <td className="py-15px md:py-5 border-r border-borderColor dark:border-borderColor-dark">
        {hasDiscount && (
          <span className="block text-xs text-gray-400 line-through">{formatToIDR(price)}</span>
        )}
        <span className="amount font-medium">{formatToIDR(finalPricePerItem)}</span>
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
        {hasDiscount && (
          <span className="block text-xs text-gray-400 line-through font-normal">{formatToIDR(rowOriginalTotal)}</span>
        )}
        {formatToIDR(rowFinalTotal)}
      </td>
      <td className="py-15px md:py-5">
        <button
          className="hover:text-primaryColor"
          onClick={handleDeleteConfirm}
          disabled={deleteMutation.isPending}
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
