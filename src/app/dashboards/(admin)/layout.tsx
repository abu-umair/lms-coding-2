// app/(admin)/layout.tsx
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={["admin"]}>
            {/* Kamu bisa tambah Sidebar Admin di sini jika perlu */}
            {children}
        </AuthGuard>
    );
}