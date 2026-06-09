"use client";

import Container from "@/src/compronent/shared/Container";
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders";
import { useGetUser } from "@/src/utlis/useGetuser";
import { OrderUpdate } from "@/src/utlis/useOrder";
import { isDSOrder } from "@/src/utlis/orderHelpers";
import { cn } from "@/src/utlis/utils";
import {
  CheckCircle,
  CircleCheckBig,
  CircleX,
  Loader2,
  RefreshCw,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { Activity, useMemo, useState } from "react";
import toast from "react-hot-toast";

const statusColors = {
  pending:
    "bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-300 shadow-lg shadow-yellow-500/25",
  processing:
    "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-300 shadow-lg shadow-blue-500/25",
  submitted:
    "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-300 shadow-lg shadow-blue-500/25",
  shipped:
    "bg-gradient-to-r from-purple-500 to-pink-500 text-slate-300 shadow-lg shadow-purple-500/25",
  completed:
    "bg-gradient-to-r from-green-500 to-emerald-500 text-slate-300 shadow-lg shadow-green-500/25",
  paid: "bg-gradient-to-r from-green-500 to-emerald-500 text-slate-300 shadow-lg shadow-green-500/25",
  cancelled:
    "bg-gradient-to-r from-red-500 to-rose-500 text-slate-300 shadow-lg shadow-red-500/25",
  return:
    "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-300 shadow-lg shadow-orange-500/25",
};

const OrderCardSkeleton = () => {
  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 relative animate-pulse">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            {/* Order ID */}
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            {/* Date */}
            <div className="h-3.5 w-40 bg-gray-700 rounded"></div>
          </div>

          {/* Status Badge */}
          <div className="h-7 w-20 bg-gray-700 rounded-full"></div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            {/* Name */}
            <div className="h-5 w-36 bg-gray-700 rounded"></div>
            {/* Dropshipping Badge (optional) */}
            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
          </div>
          {/* Email */}
          <div className="h-3.5 w-48 bg-gray-700 rounded"></div>
          {/* Mobile */}
          <div className="h-3.5 w-32 bg-gray-700 rounded"></div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <div className="h-5 w-24 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            {/* Item 1 */}
            <div className="flex justify-between">
              <div className="h-4 w-44 bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </div>
            {/* Item 2 */}
            <div className="flex justify-between">
              <div className="h-4 w-40 bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </div>
            {/* + More */}
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Total Section */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-gray-700 rounded"></div>
            <div className="h-5 w-20 bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-gray-700 rounded"></div>
            <div className="h-6 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-center py-3">
          <div className="w-2/3 h-10 bg-gray-700/70 rounded-lg"></div>
        </div>
      </div>
    </>
  );
};

const CompletedOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders();
  const { user: currentUser, refetch: refetchUser } = useGetUser(); // Added refetchUser

  // Filter orders based on search term and filters
  const filteredOrders = useMemo(() => {
    const filtered = allOrders?.filter((order) => {
      const customerName = order?.userId?.name || "user";
      const customerEmail = order?.userId?.email || "user@damy.com";
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.address?.mobile == searchTerm;
      return matchesSearch;
    });
    return filtered;
  }, [searchTerm, allOrders]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allOrders?.length;
    const completed = allOrders?.filter(
      (o) => o?.order_status === "completed",
    )?.length;
    const cancelled = allOrders?.filter(
      (o) => o?.order_status === "cancelled",
    )?.length;
    const returned = allOrders?.filter(
      (o) => o?.order_status === "return",
    )?.length;

    return { total, cancelled, completed, returned };
  }, [allOrders]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async () => {
    if (!selectedOrder?._id || !status) return;

    try {
      const res = await OrderUpdate(selectedOrder._id, status);
      if (res.success) {
        toast.success(`Order status updated to ${status}`);
        refetch(); // Refresh the orders list
        if (refetchUser) refetchUser(); // Refresh the admin/user balance in navbar
        setConfirmationModal(false);
        setShowModal(false);
        setSelectedOrder(null);
        setStatus("");
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  const openConfirmation = (order, newStatus) => {
    setSelectedOrder(order);
    setStatus(newStatus);
    setConfirmationModal(true);
  };

  const statsCards = [
    {
      id: "total",
      label: "Total Orders",
      valueKey: "total",
      icon: ShoppingCart,
      iconColor: "text-blue-400",
      accent: (
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
      ),
    },
    {
      id: "cancelled",
      label: "Cancelled",
      valueKey: "cancelled",
      icon: CircleX,
      iconColor: "text-red-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
    },
    {
      id: "completed",
      label: "Completed",
      valueKey: "completed",
      icon: CheckCircle,
      iconColor: "text-green-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden py-10 md:py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/3 to-blue-600/3 rounded-full blur-3xl -slow"></div>
      </div>

      {/* main section */}
      <Container className="relative">
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
                  All{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Order
                  </span>
                  !
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* over view section */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transform  mb-8`}
        >
          {statsCards.map((card) => {
            const value = stats?.[card.valueKey];

            return (
              <div
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900",
                  "border border-gray-700 p-6 text-slate-300 shadow-xl hover:shadow-2xl",
                )}
              >
                {card.accent}

                <div className="relative">
                  <card.icon className={cn("h-8 w-8 mb-3", card.iconColor)} />
                  <p className="text-gray-400 text-sm">{card.label}</p>

                  {ordersLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <p className="text-3xl font-bold text-slate-300">
                      {value ?? (card.valueKey === "total" ? 0 : 0)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search orders, customers, or tracking numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 font-medium backdrop-blur-sm">
              {filteredOrders?.length} Orders
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!ordersLoading && filteredOrders?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No Shipped Orders Found
            </h3>
            <p className="text-gray-400">
              No shipped orders match your search criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {ordersLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <OrderCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                filteredOrders?.slice(0, 5).map((order) => (
                  <div
                    key={order?._id}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-green-500/10 relative"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-300 mb-1">
                          {order?.orderId}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Delivered:{" "}
                          <span className="text-slate-300">
                            {formatDate(order?.updatedAt)}
                          </span>{" "}
                        </p>
                      </div>
                      <div className="text-gray-300 flex gap-3">
                        <p
                          className={`px-3 py-1 text-sm ${statusColors[order?.order_status]} rounded-full font-medium capitalize text-black`}
                        >
                          {order?.order_status}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-slate-300 font-semibold">
                          {order?.userId?.name || "none"}
                        </h4>
                        {order?.userId?.role === "DROPSHIPPING" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">
                            Dropshipping
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        {order?.userId?.email || "demo@gmail.com"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {order?.address?.mobile || "018XXXXXXXX"}
                      </p>
                    </div>
                    {/* Order Items */}
                    <div className="mb-4">
                      <h5 className="text-slate-300 font-medium mb-2">
                        Items ({order?.products.length})
                      </h5>
                      <div className="space-y-1">
                        {order?.products.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-300">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-gray-400">
                              ৳{item?.price}
                            </span>
                          </div>
                        ))}
                        {order?.products.length > 2 && (
                          <p className="text-gray-500 text-xs">
                            +{order?.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 font-semibold">
                          Delivery Charge:
                        </span>
                        <span className="text-green-400 font-bold text-lg">
                          ৳{order?.deliveryCharge}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-semibold">
                          Total:
                        </span>
                        <span className="text-green-400 font-bold text-lg">
                          ৳{order.totalAmt}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex justify-center py-3">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="w-2/3 px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 text-sm font-medium cursor-pointer absolute bottom-3"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <Activity mode={showModal && selectedOrder ? "visible" : "hidden"}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-300">
                  Completed Order Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-slate-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid md:grid-cols-1 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-3">
                        Order Information
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          <span className="text-gray-500">Order ID:</span>{" "}
                          {selectedOrder?.orderId}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-500">Date:</span>{" "}
                          {formatDate(selectedOrder?.updatedAt)}
                        </p>
                        <div className="text-gray-300 flex gap-3">
                          <span className="text-gray-500">Order Status:</span>
                          {""}
                          <p
                            className={`px-3 py-1 text-sm ${statusColors[selectedOrder?.order_status]} rounded-full text-yellow-300 font-medium`}
                          >
                            {selectedOrder?.order_status}
                          </p>
                        </div>
                        <p className="text-gray-300">
                          <span className="text-gray-500">Payment:</span>{" "}
                          {selectedOrder?.payment_method}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-500">Provider Name:</span>{" "}
                          {selectedOrder?.payment_details?.manual?.provider || "—"}
                        </p>
                        {selectedOrder?.payment_method === "manual" && (
                          <>
                            <p className="text-gray-300">
                              <span className="text-gray-500">Transaction ID:</span>{" "}
                              <span className="font-mono font-bold text-blue-400">
                                {selectedOrder?.payment_details?.manual?.transactionId || "—"}
                              </span>
                            </p>
                            <p className="text-gray-300">
                              <span className="text-gray-500">Sender Number:</span>{" "}
                              {selectedOrder?.payment_details?.manual?.senderNumber || "—"}
                            </p>
                          </>
                        )}
                        <p className="text-gray-300">
                          <span className="text-gray-500">Payment Type:</span>{" "}
                          <span className="capitalize">{selectedOrder?.payment_type || "—"}</span>
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-500">Payment Status:</span>{" "}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedOrder?.payment_status === "paid" ? "bg-green-500/20 text-green-400" :
                              selectedOrder?.payment_status === "submitted" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-gray-500/20 text-gray-400"
                            }`}>
                            {selectedOrder?.payment_status || "—"}
                          </span>
                        </p>
                        <div className="flex gap-2">
                          <span className="text-gray-400">Amount Due:</span>
                          <span className="font-medium text-slate-300">
                            {(() => {
                              const isDS2 = isDSOrder(selectedOrder);
                              const hasCorrectedPrices2 = !isDS2 && (selectedOrder?.products || []).some((item) => {
                                const retailPrice = Number(item?.productId?.price) || 0;
                                const storedPrice = Number(item?.price) || 0;
                                return retailPrice > 0 && retailPrice !== storedPrice;
                              });
                              const sub2 = hasCorrectedPrices2
                                ? (selectedOrder?.products || []).reduce((sum, item) => {
                                  const retailPrice = Number(item?.productId?.price) || Number(item?.price) || 0;
                                  return sum + retailPrice * (Number(item?.quantity) || 1);
                                }, 0)
                                : Number(selectedOrder?.subTotalAmt) || 0;
                              const delivery2 = Number(selectedOrder?.deliveryCharge) || 0;
                              const coupon2 = Number(selectedOrder?.couponDiscount) || 0;
                              const calculatedTotal2 = sub2 + delivery2 - coupon2;
                              const storedTotal2 = Number(selectedOrder?.totalAmt) || 0;
                              const displayTotal2 = calculatedTotal2 > 0 ? calculatedTotal2 : storedTotal2;
                              const amountDue = Math.max(0, displayTotal2 - (Number(selectedOrder?.amount_paid) || 0));
                              return `৳${amountDue}`;
                            })()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-400">Amount Paid:</span>
                          <span className="font-medium text-slate-300">
                            ৳{selectedOrder?.amount_paid}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Quick Actions */}
                  <div className="pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedOrder?.order_status !== "completed" &&
                        selectedOrder?.order_status !== "cancelled" && (
                          <button
                            onClick={() =>
                              openConfirmation(selectedOrder, "completed")
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-600/30 transition-all font-bold text-sm cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" /> Mark Completed
                          </button>
                        )}

                      {selectedOrder?.order_status !== "cancelled" && (
                        <button
                          onClick={() =>
                            openConfirmation(selectedOrder, "cancelled")
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-500/30 text-rose-400 rounded-xl hover:bg-rose-600/30 transition-all font-bold text-sm cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Order
                        </button>
                      )}

                      {selectedOrder?.order_status === "pending" && (
                        <button
                          onClick={() =>
                            openConfirmation(selectedOrder, "processing")
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all font-bold text-sm cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" /> Start Processing
                        </button>
                      )}

                      {selectedOrder?.order_status !== "return" &&
                        selectedOrder?.order_status !== "cancelled" && (
                          <button
                            onClick={() =>
                              openConfirmation(selectedOrder, "return")
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600/20 border border-orange-500/30 text-orange-400 rounded-xl hover:bg-orange-600/30 transition-all font-bold text-sm cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" /> Mark as Returned
                            (Customer Rejected)
                          </button>
                        )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="text-gray-300 flex items-center gap-2">
                        <span className="text-gray-500">Name:</span>{" "}
                        {selectedOrder?.userId?.name}
                        {isDSOrder(selectedOrder) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">
                            Dropshipping
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Email:</span>{" "}
                        {selectedOrder?.userId?.email}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Phone:</span>{" "}
                        {selectedOrder?.address?.mobile}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">
                      Shipping Address
                    </h3>
                    <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                      {selectedOrder?.address?.upazila_thana},{" "}
                      {selectedOrder?.address?.district}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        const isDS = isDSOrder(selectedOrder);
                        const correctedItems = (selectedOrder?.products || []).map((item) => {
                          if (isDS) return { ...item, _ep: item.sellingPrice || item.price || 0, _et: item.totalPrice || (item.sellingPrice || item.price || 0) * (Number(item?.quantity) || 1) };
                          const retailPrice = Number(item?.productId?.price) || 0;
                          const storedPrice = Number(item?.price) || 0;
                          const ep = (retailPrice > 0 && retailPrice !== storedPrice) ? retailPrice : storedPrice;
                          return { ...item, _ep: ep };
                        });
                        return correctedItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                          >
                            <div className="flex gap-2">
                              <img
                                className="w-15 h-15 rounded-sm object-cover"
                                src={
                                  (Array.isArray(item?.image)
                                    ? item.image[0]
                                    : typeof item?.image === "string"
                                      ? item.image
                                      : null) ||
                                  (Array.isArray(item?.images)
                                    ? item.images[0]
                                    : typeof item?.images === "string"
                                      ? item.images
                                      : null) ||
                                  (Array.isArray(item?.productId?.images)
                                    ? item.productId.images[0]
                                    : typeof item?.productId?.images === "string"
                                      ? item.productId.images
                                      : null) ||
                                  (Array.isArray(item?.productId?.image)
                                    ? item.productId.image[0]
                                    : typeof item?.productId?.image === "string"
                                      ? item.productId.image
                                      : null) ||
                                  "/img/product.jpg"
                                }
                                alt={item?.name || "Product"}
                              />
                              <div>
                                <p className="text-slate-300 font-medium">
                                  {item?.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Quantity: {item?.quantity}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Color: {item?.color || "none"}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Size: {item?.size || "none"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-400">
                                ৳{item._ep.toFixed(2)}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                                Unit Price
                              </p>
                              {isDS && item?.sellingPrice > 0 &&
                                item?.sellingPrice !== item?.price && (
                                  <div className="mt-1 pt-1 border-t border-gray-700/50">
                                    <p className="text-[10px] text-blue-400 font-bold">
                                      Cost: ৳{item?.price.toFixed(2)}
                                    </p>
                                    <p className="text-[10px] text-emerald-400 font-bold">
                                      Profit: ৳
                                      {(
                                        (Number(item?.sellingPrice || 0) -
                                          Number(item?.price || 0)) *
                                        Number(item?.quantity || 1)
                                      ).toFixed(2)}
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-1">
                                      ({item?.quantity || 1} × ৳
                                      {(
                                        Number(item?.sellingPrice || 0) -
                                        Number(item?.price || 0)
                                      ).toFixed(2)}{" "}
                                      per unit)
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="flex justify-between items-center m-2">
                      <span className="text-slate-300 font-semibold">
                        Delivery Charge:
                      </span>
                      <span className="text-green-400 font-bold text-lg">
                        ৳{selectedOrder?.deliveryCharge || 0}
                      </span>
                    </div>
                    {selectedOrder?.couponDiscount > 0 && (
                      <div className="flex justify-between items-center m-2 text-emerald-400">
                        <span className="text-slate-300 font-semibold">
                          Coupon Discount{" "}
                          {selectedOrder?.appliedCoupon
                            ? `(${selectedOrder.appliedCoupon})`
                            : ""}
                          :
                        </span>
                        <span className="font-bold text-lg text-emerald-400">
                          -৳{selectedOrder?.couponDiscount}
                        </span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {(selectedOrder?.userId?.role === "DROPSHIPPING" ||
                        (Array.isArray(selectedOrder?.userId?.roles) &&
                          selectedOrder?.userId?.roles.includes(
                            "DROPSHIPPING",
                          ))) && (
                          <div className="flex flex-col gap-2 mb-4 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-500/30 shadow-inner">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">
                                Dropshipping Profit
                              </span>
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-black uppercase">
                                Verified
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">
                                Total Earnings:
                                {Number(selectedOrder?.couponDiscount) > 0 && (
                                  <span className="ml-2 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
                                    (incl. coupon compensation)
                                  </span>
                                )}
                              </span>
                              <span className="text-2xl font-black text-blue-400">
                                ৳
                                {(
                                  selectedOrder?.products.reduce((sum, p) => {
                                    const cost =
                                      Number(p.costPrice || p.price) || 0;
                                    const selling = Number(p.sellingPrice) || 0;
                                    return (
                                      sum +
                                      (selling > cost
                                        ? (selling - cost) * (p.quantity || 1)
                                        : 0)
                                    );
                                  }, 0) +
                                  (Number(selectedOrder?.couponDiscount) || 0)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        )}

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-300">
                          Total:
                        </span>
                        {(() => {
                          const isDS2 = isDSOrder(selectedOrder);
                          const hasCorrectedPrices2 = !isDS2 && (selectedOrder?.products || []).some((item) => {
                            const retailPrice = Number(item?.productId?.price) || 0;
                            const storedPrice = Number(item?.price) || 0;
                            return retailPrice > 0 && retailPrice !== storedPrice;
                          });
                          const sub2 = hasCorrectedPrices2
                            ? (selectedOrder?.products || []).reduce((sum, item) => {
                              const retailPrice = Number(item?.productId?.price) || Number(item?.price) || 0;
                              return sum + retailPrice * (Number(item?.quantity) || 1);
                            }, 0)
                            : Number(selectedOrder?.subTotalAmt) || 0;
                          const delivery2 = Number(selectedOrder?.deliveryCharge) || 0;
                          const coupon2 = Number(selectedOrder?.couponDiscount) || 0;
                          const calculatedTotal2 = sub2 + delivery2 - coupon2;
                          const storedTotal2 = Number(selectedOrder?.totalAmt) || 0;
                          const displayTotal2 = calculatedTotal2 > 0 ? calculatedTotal2 : storedTotal2;
                          return (
                            <span className="text-2xl font-bold text-green-400">
                              ৳{displayTotal2}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Activity>
      </Container>

      {/* confirmation modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-700/50 rounded-full">
                {status === "completed" ? (
                  <CircleCheckBig className="w-8 h-8 text-green-500" />
                ) : status === "cancelled" ? (
                  <CircleX className="w-8 h-8 text-rose-500" />
                ) : (
                  <RefreshCw className="w-8 h-8 text-blue-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-300 capitalize">
                {" "}
                Update to {status}
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to change the order status to{" "}
              <span className="text-slate-300 font-bold">{status}</span>?
              {status === "completed" &&
                " This will mark the order as delivered and finalize it."}
              {status === "cancelled" &&
                " This will cancel the order and cannot be undone."}
              {status === "return" && (
                <>
                  {" "}
                  For <strong>COD</strong> dropshipping orders this will deduct
                  the delivery charge (৳{selectedOrder?.deliveryCharge || 0})
                  from the dropshipper's balance.
                </>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange()}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transform cursor-pointer transition-all ${status === "completed"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    : status === "cancelled"
                      ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                      : status === "return"
                        ? "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  } text-white shadow-lg`}
              >
                Confirm {status}
              </button>
              <button
                onClick={() => {
                  setStatus("");
                  setSelectedOrder(null);
                  setConfirmationModal(false);
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        . {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};
export default CompletedOrdersPage;
