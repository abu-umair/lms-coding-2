// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from 'next-auth/react';

// URL endpoint login Laravel Anda
const LARAVEL_LOGIN_URL = "http://127.0.0.1:8000/api/auth/login";
const LARAVEL_LOGOUT_URL = "http://127.0.0.1:8000/api/auth/logout";

//* login / sign 
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Laravel API",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const response = await fetch(LARAVEL_LOGIN_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const data = await response.json();

                // --- Pastikan pengecekan ini sesuai dengan respons Laravel Anda ---
                if (response.ok && data.token && data.id) {
                    return {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        roles: data.roles,
                        accessToken: data.token,
                    } as any;
                }

                return null;
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.email = (user as any).email;
                token.roles = (user as any).roles;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            (session.user as any).id = token.id;
            (session.user as any).roles = token.roles;
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

