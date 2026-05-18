import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
// import GuestGuard from "@/components/auth/GuestGuard";


export const metadata = {
  title: "Login/Register | Edurock - Education LMS Template",
  description: "Login/Register | Edurock - Education LMS Template",
};
const Login = ({ searchParams }) => {

  const message = searchParams.message;
  const email = searchParams.email;


  return (
    // <GuestGuard>
    <PageWrapper>
      <main>
        <LoginMain
          message={message}
          email={email}
        />
        <ThemeController />
      </main>
    </PageWrapper>
    // </GuestGuard>
  );
};

export default Login;
