// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from 'next-auth/react';
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient } from "./../../pb/auth/auth.client"; // Path hasil generate proto kamu
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { jwtDecode } from "jwt-decode"; // Import decoder
import toast from "react-hot-toast";



// Definisikan tipe data sesuai isi token Anda
interface MyJwtPayload {
    sub: string;
    email: string;
    full_name: string;
    role: string;
}

// URL endpoint login Laravel Anda
const GoGrpc_LOGIN_URL = 'http://localhost:8080';
const LARAVEL_LOGOUT_URL = "http://127.0.0.1:8000/api/auth/logout";

//* login / sign 
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Go-gRPC",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // 1. Setup Transport gRPC
                const transport = new GrpcWebFetchTransport({
                    baseUrl: GoGrpc_LOGIN_URL, // URL Backend Go kamu
                });
                const client = new AuthServiceClient(transport);

                try {
                    // 2. Panggil service login gRPC
                    const res = await client.login({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    // 3. Cek response (sesuai logika isError kamu)
                    if (res.response.base?.isError) {
                        // throw new Error("UNAUTHENTICATED");
                        toast.error("Login Gagal! silakan coba beberapa saat lagi.");
                    }

                    // --- BAGIAN PENTING: Decode Token ---
                    const decoded = jwtDecode<MyJwtPayload>(res.response.accessToken);

                    // 4. Return data user untuk disimpan di JWT NextAuth (local storage)
                    return {
                        id: decoded.sub, // Ambil ID dari "sub"
                        name: decoded.full_name,
                        email: decoded.email,
                        role: decoded.role,
                        accessToken: res.response.accessToken,
                    };

                } catch (e) {
                    // console.log(e.code);
                    // console.log(e.message);

                    if (e instanceof RpcError) {
                        if (e.code === 'UNAUTHENTICATED') {
                            toast.error("Email atau password salah.");
                        }


                    }
                    toast.error("Login Gagal! silakan coba beberapa saat lagi.");
                    // return null; // NextAuth akan menangkap ini sebagai login gagal
                }
            },
        }),
    ],
    // Bagian Session & Callbacks kamu sudah benar secara alur
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.email = (user as any).email;
                token.role = (user as any).role;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            (session.user as any).id = token.id;
            (session.user as any).email = token.email;
            (session.user as any).role = token.role;
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    }
};

//* logout/signout
export async function invalidateLaravelToken() {
    const session = await getSession();
    const token = (session as any)?.accessToken;

    if (!token) {
        console.warn("Mencoba logout, tetapi tidak ada token yang ditemukan.");
        return;
    }

    // Panggil endpoint logout Laravel dengan token
    const response = await fetch(LARAVEL_LOGOUT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Wajib kirim token yang akan di-invalidate
        }
    });

    if (response.ok) {
        console.log("Token JWT berhasil di-invalidate di sisi Laravel.");
    } else {
        console.error("Gagal invalidasi token di Laravel. Status:", response.status);
    }
}

