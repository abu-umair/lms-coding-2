"use client";
import CartProduct from "@/components/shared/cart/CartProduct";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";
import { formatToIDR } from "@/utils/number";

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

  //* 1. HITUNG SUB-TOTAL (Sebelum Diskon) & TOTAL AKHIR (Setelah Diskon) SEKALIGUS
  const { totalGrossPrice, totalFinalPrice, totalDiscountNominal } = productsFromApi.reduce(
    (acc, item) => {
      const price = Number(item.coursePrice || item.course_price || 0);
      const qty = parseInt(item.quantity) || 0;
      const discountPercent = Number(item.courseDiscount || item.course_discount || 0);

      const originalItemTotal = price * qty;
      const discountItemAmount = originalItemTotal * (discountPercent / 100);
      const finalItemTotal = originalItemTotal - discountItemAmount;

      acc.totalGrossPrice += originalItemTotal;
      acc.totalFinalPrice += finalItemTotal;
      acc.totalDiscountNominal += discountItemAmount;
      return acc;
    },
    { totalGrossPrice: 0, totalFinalPrice: 0, totalDiscountNominal: 0 }
  );
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
                  Gambar
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Produk
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Harga
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Jumlah
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Total
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {!isCartProduct ? (
                <tr className="relative">
                  <td className="p-5 md:p-10 ">
                    <p className="absolute left-0 top-0 w-full h-full flex items-center justify-center  md:text-xl font-bold capitalize opacity-70 ">
                      Keranjang belanja Anda masih kosong
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
                      discount: product.courseDiscount || 0,
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
              href={"/#courses"}
              className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
            >
              LANJUTKAN BELANJA
            </Link>
          </div>

        </div>

        {/* cart input */}
        <div className="lg:flex lg:justify-end">
          <div className="lg:w-1/3 w-full">
            <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">

              {/* Judul Komponen */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Ringkasan Keranjang
                </h3>
                <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-full">
                  {productsFromApi.length} Jenis Produk
                </span>
              </div>

              {/* Rincian Harga */}
              <div className="space-y-3 text-sm pt-2">
                <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal Produk</span>
                  <span className="font-medium">{formatToIDR(totalGrossPrice)}</span>
                </div>

                {/* Baris potongan diskon hanya muncul jika nominal diskon > 0 */}
                {totalDiscountNominal > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Potongan Diskon</span>
                    <span>-{formatToIDR(totalDiscountNominal)}</span>
                  </div>
                )}

                <div className="h-1px w-full bg-zinc-100 dark:bg-zinc-800 my-2"></div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Total Pembayaran</span>
                  <span className="text-xl font-black text-primaryColor tracking-tight">
                    {formatToIDR(totalFinalPrice)}
                  </span>
                </div>
              </div>

              {/* Tombol Checkout */}
              <div className="pt-4">
                <Link
                  href="/checkout"
                  className={`block text-center text-sm font-semibold tracking-wide text-white bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor px-5 py-4 rounded-xl shadow-md transition-all duration-300 active:scale-[0.99] ${totalFinalPrice ? "" : "pointer-events-none bg-zinc-300 dark:bg-zinc-800 text-zinc-400 opacity-60 shadow-none"
                    }`}
                >
                  LANJUT KE PEMBAYARAN
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
