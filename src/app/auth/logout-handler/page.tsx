"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LogoutHandler() {
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get("callbackUrl");

    useEffect(() => {
        const run = async () => {
            await signOut({
                redirect: true,
                callbackUrl: callbackUrl || "/login"
            });
        };

        run();
    }, [callbackUrl]);

    return null;
}