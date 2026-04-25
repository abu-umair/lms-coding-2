import { getCartClient } from "@/api/grpc/client";
import CartMain from "@/components/layout/main/ecommerce/CartMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";




export const metadata = {
  title: "Cart | Edurock - Education LMS Template",
  description: "Cart | Edurock - Education LMS Template",
};

const Cart = async () => {
  const client = getCartClient();
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  let cartData = []; // Default value jika terjadi error

  try {
    const res = await client.listCart({}, {
      meta: {
        "authorization": `Bearer ${accessToken}`
      }
    });
    cartData = res.response.items || [];
  } catch (error) {
    // 1. Log error ke console server (untuk debugging)
    console.error("gRPC listCart Error:", error);

    // 2. Opsi: Lempar ke file error.js bawaan Next.js
    // throw error; 

    // 3. Opsi: Biarkan kosong tapi tampilkan pesan (paling aman untuk UI)
    cartData = [];
  }




  return (
    <PageWrapper>
      <main>
        <CartMain cartData={cartData} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Cart;
