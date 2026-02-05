"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

// Definisikan tipe data agar TypeScript tidak error
interface AuthGuardProps {
    children: ReactNode;
    allowedRoles: string[]; // Sekarang kita bisa kirim ["admin"], ["instructor"], dll.
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';

    useEffect(() => {
        if (!isLoading) {
            // 1. Cek Login
            if (status === 'unauthenticated') {
                router.replace('/login');
                return;
            }

            // 2. Cek Role secara dinamis
            const userRole = (session?.user as any)?.role;

            // Cek apakah role user ada di dalam daftar allowedRoles
            const hasAccess = Array.isArray(userRole)
                ? userRole.some(r => allowedRoles.includes(r))
                : allowedRoles.includes(userRole);

            if (status === 'authenticated' && !hasAccess) {
                router.replace('/403'); // Lempar ke halaman 403 jika role tidak cocok
            }
        }
    }, [status, session, isLoading, router, allowedRoles]);

    // Tampilan saat proses pengecekan
    if (isLoading || status === 'unauthenticated') {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold animate-pulse">Memeriksa Akses...</p>
            </div>
        );
    }

    // Jika role tidak cocok, jangan tampilkan children dulu sebelum diredirect
    const userRole = (session?.user as any)?.role;
    const hasAccess = Array.isArray(userRole)
        ? userRole.some(r => allowedRoles.includes(r))
        : allowedRoles.includes(userRole);

    if (!hasAccess) return null;

    return <>{children}</>;
};

export default AuthGuard;