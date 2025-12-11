// components/shared/providers/NextAuthProvider.jsx
"use client"; // <<< PENTING: Tentukan ini sebagai Client Component

import { SessionProvider } from "next-auth/react";

/**
 * Komponen wrapper untuk menyediakan SessionProvider dari NextAuth.js.
 * @param {object} props - Props standar termasuk children.
 * @returns {JSX.Element}
 */
const NextAuthProvider = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
};

export default NextAuthProvider;