import CheckoutPrimary from "@/components/sections/checkout/CheckoutPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CheckoutMain = ({ accessToken }) => {
  return (
    <>
      <HeroPrimary path={"Checkout"} title={"Checkout"} />
      <CheckoutPrimary accessToken={accessToken} />
    </>
  );
};

export default CheckoutMain;
