import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ForgotPasswordTab from "@/components/sections/forgot-password/ForgotPasswordTab";

const ForgotPasswordMain = ({ message, email }) => {
  return (
    <>
      <HeroPrimary path={"Forgot Password"} title={"Forgot Password"} />
      <ForgotPasswordTab
        email={email} />
    </>
  );
};

export default ForgotPasswordMain;
