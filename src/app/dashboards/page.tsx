// app/dashboards/page.tsx
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardsPage() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    // Arahkan user ke halaman spesifik berdasarkan role mereka saat membuka /dashboards
    if (role === "admin") {
        redirect("/dashboards/admin/admin-dashboard");
    } else if (role === "instructor") {
        redirect("/dashboards/instructor/instructor-dashboard");
    } else {
        redirect("/dashboards/student/student-dashboard");
    }

}