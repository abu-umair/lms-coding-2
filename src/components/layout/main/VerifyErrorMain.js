import VerifyError from "@/components/sections/verify-email/VerifyError";

const VerifyErrorMain = ({ searchParams }) => {
    return (
        <>
            <VerifyError searchParams={searchParams} />
        </>
    );
};

export default VerifyErrorMain;
