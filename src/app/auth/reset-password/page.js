import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ResetPasswordMain from "@/components/layout/main/ResetPasswordMain";


export const metadata = {
  title: "Reset Password | Edurock - Education LMS Template",
  description: "Reset Password | Edurock - Education LMS Template",
};
const ResetPassword = ({ searchParams }) => {

  const token = searchParams.token;
  const email = searchParams.email;


  return (
    <PageWrapper>
      <main>
        <ResetPasswordMain
          token={token}
          email={email}
        />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default ResetPassword;
