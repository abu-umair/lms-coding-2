import CheckoutPrimary from "@/components/sections/checkout/CheckoutPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CheckoutMain = ({ cartData, userData }) => {
  return (
    <>
      <HeroPrimary path={"Checkout"} title={"Checkout"} />
      <CheckoutPrimary cartData={cartData} userData={userData} />
    </>
  );
};

export default CheckoutMain;
