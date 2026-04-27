"use client";
//* Import tools TanStack dan API Client
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartClient } from "@/api/grpc/client";
import toast from "react-hot-toast";
import useGrpcApi from "@/components/shared/others/useGrpcApi";

//* Import useCallback dan useState
import { useCallback, useState, useEffect } from "react";
import debounce from "lodash.debounce";

const QuantityInput = ({ quantity: serverQuantity, type, product }) => {
  const { callApi, isLoading } = useGrpcApi();

  //* Inisialisasi Query Client
  const queryClient = useQueryClient();

  //* 1. State Lokal untuk UI yang instan (Optimistic UI)
  const [localQuantity, setLocalQuantity] = useState(serverQuantity);

  //* Sinkronisasi jika data server berubah (misal dari tab lain)
  useEffect(() => {
    setLocalQuantity(serverQuantity);
  }, [serverQuantity]);

  //* Deklarasi Mutation untuk update quantity
  const updateMutation = useMutation({
    mutationFn: async ({ cartId, newQuantity }) => {
      return await callApi(
        getCartClient().updateCartQuantity({
          cartId: cartId,
          newQuantity: newQuantity,
        }),
        {
          showToast: false,
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

  //* 3. Fungsi Debounce (Menunggu user berhenti klik selama 500ms)
  const debouncedUpdate = useCallback(
    debounce((cartId, finalQty) => {
      updateMutation.mutate({ cartId, newQuantity: finalQty });
    }, 500),
    []
  );

  const updateCartQuantityHandler = (action) => {

    let nextQty = localQuantity;

    if (action === 'increment') {
      nextQty = localQuantity + 1;
    } else if (action === 'decrement' && localQuantity > 1) {
      nextQty = localQuantity - 1;
    } else {
      return; // Jangan lakukan apa-apa jika decrement di angka 1
    }

    //* Update tampilan secara instan (UI kencang)
    setLocalQuantity(nextQty);

    //* Kirim ke API dengan debounce (Mencegah spam ke DB)
    debouncedUpdate(product.cartId, nextQty);
  };


  return (
    <div
      className={`max-w-150px h-55px leading-55px border-2 border-borderColor2 dark:border-borderColor2-dark relative overflow-hidden ${type === "box" ? "inline-block" : "rounded-full"
        }`}
    >
      <input
        type="text"
        //* Nilai input sekarang murni dari props (Single Source of Truth)
        value={localQuantity}
        readOnly
        className={`w-full focus:outline-none bg-transparent text-center ${type === "box" ? "" : "rounded-full"
          } `}
      />
      <div>
        <button
          //* Tambahkan visual feedback saat loading atau disabled
          className={`absolute left-[10px] top-1/2 -translate-y-1/2 text-blackColor dark:text-blackColor-dark p-x-10px leading-1.8 w-5 inline-block 
            ${localQuantity <= 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer hover:text-primaryColor"
            }`}
          onClick={() => updateCartQuantityHandler('decrement')}
          disabled={localQuantity <= 1} //* Button tidak bisa diklik jika qty 1
        > -
        </button>
        <button
          className={`absolute top-1/2 -translate-y-1/2 right-[10px] text-blackColor dark:text-blackColor-dark p-x-10px leading-1.8 w-5 inline-block cursor-pointer hover:text-primaryColor
            }`}
          onClick={() => updateCartQuantityHandler('increment')}
        > +
        </button>
      </div >
    </div >
  );
};

export default QuantityInput;