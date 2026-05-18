import VerifyEmailRequired from "@/components/sections/verify-email/VerifyEmailRequired";

const VerifyEmailMain = ({ searchParams }) => {
    return (
        <>
            <VerifyEmailRequired searchParams={searchParams} />
        </>
    );
};

export default VerifyEmailMain;
