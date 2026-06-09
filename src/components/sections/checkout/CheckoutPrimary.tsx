"use client";

import { getAuthClient, getCartClient, getOrderClient } from "@/api/grpc/client";
import FormInput from "@/components/shared/form-input/FormInput";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { CheckoutSchema, CheckoutFormData } from "@/libs/validationSchemaCheckout";
import { formatToIDR } from "@/utils/number";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";


interface UserProfileResponse {
  fullName?: string;
  email?: string;
}


const CheckoutPrimary = ({ accessToken }) => {
  const router = useRouter();
  const { callApi, isLoading: isSubmitting } = useGrpcApi();
  const queryClient = useQueryClient();


  // 1. Ambil data profil user secara dinamis
  const { data: userData } = useSuspenseQuery<UserProfileResponse>({
    queryKey: ["checkout-user-profile", accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return {}; // Kembalikan objek kosong jika token belum siap saat SSR / refresh
      }
      try {
        const res = await getAuthClient().getProfileUser({}, {
          metadata: { authorization: `Bearer ${accessToken}` }
        });
        return res.response || {};
      } catch (error) {
        console.error("Gagal memuat profil:", error);
        return {};
      }
    }
  });

  // 2. Ambil data cart secara dinamis 
  const { data: cartData } = useSuspenseQuery<any[]>({
    queryKey: ["checkout-cart-data", accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return []; // Kembalikan array kosong jika token belum ada
      }
      try {
        const res = await getCartClient().listCart({}, {
          metadata: { authorization: `Bearer ${accessToken}` }
        });
        return res.response?.items || [];
      } catch (error) {
        console.error("Gagal memuat keranjang:", error);
        return [];
      }
    },
    staleTime: 0,          // Menandakan data langsung basi agar tidak pernah membaca cache lokal browser
    refetchOnMount: true,  // Memaksa penarikan data ulang dari DB gRPC setiap kali halaman ini dirender
  });


  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    // PERUBAHAN: Menggunakan 'values' alih-alih 'defaultValues' agar form 
    // otomatis terisi begitu data dari useSuspenseQuery selesai ditarik (Reactive).
    values: {
      user_full_name: userData?.fullName || "",
      email: userData?.email || "",
      phone: "",
      address: "",
    }
  });

  // Jika user mencoba masuk ke checkout tapi keranjang kosong, kembalikan ke home tanpa hard reload
  // Pindahkan logika redirect ke dalam useEffect agar aman dari SSR
  useEffect(() => {
    if (cartData.length === 0) {
      router.replace("/");
    }
  }, [cartData, router]);

  // fallback return null agar server tetap sukses merender struktur HTML kosong sementara waktu
  if (cartData.length === 0) {
    return null;
  }

  const isProducts = cartData && cartData.length > 0;

  // Menghitung total harga kotor sebelum diskon (Gross Subtotal)
  const totalGrossPrice = cartData.reduce((acc, item) => {
    const price = Number(item.coursePrice);
    const qty = Number(item.quantity);
    return acc + (price * qty); //? acc adalah penampung hasil sementara. dan 0 adalah nilai awal
  }, 0);

  // Menghitung akumulasi nominal potongan diskon berdasarkan persentase (courseDiscount) tiap item
  const totalDiscountNominal = cartData.reduce((acc, item) => {
    const price = Number(item.coursePrice);
    const qty = Number(item.quantity);
    const discountPercent = Number(item.courseDiscount || 0); // Mengambil nilai persen diskon dari API (misal: 10 untuk 10%)

    const itemDiscountAmount = price * (discountPercent / 100) * qty;
    return acc + itemDiscountAmount;
  }, 0);

  // Total akhir pembayaran yang bersih (Subtotal - Total Potongan Diskon)
  const totalPrice = Math.max(0, totalGrossPrice - totalDiscountNominal);;


  const onSubmit = async (values: CheckoutFormData) => {
    const coursesPayload = cartData.map((item) => ({
      id: item.courseId,
      quantity: BigInt(item.quantity)
    }));

    console.log(values);
    console.log(coursesPayload);

    await callApi(
      getOrderClient().createOrder({
        fullName: values.user_full_name,
        // email: values.email,
        phoneNumber: values.phone,
        address: values.address,
        notes: '',
        courses: coursesPayload,

      }),
      {
        // loadingMessage: "Memperbarui kata sandi...",
        // successMessage: "Kata sandi berhasil diperbarui!", // Otomatis muncul toast success
        onSuccess: async (res) => {
          reset();
          //* 1. Ambil semua cartId yang ada di keranjang saat ini
          const cartIdsToDelete = cartData.map(item => item.cartId);

          //* 2. Eksekusi penghapusan semua item cart secara paralel
          try {
            await Promise.all(
              cartIdsToDelete.map(id =>
                getCartClient().deleteCart({ cartId: id })
              )
            );

            //* 3. Bersihkan cache TanStack Query agar UI sinkron
            queryClient.invalidateQueries({ queryKey: ["cart-data"] });
            queryClient.invalidateQueries({ queryKey: ["cart-count"] });

            //* 4. Pindah ke halaman sukses atau invoice
            router.replace(`/order/${res.response.id}`);
          } catch (error) {
            toast.error("Gagal checkout");
          }

          // *task
          //*buat halaman setelah buat checkout/order
          // router.push("/");
        },
        useDefaultError: true,

      }
    );
  };


  return (
    <section>
      <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30px gap-y-3">
            {/* left */}
            <div className="p-22px md:p-30px bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm text-zinc-800 dark:text-zinc-200">
              {/* heading */}
              <h4 className="text-xl text-blackColor dark:text-blackColor-dark font-bold pb-10px mb-5 border-b border-borderColor dark:border-borderColor-dark">
                <span className="leading-1.2">Detail Pembayaran</span>
              </h4>
              <div
                data-aos="fade-up"
              >
                <div className="mb-5">
                  <FormInput
                    lableRequired={true}
                    label="Nama Lengkap"
                    name="user_full_name"  // Type-safe: akan error jika salah ketik
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-x-30px gap-y-5 mb-5">
                  <div>
                    <FormInput
                      lableRequired={true}
                      label="Alamat Email"
                      name="email"  // Type-safe: akan error jika salah ketik
                      type="text"
                      placeholder="contoh@email.com"
                      register={register}
                      errors={errors}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <FormInput
                      lableRequired={true}
                      label="Nomor Telepon"
                      name="phone"  // Type-safe: akan error jika salah ketik
                      type="number"
                      placeholder="contoh: 8969999999"
                      register={register}
                      errors={errors}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <FormInput
                    lableRequired={true}
                    label="Alamat Lengkap"
                    name="address"  // Type-safe: akan error jika salah ketik
                    type="text"
                    placeholder="Tuliskan alamat pengiriman lengkap Anda"
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            {/* right */}
            <div className="p-22px md:p-30px bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm text-zinc-800 dark:text-zinc-200">
              {/* Header */}
              <h4 className="text-xl font-bold pb-3 mb-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="tracking-tight">Ringkasan Pesanan</span>
                <span className="text-xs bg-primaryColor/10 text-primaryColor px-2.5 py-1 rounded-full font-semibold">
                  {cartData?.length || 0} Item
                </span>
              </h4>

              {/* Daftar Produk */}
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-5px custom-scrollbar my-25px">
                {!isProducts ? (
                  <div className="text-center py-20px text-zinc-400 dark:text-zinc-500 text-sm">
                    Tidak ada produk di dalam keranjang.
                  </div>
                ) : (
                  cartData?.map(({ courseName, quantity, courseImageUrl, coursePrice, courseDiscount }, idx) => {
                    console.log("discount cuy : ", courseDiscount);
                    console.log("Price cuy : ", coursePrice);
                    console.log("Image cuy : ", courseImageUrl);

                    const hasDiscount = Number(courseDiscount) > 0;
                    const originalPrice = Number(coursePrice) * Number(quantity);
                    const discountAmount = originalPrice * (Number(courseDiscount) / 100);
                    const finalItemPrice = originalPrice - discountAmount;

                    return (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-x-4 pb-4 border-b border-zinc-50/60 dark:border-zinc-800/50 last:border-0 last:pb-0"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-700">
                          <Image
                            src={courseImageUrl}
                            alt={courseName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Nama produk dibiarkan penuh & rapi, tidak dipotong kasar */}
                          <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 break-words leading-relaxed">
                            {courseName}
                          </p>
                          <span className="inline-flex items-center text-xs text-zinc-400 dark:text-zinc-500 mt-1 ">
                            Qty: {Number(quantity)}
                          </span>
                          {hasDiscount && (
                            <span className="ms-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              Hemat {Number(courseDiscount)}%
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {hasDiscount && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                              {formatToIDR(originalPrice)}
                            </p>
                          )}
                          <p className="font-semibold text-sm  text-zinc-900 dark:text-zinc-100 ">
                            {formatToIDR(finalItemPrice)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Rincian Kalkulasi Pembayaran */}
              <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-3.5 text-sm">
                {/* Subtotal (Sebelum Diskon) */}
                <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal Produk</span>
                  <span className="font-medium ">{formatToIDR(totalGrossPrice)}</span>
                </div>

                {/* Baris Diskon Baru (Estetik & Interaktif) */}
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.379 3H5.5ZM6 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    Potongan Diskon
                  </span>
                  <span className="">
                    -{formatToIDR(totalDiscountNominal)}
                  </span>
                </div>

                {/* Total Utama */}
                <div className="flex justify-between items-center pt-15px border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base tracking-tight">Total Pembayaran</span>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primaryColor  tracking-tight">
                      {formatToIDR(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Premium */}
              <div className="mt-25px">
                <button
                  disabled={!isProducts || isSubmitting}
                  className="w-full text-center text-sm font-semibold tracking-wide text-white bg-primaryColor py-13px border border-primaryColor hover:bg-whiteColor hover:text-primaryColor transition-all duration-300 rounded-xl shadow-md shadow-primaryColor/10 hover:shadow-lg hover:shadow-primaryColor/20 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memproses Transaksi...
                    </span>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div >
    </section >
  );
};

export default CheckoutPrimary;
