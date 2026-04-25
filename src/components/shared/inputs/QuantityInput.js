"use client";
//* Import tools TanStack dan API Client
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import useGrpcApi from "@/components/shared/others/useGrpcApi";

const QuantityInput = ({ quantity, type, product }) => {
  const { callApi, isLoading } = useGrpcApi();

  //* Inisialisasi Query Client
  const queryClient = useQueryClient();

  //* Deklarasi Mutation untuk update quantity
  const updateMutation = useMutation({
    mutationFn: async ({ cartId, newQuantity }) => {
      return await callApi(
        getCartClient().updateCartQuantity({
          cartId: cartId,
          newQuantity: newQuantity,
        }),
        {
          // loadingMessage: "Updating quantity...",
          // successMessage: "Quantity updated!",
          useDefaultError: false,
        }
      );
    },
    //* PINDAHKAN onSuccess ke sini jika sebelumnya tidak terpanggil
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-data"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  const updateCartQuantityHandler = (cartId, action) => {
    //* Cegah double click jika proses masih jalan
    if (updateMutation.isPending) return;

    let newQuantity = quantity;

    if (action === 'increment') {
      newQuantity = quantity + 1;
    } else if (action === 'decrement' && quantity > 1) {
      newQuantity = quantity - 1;
    } else {
      return; // Jangan lakukan apa-apa jika decrement di angka 1
    }

    //* Jalankan mutation
    updateMutation.mutate({ cartId, newQuantity });
  };

  const isDecrementDisabled = quantity <= 1 || updateMutation.isPending;

  return (
    <div
      className={`max-w-150px h-55px leading-55px border-2 border-borderColor2 dark:border-borderColor2-dark relative overflow-hidden ${type === "box" ? "inline-block" : "rounded-full"
        }`}
    >
      <input
        type="number"
        //* Nilai input sekarang murni dari props (Single Source of Truth)
        value={quantity}
        readOnly
        className={`w-full focus:outline-none bg-transparent text-center ${type === "box" ? "" : "rounded-full"
          } `}
      />
      <div>
        <button
          //* Tambahkan visual feedback saat loading atau disabled
          className={`absolute left-[10px] top-1/2 -translate-y-1/2 text-blackColor dark:text-blackColor-dark p-x-10px leading-1.8 w-5 inline-block ${isDecrementDisabled ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
          onClick={() => updateCartQuantityHandler(product.cartId, 'decrement')}
          disabled={isDecrementDisabled}
        >
          -
        </button>
        <button
          className={`absolute top-1/2 -translate-y-1/2 right-[10px] text-blackColor dark:text-blackColor-dark p-x-10px leading-1.8 w-5 inline-block ${updateMutation.isPending ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
          onClick={() => updateCartQuantityHandler(product.cartId, 'increment')}
          disabled={updateMutation.isPending}
        >
          +
        </button>
      </div>

      {/* Opsi: Tambahkan loading spinner kecil jika sedang pending */}
      {/* {updateMutation.isPending && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-primaryColor border-t-transparent rounded-full animate-spin"></span>
        </div>
      )} */}
    </div>
  );
};

export default QuantityInput;