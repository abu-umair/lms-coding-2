import OrdersFailurePrimary from "@/components/sections/orders/OrdersFailurePrimary";
import OrdersPrimary from "@/components/sections/orders/OrdersPrimary";
import OrdersSuccesPrimary from "@/components/sections/orders/OrdersSuccesPrimary";
import { ORDER_STATUS_EXPIRED, ORDER_STATUS_PAID, ORDER_STATUS_UNPAID } from "@/constants/order";
import { notFound } from "next/navigation";

const OrderMain = ({ orderData, status }) => {
    return (
        <>
            {status === ORDER_STATUS_PAID ? (
                <OrdersSuccesPrimary orderData={orderData} />
            ) : status === ORDER_STATUS_UNPAID ? (
                <OrdersPrimary orderData={orderData} />
            ) : status === ORDER_STATUS_EXPIRED ? (
                <OrdersFailurePrimary orderData={orderData} />
            ) : notFound()}
        </>
    );
};

export default OrderMain;
