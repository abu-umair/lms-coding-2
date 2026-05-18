import React from 'react'
import VerifyEmailMain from "@/components/layout/main/VerifyEmailMain";
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';


export const metadata = {
    title: "Verification Email | Edurock - Education LMS Template",
    description: "Verification Email | Edurock - Education LMS Template",
};

const VerifyEmailRequired = async ({ searchParams }) => {


    return (
        <PageWrapper>
            <main>
                <VerifyEmailMain searchParams={searchParams} />
                <ThemeController />
            </main>
        </PageWrapper>
    )
}

export default VerifyEmailRequired