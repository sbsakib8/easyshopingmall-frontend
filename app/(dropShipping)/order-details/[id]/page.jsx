import OrderDetailsClient from "./OrderDetailsClient";

const OrderDetailsPage = async (props) => {
  const params = await props.params;
  const { id } = params;
  return <OrderDetailsClient id={id} />;
};

export default OrderDetailsPage;
