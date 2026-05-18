import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LoginTab from "@/components/sections/login/LoginTab";

const LoginMain = ({ message, email }) => {
  return (
    <>
      <HeroPrimary path={"Log In"} title={"Log In"} />
      <LoginTab
        message={message}
        email={email} />
    </>
  );
};

export default LoginMain;
