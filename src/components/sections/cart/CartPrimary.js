"use client";
import CartProduct from "@/components/shared/cart/CartProduct";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";
const CartPrimary = ({ cartData }) => {
  //* Gunakan useQuery agar TanStack "memegang" kendali data ini
  const { data: productsFromApi } = useQuery({
    queryKey: ["cart-data"],
    queryFn: async () => {
      const res = await getCartClient().listCart({}); // Tambahkan metadata auth jika perlu
      return res.response.items || [];
    },
    initialData: cartData, //* Data awal dari server component
  });

  // Hitung total harga berdasarkan data API
  // Karena 'quantity' di API Anda berupa string ("17"), pastikan di-parse saat kalkulasi
  //* Sinkronisasi Cart Totals: Menghitung total dari semua produk di cache TanStack
  const totalPrice = productsFromApi.reduce((acc, item) => {
    //* Pastikan menggunakan nama field yang benar dari gRPC (coursePrice / course_price)
    const price = item.coursePrice || item.course_price || 0;
    const qty = parseInt(item.quantity) || 0;
    return acc + (price * qty);
  }, 0);

  const isCartProduct = productsFromApi.length > 0;

  return (
    <section>
      <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
        {/* cert table */}
        <div className="text-contentColor dark:text-contentColor-dark text-size-10 md:text-base overflow-auto">
          <table className="table-fixed md:table-auto leading-1.8 text-center w-150 md:w-full overflow-auto border border-borderColor dark:border-borderColor-dark box-content md:box-border">
            <thead>
              <tr className="md:text-sm text-blackColor dark:text-blackColor-dark uppercase font-medium border-b border-borderColor dark:border-borderColor-dark">
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Image
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Product
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Price
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Quantity
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Total
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {!isCartProduct ? (
                <tr className="relative">
                  <td className="p-5 md:p-10 ">
                    <p className="absolute left-0 top-0 w-full h-full flex items-center justify-center  md:text-xl font-bold capitalize opacity-70 ">
                      empty
                    </p>
                  </td>
                </tr>
              ) : (
                productsFromApi.map((product, idx) => (
                  /* Map data API ke format yang dikenali komponen CartProduct */
                  <CartProduct
                    key={product.cartId || idx}
                    product={{
                      id: product.courseId,
                      title: product.courseName,
                      image: product.courseImageUrl,
                      price: product.coursePrice,
                      quantity: parseInt(product.quantity),
                      cartId: product.cartId,
                      isCourse: true
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* cart action buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px pt-22px pb-9 md:pt-30px md:pb-55px">
          <div>
            <Link
              href={"/courses"}
              className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
            >
              CONTINUE SHOPPING
            </Link>
          </div>

        </div>

        {/* cart input */}
        <div className="lg:flex lg:justify-end ">
          <div className="lg:w-1/3 grid grid-cols-1 lg:grid-cols-1 flex-col-reverse gap-30px ">
            <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor dark:border-borderColor-dark rounded-5px">
              {/* heading */}
              <div className="flex gap-x-4">
                <h3 className="text-lg whitespace-nowrap font-medium text-blackColor dark:text-blackColor-dark mb-9">
                  <span className="leading-1.2">Cart Total</span>
                </h3>
                <div className="h-1px w-full bg-borderColor2 dark:bg-borderColor2-dark mt-2"></div>
              </div>
              <h4 className="text-sm font-bold text-blackColor dark:text-blackColor-dark mb-5 flex justify-between items-center">
                <span className="leading-1.2">Cart Totals</span>
                <span className="leading-1.2 text-lg font-medium">
                  Rp {totalPrice ? totalPrice : 0}
                </span>
              </h4>
              <div>
                <Link
                  href="/checkout"
                  className={`text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 w-full px-10px py-18px bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor : text-center  ${totalPrice ? "" : "pointer-events-none opacity-85"
                    }`}
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPrimary;
