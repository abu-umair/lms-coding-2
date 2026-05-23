import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ResetPasswordTab from "@/components/sections/reset-password/ResetPasswordTab";

const ResetPasswordMain = ({ token, email }) => {
  return (
    <>
      <HeroPrimary path={"Reset Password"} title={"Reset Password"} />
      <ResetPasswordTab
        token={token}
        email={email} />
    </>
  );
};

export default ResetPasswordMain;
