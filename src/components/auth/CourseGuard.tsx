import { getEnrollmentClient } from "@/api/grpc/client";
import { redirect } from "next/navigation";

/**
 * Helper untuk mengecek kepemilikan kursus di sisi Server.
 */
export async function checkCourseUserBuy(courseId, accessToken) {
    if (!accessToken) {
        redirect("/login");
    }

    const client = await getEnrollmentClient();

    // Siapkan Metadata gRPC
    const meta = {
        meta: { "authorization": `Bearer ${accessToken}` }
    };

    try {
        const res = await client.detailEnrollByUserRole({
            courseId: courseId,
            fieldMask: { paths: ["id"] }
        }, meta);

        // Akses status code dari struktur gRPC Response Anda
        const statusCode = res?.response?.base?.statusCode;

        //! Jika status bukan 200, berarti tidak ada akses atau data tidak ditemukan
        if (Number(statusCode) != 200) {
            console.log("Access Denied: Status", statusCode);
            redirect("/dashboards/student-dashboard");
        }

        return res.response; // Kembalikan data enrollment jika sukses
    } catch (error) {
        // Jika gRPC error (misal: connection refused atau Unauthenticated)
        console.error("gRPC Guard Error:", error);
        redirect("/dashboards/student-dashboard");
    }
}