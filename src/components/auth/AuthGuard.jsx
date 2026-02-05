"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Tentukan role yang diizinkan (misalnya: hanya ADMIN)
const REQUIRED_ROLE_ADMIN = "admin";

const AuthGuard = ({ children }) => {

    const { data: session, status } = useSession();
    const router = useRouter();

    // Status loading, tampilkan spinner/loading screen
    const isLoading = status === 'loading';

    useEffect(() => {
        if (!isLoading) {
            const userRoles = session?.user?.role || [];

            // 1. Cek apakah sudah login (status 'unauthenticated')
            if (status === 'unauthenticated') {
                router.replace('/login'); // Redirect ke login
                return;
            }

            // 2. Cek apakah user memiliki ROLE yang dibutuhkan
            const hasRequiredRole = Array.isArray(userRoles)
                ? userRoles.includes(REQUIRED_ROLE_ADMIN)
                : userRoles === REQUIRED_ROLE_ADMIN;

            if (status === 'authenticated' && !hasRequiredRole) {
                // Jika login tapi tidak punya role ADMIN
                // Tampilkan pesan error atau redirect ke halaman 403
                router.replace('/403');
            }
        }
    }, [status, session, isLoading, router]);


    if (isLoading || status === 'unauthenticated' || status === 'authenticated' && !session?.user?.role?.includes(REQUIRED_ROLE_ADMIN)) {
        // Tampilkan Loading atau Null hingga hasil akhir diketahui
        return <div>Loading... atau Sedang memeriksa izin...</div>;
    }

    // Jika semua cek lolos dan user adalah ADMIN
    return children;
};

export default AuthGuard;