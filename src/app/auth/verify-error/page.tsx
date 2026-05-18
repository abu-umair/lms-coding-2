import React from 'react'
import VerifyErrorMain from "@/components/layout/main/VerifyErrorMain";
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';


export const metadata = {
    title: "Verification Failed | Edurock - Education LMS Template",
    description: "Verification Failed | Edurock - Education LMS Template",
};

const VerifyEmailRequired = async ({ searchParams }) => {
    

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