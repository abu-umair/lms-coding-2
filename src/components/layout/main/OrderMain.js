import OrdersPrimary from "@/components/sections/orders/OrdersPrimary";
import OrdersSuccesPrimary from "@/components/sections/orders/OrdersSuccesPrimary";
import { ORDER_STATUS_PAID } from "@/constants/order";

const OrderMain = ({ orderData, status }) => {
    return (
        <>
            {status === ORDER_STATUS_PAID ? (
                <OrdersSuccesPrimary orderData={orderData} />
            ) : (
                <OrdersPrimary orderData={orderData} />
            )}
        </>
    );
};

export default OrderMain;
