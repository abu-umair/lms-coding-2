"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setGrpcCache, clearGrpcCache } from "@/api/grpc/auth-interceptor";

export default function GrpcSyncProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && (session as any)?.accessToken) {
            // Simpan ke cache saat login/refresh
            setGrpcCache((session as any).accessToken);
        } else if (status === "unauthenticated") {
            // Hapus cache saat logout
            clearGrpcCache();
        }
    }, [session, status]);

    return <>{children}</>;
}