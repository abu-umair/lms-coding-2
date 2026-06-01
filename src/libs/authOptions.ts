// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from 'next-auth/react';
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { jwtDecode } from "jwt-decode"; // Import decoder
import toast from "react-hot-toast";
import { getAuthClient } from "@/api/grpc/client";
import GoogleProvider from "next-auth/providers/google";



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
        //! PROVIDER GOOGLE (TAMBAHKAN DI SINI)
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        }),

        //! PROVIDER credentials
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
        async signIn({ user, account, profile }) {

            // Jika login menggunakan Google
            if (account?.provider === "google") {
                try {
                    const client = getAuthClient();

                    // Pastikan Anda sudah membuat method 'loginWithGoogle' di proto & gRPC server Go Anda
                    const res = await client.loginWithGoogle({
                        email: user.email || "",
                        fullName: user.name || "",
                        avatar: user.image || "",
                    });


                    if (res.response.base?.isError || !res.response.accessToken) {
                        return false; // Tolak login jika backend Go bermasalah
                    }

                    // Tempelkan accessToken dari Go ke object user NextAuth sementara
                    // agar bisa dibaca di callback jwt() di bawah
                    (user as any).accessToken = res.response.accessToken;
                    return true;
                } catch (error) {
                    console.error("Gagal sinkronisasi gRPC Google Login:", error);
                    return false;
                }
            }
            return true; // Untuk login credentials biasa langsung lolos
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                console.log("ini rest nyass : ", user);

                // JIKA USER LOGIN LEWAT GOOGLE
                if ((user as any).accessToken && !(user as any).role) {
                    // Decode token dari Go untuk mengambil data asli database PostgreSQL Anda
                    const decoded = jwtDecode<MyJwtPayload>((user as any).accessToken);

                    token.id = decoded.sub;
                    token.email = decoded.email;
                    token.role = decoded.role;
                    token.verifiedAt = decoded.verified_at; // Mengambil true dari Go
                    token.accessToken = (user as any).accessToken;
                } else {
                    // JIKA USER LOGIN LEWAT CREDENTIALS BISA (EMAIL & PASSWORD)
                    token.id = (user as any).id;
                    token.email = (user as any).email;
                    token.role = (user as any).role;
                    token.verifiedAt = (user as any).verifiedAt;
                    token.accessToken = (user as any).accessToken;
                }
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



