import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Scrollup from "../others/Scrollup";
import CartContextProvider from "@/contexts/CartContext";
import WishlistContextProvider from "@/contexts/WshlistContext";
import { getCartClient } from "@/api/grpc/client";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";

const PageWrapper = async ({ children }) => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const accessToken = session?.accessToken;
  const verifiedAt = session?.user?.verifiedAt;
  const role = session?.user?.role;
  const isAuthenticated = session;
  const userVerified = isAuthenticated && verifiedAt;
  const userNotVerified = isAuthenticated && !verifiedAt;
  const verifyUrl = `/auth/verify-email-required?email=${encodeURIComponent(email)}`;



  // * 1. Default value untuk Guest
  let cartCount = 0;

  // * 2. Hanya panggil API jika ada accessToken (User sudah Login)
  if (accessToken) {
    try {
      const client = getCartClient();
      const res = await client.cartCount({}, {
        meta: {
          "authorization": `Bearer ${accessToken}`
        }
      });


      // * Konversi aman: gRPC int64 (BigInt) ke Number JS
      // * toString() menangani "1n" dan Number() mengubahnya jadi angka 1
      cartCount = Number(res.response.count);

    } catch (error) {
      console.error("Error fetching cart count:", error);
      // Jika API error, kita biarkan cartCount tetap 0 agar UI tidak pecah
      cartCount = 0;
    }
  }

  return (
    <>
      <CartContextProvider>
        {/* header */}
        <Header
          accessToken={accessToken}
          cartCount={cartCount}
          isAuthenticated={isAuthenticated}
          userVerified={userVerified}
          userNotVerified={userNotVerified}
          verifyUrl={verifyUrl}
          role={role}
        />

        {/* main */}
        <WishlistContextProvider>{children}</WishlistContextProvider>
      </CartContextProvider>

      {/* footer */}
      <Footer />

      {/* scroll up */}
      <Scrollup />
    </>
  );
};

export default PageWrapper;
