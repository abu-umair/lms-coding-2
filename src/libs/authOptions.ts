// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from 'next-auth/react';
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { jwtDecode } from "jwt-decode"; // Import decoder
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";



// Definisikan tipe data sesuai isi token Anda
interface MyJwtPayload {
    sub: string;
    email: string;
    full_name: string;
    role: string;
    verified_at: boolean;
}

// URL endpoint login Laravel Anda

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



                try {
                    // 1. Ambil client gRPC
                    const client = getAuthClient();

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
                        verifiedAt: decoded.verified_at,
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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = (user as any).id;
                token.email = (user as any).email;
                token.role = (user as any).role;
                token.verifiedAt = (user as any).verifiedAt;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            (session.user as any).id = token.id;
            (session.user as any).email = token.email;
            (session.user as any).role = token.role;
            (session.user as any).verifiedAt = token.verifiedAt;
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    }
};



