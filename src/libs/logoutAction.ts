import { signOut } from 'next-auth/react';
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";


//* logout/signout
export const handleLogout = async (accessToken: string) => {
    // 1. Tampilkan Loading
    const loadingToast = toast.loading("Sedang keluar...");

    try {
        // 2. Panggil gRPC Go untuk mematikan token (Server-side)
        const client = getAuthClient();

        await client.logout({
            // Kirim token agar backend Go bisa mem-blacklist atau menghapusnya
            accessToken: accessToken
        });

        // 3. Hapus Session di Browser via NextAuth
        toast.dismiss(loadingToast);
        toast.success("Berhasil keluar!");

        await signOut({ callbackUrl: "/login" });

    } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Gagal logout di server:", error);
        // Tetap logout di browser meskipun server gagal (opsional)
        await signOut({ callbackUrl: "/login" });
    }
};