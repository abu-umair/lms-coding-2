// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions"; // Import konfigurasi dari file baru

// NextAuth akan menghasilkan handler untuk GET dan POST
const handler = NextAuth(authOptions);

// Export named exports untuk semua metode HTTP yang diperlukan NextAuth
export { handler as GET, handler as POST };