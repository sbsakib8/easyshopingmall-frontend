import OrderDetailsClient from "./OrderDetailsClient";

export async function generateMetadata(props) {
  const params = await props.params;
  return {
    title: `Order Details`,
    description: `View order details and tracking information on EasyShoppingMallBD.`,
    robots: { index: false, follow: true },
  };
}

const OrderDetailsPage = async (props) => {
  const params = await props.params;
  const { id } = params;
  return <OrderDetailsClient id={id} />;
};

export default OrderDetailsPage;
