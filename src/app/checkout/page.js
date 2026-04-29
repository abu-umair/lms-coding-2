import { getAuthClient, getCartClient } from "@/api/grpc/client";
import CheckoutMain from "@/components/layout/main/ecommerce/CheckoutMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | Edurock - Education LMS Template",
  description: "Checkout | Edurock - Education LMS Template",
};

const Checkout = async () => {
  const clientCart = getCartClient();
  const clientAuth = getAuthClient();
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  let cartData = []; // Default value jika terjadi error
  let userData = []; // Default value jika terjadi error

  try {
    const [cartRes, userRes] = await Promise.all([
      clientCart.listCart({}, { meta: { authorization: `Bearer ${accessToken}` } }),
      clientAuth.getProfileUser({}, { meta: { authorization: `Bearer ${accessToken}` } })
    ]);
    cartData = cartRes.response.items || [];
    userData = userRes.response || [];
    console.log("cart data saya : ", cartData.length);


    if (cartData.length == 0 || userData.length == 0) {
      redirect("/");
    }
  } catch (error) {
    // 1. Log error ke console server (untuk debugging)
    console.error("gRPC listCart Error:", error);



    // 2. Opsi: Lempar ke file error.js bawaan Next.js
    // throw error; 

    // 3. Opsi: Biarkan kosong tapi tampilkan pesan (paling aman untuk UI)
    cartData = [];
    userData = [];
    redirect("/");
  }

  return (
    <PageWrapper>
      <main>
        <CheckoutMain cartData={cartData} userData={userData} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Checkout;
