"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';

    useEffect(() => {
        if (!isLoading && status === 'authenticated') {
            // Ambil role untuk menentukan tujuan redirect
            const userRole = (session?.user as any)?.role;

            // Redirect berdasarkan role
            if (userRole === "admin") {
                router.replace('/dashboards/admin-dashboard');
            } else if (userRole === "instructor") {
                router.replace('/dashboards/instructor-dashboard');
            } else {
                router.replace('/dashboards/student-dashboard');
            }
        }
    }, [status, isLoading, router, session]);

    // Jika masih loading atau sudah login, jangan tampilkan form login
    if (isLoading || status === 'authenticated') {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold animate-pulse">Mengalihkan halaman...</p>
            </div>
        );
    }

    // Jika belum login (unauthenticated), tampilkan form login
    return <>{children}</>;
};

export default GuestGuard;