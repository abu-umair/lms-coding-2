import { getAuthClient, getCartClient } from "@/api/grpc/client";
import CheckoutMain from "@/components/layout/main/ecommerce/CheckoutMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Checkout | Edurock - Education LMS Template",
  description: "Checkout | Edurock - Education LMS Template",
};

const Checkout = async () => {
  // 1. Ambil session langsung dari server
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  return (
    <PageWrapper>
      <main>
        <CheckoutMain accessToken={accessToken} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Checkout;