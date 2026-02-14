// api/grpc/auth-interceptor.ts
import { RpcInterceptor, UnaryCall, NextUnaryFn, MethodInfo, RpcOptions } from "@protobuf-ts/runtime-rpc";
import { signOut } from "next-auth/react";

let cachedToken: string | null = null;

export const setGrpcCache = (token: string) => {
    console.log("CACHE SET: Token masuk ke interseptor");
    cachedToken = token;
};

export const clearGrpcCache = () => {
    cachedToken = null;
};

export const authInterceptor: RpcInterceptor = {
    interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {

        // 1. Logic Request: Pasang Token dari Cache
        // Kita tidak perlu getSession() di sini karena GrpcSyncProvider 
        // sudah menjamin cachedToken terisi saat aplikasi dimuat.
        if (cachedToken) {
            options.meta = {
                ...options.meta,
                authorization: `Bearer ${cachedToken}`
            };
        } else {
            // Ini yang menyebabkan error Unauthenticated di Go
            console.error("INTERCEPTOR ERROR: cachedToken masih KOSONG saat request dikirim!");
        }

        // 2. Jalankan Request
        const call = next(method, input, options);

        // 3. Logic Response: Cek Error (menggunakan .then untuk menghindari async/await)
        // call.response.catch((error) => {
        //     if (error.code === "UNAUTHENTICATED") {
        //         console.warn("Sesi berakhir, mengarahkan ke login...");
        //         clearGrpcCache();
        //         if (typeof window !== "undefined") {
        //             signOut({ callbackUrl: "/login" });
        //         }
        //     }
        // });

        return call;
    },
};