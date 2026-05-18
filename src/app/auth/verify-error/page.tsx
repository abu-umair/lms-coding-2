import React from 'react'
import VerifyErrorMain from "@/components/layout/main/VerifyErrorMain";
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/authOptions';
import { redirect } from 'next/navigation';



export const metadata = {
    title: "Verification Failed | Edurock - Education LMS Template",
    description: "Verification Failed | Edurock - Education LMS Template",
};

const VerifyEmailRequired = async ({ searchParams }) => {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session; //? (true/false) null false, object true
    const verifiedAt = session?.user?.verifiedAt;
    const userVerified = isAuthenticated && verifiedAt; //*User sudah login dan email sudah terverifikasi.
    const isGuest = !isAuthenticated;
    const isUnverifiedUser = isAuthenticated && !verifiedAt;

    //*untuk yang sudah login dan sudah terverifikasi 
    if (userVerified) {
        console.log(userVerified);
        redirect('/');
    } else if (isUnverifiedUser) {
        console.log(`user belum terverifikasi : ${isUnverifiedUser}`);
    } else {
        console.log(`user belum login : ${isGuest}`);
        redirect('/login');

    }

    return (
        <PageWrapper>
            <main>
                <VerifyErrorMain searchParams={searchParams} />
                <ThemeController />
            </main>
        </PageWrapper>
    )
}

export default VerifyEmailRequired