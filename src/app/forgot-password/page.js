import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ForgotPasswordMain from "../../components/layout/main/ForgotPasswordMain";


export const metadata = {
  title: "Forgot Password | Edurock - Education LMS Template",
  description: "Forgot Password | Edurock - Education LMS Template",
};
const ForgotPassword = ({ searchParams }) => {

  const email = searchParams.email;


  return (
    <PageWrapper>
      <main>
        <ForgotPasswordMain
          email={email}
        />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default ForgotPassword;
