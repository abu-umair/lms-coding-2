import CartPrimary from "@/components/sections/cart/CartPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

const CartMain = ({ cartData }) => {
  return (
    <>
      <HeroPrimary path={"Cart"} title={"Cart"} />
      <CartPrimary cartData={cartData} />
    </>
  );
};

export default CartMain;
