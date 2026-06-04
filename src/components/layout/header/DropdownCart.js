"use client";
import Image from "next/image";
import Link from "next/link";
import countTotalPrice from "@/libs/countTotalPrice";
import useIsTrue from "@/hooks/useIsTrue";
import { useCartContext } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";


const DropdownCart = ({ isHeaderTop, cartCount, isAuthenticated, userVerified, userNotVerified, verifyUrl }) => {
  const { cartProducts, deleteProductFromCart } = useCartContext();

  // calculate total price
  const totalPrice = countTotalPrice(cartProducts);
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const totalProduct = cartProducts?.length;

  let cartUrl = "/login";

  if (userVerified) {
    cartUrl = "/carts";
  } else if (userNotVerified) {
    cartUrl = verifyUrl;
  }


  const { data: liveCartCount } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => {
      const res = await getCartClient().cartCount({});
      return res.response.count || 0;
    },
    // INI KUNCINYA: Gunakan data dari server sebagai nilai awal
    initialData: cartCount,
    enabled: !!userVerified //?(true) 
    //? hanya hit API jika user login dan sudah terverifikasi
  });
  return (
    <>
      <Link
        href={cartUrl}
        className={`relative ${isHeaderTop
          ? "block"
          : isHome4 || isHome4Dark || isHome5 || isHome5Dark
            ? "block lg:hidden"
            : "block"
          }`}
      >
        <i className="icofont-cart-alt text-2xl text-blackColor group-hover:text-primaryColor transition-all duration-300 dark:text-blackColor-dark"></i>
        <span
          className={`${totalProduct < 10 ? "px-1 py-[2px]" : "px-3px pb-1 pt-3px"
            } absolute -top-1 2xl:-top-[5px] -right-[10px] lg:right-3/4 2xl:-right-[10px] text-[10px] font-medium text-white dark:text-whiteColor-dark bg-secondaryColor2 leading-1 rounded-full z-50 block`}
        >
          {liveCartCount}
        </span>
      </Link>

    </>
  );
};

export default DropdownCart;
