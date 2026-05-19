import { getAuthClient } from "@/api/grpc/client";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

export default async function VerifiedSuccessPage({ searchParams }) {
    unstable_noStore();//?“Jangan cache apapun dari request/render ini. Selalu jalankan ulang secara fresh.”

    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const email = searchParams.email;
    const client = getAuthClient();
    const meta = {
        meta: { "authorization": accessToken ? `Bearer ${accessToken}` : '' }
    };

    //  Validasi jika parameter tidak ada
    if (!email) {
        redirect("/auth/login?error=invalid_link");
    }

    try {
        await client.logout({
        }, meta);

    } catch (error) {
        console.error("LOGOUT ERROR:", error);
    }

    // Bungkus URL tujuan akhir dengan encodeURIComponent agar karakter '&' tidak merusak query string
    const targetUrl = `/login?message=verified&email=${encodeURIComponent(email)}`;
    redirect(`/auth/logout-handler?callbackUrl=${encodeURIComponent(targetUrl)}`);
    // redirect(`/login?message=verified&email=${email}`);

}