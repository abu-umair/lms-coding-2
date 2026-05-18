// src/app/verify-email/page.tsx
import { getAuthClient } from "@/api/grpc/client";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";



export default async function VerifyEmailPage({ searchParams }) {
    //? Untuk halaman security/auth/token:
    unstable_noStore();//?“Jangan cache apapun dari request/render ini. Selalu jalankan ulang secara fresh.”

    const token = searchParams.token;
    const email = searchParams.email;
    console.log(token);
    console.log("ini email", email);
    let errorType = "unknown";
    let isSuccess = false;
    let shouldRedirectAlreadyVerified = false;

    const client = getAuthClient();

    //  Validasi jika parameter tidak ada
    if (!token || !email) {
        redirect("/auth/login?error=invalid_link");
    }

    try {
        const res = await client.verifyEmail({
            codeOtp: token,
            email: email
        });

        const base = res.response.base;
        console.log("PESANNYA", base);


        // Cek jika status sukses
        if (Number(base.statusCode) === 200) {
            isSuccess = true;

        } else {
            const message = base.message;
            console.log("Server melapor error:", message);

            switch (message) {
                case "OTP sudah kadaluarsa":
                    errorType = "expired";
                    break;
                case "OTP tidak ditemukan atau kadaluarsa":
                case "kode OTP salah":
                    errorType = "wrong_code";
                    break;
                case "Email already verified":
                    shouldRedirectAlreadyVerified = true;
                default:
                    errorType = "invalid";
            }
        }
    } catch (err) {
        console.error("gRPC Connection Error:", err);
        errorType = "server_error";
    }

    if (isSuccess) {
        redirect(
            `/auth/verified-success?email=${email}`
        );
    }

    if (shouldRedirectAlreadyVerified) {
        redirect("/login?message=already_verified");
    }

    // Redirect ke halaman error jika sampai di titik ini
    redirect(`/auth/verify-error?type=${errorType}&email=${email}`);


}