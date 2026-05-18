// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const userRole = token?.role as string | string[] | undefined;

        // Helper ringkas untuk cek role
        const hasRole = (roleName: string) => {
            if (!userRole) return false;
            return Array.isArray(userRole) ? userRole.includes(roleName) : userRole === roleName;
        };

        // -------------------------------------------------------------
        // 1. GUEST GUARD (Pencegahan untuk halaman Login / Register)
        // -------------------------------------------------------------
        // Jika user SUDAH login tapi nekat buka halaman login/register, 
        // arahkan mereka kembali ke beranda atau dashboard masing-masing.
        const isAuthPage = path.startsWith("/login") || path.startsWith("/register");
        if (isAuthPage && token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // -------------------------------------------------------------
        // 2. EMAIL VERIFICATION GUARD (Laravel Style Global)
        // -------------------------------------------------------------
        // Semua yang masuk area dashboards wajib diverifikasi email-nya
        if (path.startsWith("/dashboards") && !token?.verifiedAt) {
            const email = token?.email || "";
            return NextResponse.redirect(
                new URL("/", req.url)
            );
        }

        // -------------------------------------------------------------
        // 3. ROLE-BASED ACCESS CONTROL (Pengganti AuthGuard di Layout)
        // -------------------------------------------------------------

        // Proteksi Area Instructor
        if (path.startsWith("/dashboards/instructor") && !hasRole("instructor")) {
            return NextResponse.redirect(new URL("/403", req.url));
        }

        // Proteksi Area Student / User (Kasus Baru Anda)
        if (path.startsWith("/dashboards/student") && !hasRole("user")) {
            return NextResponse.redirect(new URL("/403", req.url));
        }

        // Proteksi Area Admin
        if (path.startsWith("/dashboards/admin") && !hasRole("admin")) {
            return NextResponse.redirect(new URL("/403", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Modifikasi authorized agar GuestGuard bisa bekerja
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                // Izinkan halaman login & register diakses tanpa token (untuk GuestGuard)
                if (path.startsWith("/login") || path.startsWith("/register")) {
                    return true;
                }
                // Rute lainnya (dashboards) WAJIB punya token (wajib login)
                return !!token;
            },
        },
    }
);

// Daftarkan semua rute yang ingin diawasi oleh middleware
export const config = {
    matcher: [
        "/dashboards/:path*",
        "/login",
        "/register"
    ],
};