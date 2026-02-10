import { signOut } from 'next-auth/react';
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";



//* logout/signout
export const handleLogout = async (router: any, callApi: any) => {
    await callApi(
        getAuthClient().logout({}),
        {
            loadingMessage: "Waiting logout...",
            successMessage: "Logout berhasil!",
            onSuccess: async () => {
                await signOut({ redirect: false });
                router.push("/login");
                router.refresh();
            },
            useDefaultError: false,
            defaultError: async (res) => {
                toast.error("Gagal logout!");
                await signOut({ redirect: false });
                router.push("/login");
            }
        }
    );
    router.push("/login");
    router.refresh();

};