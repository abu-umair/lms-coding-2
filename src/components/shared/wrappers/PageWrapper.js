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
  const accessToken = session?.accessToken;
  const verifiedAt = session?.verifiedAt;
  const email = session?.email;
  console.log("ini session : ", session);
  console.log("ini accessToken : ", accessToken);


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
          cartCount={cartCount}
          verifiedAt={verifiedAt}
          email={email}
          session={session} />

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
