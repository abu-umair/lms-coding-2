import { getOrderClient } from "@/api/grpc/client";
import OrderMain from "@/components/layout/main/OrderMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { ORDER_STATUS_PAID } from "@/constants/order";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";

export const generateMetadata = ({ params }) => {
    const { status } = params;
    if (status !== "success" && status !== "failure") {
        return notFound();
    }

    return {
        title: status === "success" ? "Payment Success" : "Payment Failed",
        description: "Orders | Edurock - Education LMS Template",
    }
};

const Orders = async ({ params }) => {
    const { id } = params;

    const client = getOrderClient();
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    let res;

    const meta = {
        meta: { "authorization": accessToken ? `Bearer ${accessToken}` : '' }
    };

    try {
        res = await client.detailOrder({
            id: id
        }, meta);

    } catch (error) {
        redirect("/");
    }

    const finalStatus = res.response;

    if (!finalStatus.items || finalStatus.items.length === 0) {
        redirect("/");
    }

    return (
        <PageWrapper>
            <main>
                <OrderMain
                    orderData={res.response}
                    status={finalStatus.orderStatusCode}
                />
                <ThemeController />
            </main>
        </PageWrapper>
    );

};

export default Orders;
