import OrderListClient from "./OrderListClient";

export const metadata = {
  title: "Order List",
  description: "View and manage your dropshipping orders on EasyShoppingMallBD. Track order status and delivery progress.",
  keywords: ["order list", "dropshipping orders", "order management", "easy shopping mall orders"],
  openGraph: {
    title: "Order List - EasyShoppingMallBD Dropshipping",
    description: "View and manage your dropshipping orders on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/order-list",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/order-list" },
  robots: { index: false, follow: true },
};

const OrderListPage = () => {
  return <OrderListClient />;
};

export default OrderListPage;
