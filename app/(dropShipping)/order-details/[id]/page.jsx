export const dynamic = 'force-dynamic';
import OrderDetails from "@/src/dropShipping/orderDetails/OrderDetails";

const OrderDetailsPage = async (props) => {
  const params = await props.params;
  const { id } = params;
  return <OrderDetails id={id} />;
};

export default OrderDetailsPage;
