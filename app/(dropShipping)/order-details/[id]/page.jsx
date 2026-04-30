import OrderDetails from"@/src/dropShipping/orderDetails/OrderDetails";

const orderDetailspage = async (props) => {
  const params = await props.params;
  const { id } = params;
  return <OrderDetails id={id} />
}

export default orderDetailspage;
