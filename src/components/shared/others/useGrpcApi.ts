// hooks/useGrpcApi.ts
import { FinishedUnaryCall, RpcError, type UnaryCall } from '@protobuf-ts/runtime-rpc';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { BaseResponse } from '@/../pb/common/base_response';

// Interface untuk memastikan response memiliki struktur 'base'
interface GrpcBaseResponse {
    base?: BaseResponse;
}

interface CallApiArgs<T extends object, U extends GrpcBaseResponse> {
    loadingMessage?: string;   // Pesan saat proses berjalan
    successMessage?: string;   // Pesan sukses (opsional)
    useDefaultError?: boolean; // Jika false, toast error otomatis tidak muncul
    defaultError?: (res: FinishedUnaryCall<T, U>) => void; // Callback jika backend kirim isError: true
    onSuccess?: (res: FinishedUnaryCall<T, U>) => void;    // Callback jika berhasil
}

const useGrpcApi = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const callApi = async <T extends object, U extends GrpcBaseResponse>(
        api: UnaryCall<T, U>,
        args?: CallApiArgs<T, U>
    ) => {
        const {
            useDefaultError = true,
            loadingMessage = "Sedang memproses...",
            successMessage
        } = args || {};

        // 1. Munculkan Loading Toast
        const toastId = toast.loading(loadingMessage);

        try {
            setIsLoading(true);
            const res = await api;

            // 2. Cek Error Bisnis dari Backend (Contoh: Password Salah)
            if (res.response.base?.isError) {
                toast.dismiss(toastId);

                if (!useDefaultError && args?.defaultError) {
                    // Jalankan logika custom di komponen (tanpa double toast)
                    args.defaultError(res);
                } else if (useDefaultError) {
                    // Jalankan toast error default
                    toast.error(res.response.base.message || "Terjadi kesalahan.");
                }

                // Lempar objek 'res' agar masuk ke blok catch dan menghentikan alur selanjutnya
                // throw res;
                throw res.response.base?.isError;
            }

            // 3. Jika Benar-benar Sukses
            toast.dismiss(toastId);
            if (successMessage) {
                toast.success(successMessage);
            }

            if (args?.onSuccess) {
                args.onSuccess(res);
            }

            return res;

        } catch (e: any) {
            // Pastikan loading ditutup jika terjadi error apa pun
            toast.dismiss(toastId);

            // A. Handle jika ini adalah RpcError (Masalah Network/Auth)
            if (e instanceof RpcError) {
                if (e.code === 'UNAUTHENTICATED') {
                    toast.error("Sesi berakhir, silakan login ulang.");
                    // signOut({ callbackUrl: '/login' });
                } else if (useDefaultError) {
                    toast.error(`Error: ${e.message}`);
                }
            }
            // B. Handle jika ini adalah error buatan kita (isError: true)
            // Kita tidak perlu memunculkan toast lagi karena sudah dihandle di atas
            else if (e?.response?.base) {
                // Biarkan catch menangkap tanpa toast tambahan
                console.log("Business logic error handled");
            }
            // C. Handle Error Sistem/JavaScript umum
            else {
                toast.error("Terjadi kesalahan sistem.");
            }

            // Lempar kembali error agar komponen tahu bahwa proses gagal
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, callApi };
};

export default useGrpcApi;