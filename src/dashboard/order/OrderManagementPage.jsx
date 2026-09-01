"use client";

import Container from "@/src/compronent/shared/Container";
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders";
import { useGetUser } from "@/src/utlis/useGetuser";
import {
  OrderUpdate,
  SendOrderMessage,
  UpdateOrderKeyPoints,
} from "@/src/utlis/useOrder";
import { isDSOrder } from "@/src/utlis/orderHelpers";
import { cn } from "@/src/utlis/utils";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";
import DropshippingStatusUpdateModal from "./DropshippingStatusUpdateModal";
import {
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
  Square,
  Star,
  Trash2,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
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

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  shipped: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
  return: RefreshCw,
};

const statusTabs = [
  { key: "all", label: "All", icon: Package },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "processing", label: "Processing", icon: RefreshCw },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "completed", label: "Completed", icon: CheckCircle },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
  { key: "return", label: "Return", icon: RefreshCw },
];

const SkeletonOrderCard = () => (
  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 shadow-lg animate-pulse">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
    <div className="px-3 py-6">
      <div className="flex flex-col-reverse gap-3 items-start justify-between mb-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-7 h-7 bg-gray-700 rounded-lg" />
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-28 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-40 bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-700 rounded-xl" />
          <div className="w-9 h-9 bg-gray-700 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="py-3 px-2 bg-gray-700/50 rounded-xl">
          <div className="h-4 w-16 bg-gray-600 rounded mx-auto mb-2" />
          <div className="h-5 w-20 bg-gray-600 rounded mx-auto" />
        </div>
        <div className="py-3 px-2 bg-gray-700/50 rounded-xl">
          <div className="h-4 w-12 bg-gray-600 rounded mx-auto mb-2" />
          <div className="h-5 w-24 bg-gray-600 rounded mx-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-700 rounded" />
          <div className="h-8 px-6 bg-gray-700 rounded-2xl" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-700 rounded" />
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-700">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded" />
            <div className="h-3.5 w-36 bg-gray-700 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded" />
            <div className="h-3.5 w-20 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderManagementPage = () => {
  const { canModify } = useDashboardPermission();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage] = useState(12);
  const [copied, setCopied] = useState(false);
  const [dsStatusModal, setDsStatusModal] = useState(false);
  const [dsStatusOrder, setDsStatusOrder] = useState(null);
  const [orderMessage, setOrderMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newKeyPoint, setNewKeyPoint] = useState("");
  const [updatingKeyPoints, setUpdatingKeyPoints] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [status, setStatus] = useState("");

  const {
    allOrders,
    loading: ordersLoading,
    refetch,
  } = useGetAllOrders();
  const { user: currentUser, refetch: refetchUser } = useGetUser();

  const filteredOrders = useMemo(() => {
    if (!allOrders) return [];
    return allOrders.filter((order) => {
      const customerName = order?.userId?.name || "user";
      const customerEmail = order?.userId?.email || "user@damy.com";
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.address?.mobile == searchTerm;
      const matchesStatus =
        activeTab === "all" || order?.order_status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeTab, allOrders]);

  const stats = useMemo(() => {
    if (!allOrders) return {};
    const total = allOrders.length;
    const pending = allOrders.filter((o) => o?.order_status === "pending").length;
    const processing = allOrders.filter((o) => o?.order_status === "processing").length;
    const shipped = allOrders.filter((o) => o?.order_status === "shipped").length;
    const completed = allOrders.filter((o) => o?.order_status === "completed").length;
    const cancelled = allOrders.filter((o) => o?.order_status === "cancelled").length;
    const returned = allOrders.filter((o) => o?.order_status === "return").length;
    const revenue = allOrders
      .filter((o) => o?.order_status === "completed")
      .reduce((sum, o) => sum + (o.totalAmt || 0), 0);
    return { total, pending, processing, shipped, completed, cancelled, returned, revenue };
  }, [allOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (orderId, newStatus) => {
    setIsLoading(true);
    const res = await OrderUpdate(orderId, newStatus);
    if (res.success) {
      toast.success(`Order status updated to ${newStatus}`);
      setShowModal(false);
      setConfirmationModal(false);
      refetch();
      if (refetchUser) refetchUser();
    } else {
      toast.error(res.message || "Failed to update status");
    }
    setIsLoading(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDsStatusUpdate = (order) => {
    setDsStatusOrder(order);
    setDsStatusModal(true);
  };

  const handleSendMessage = async () => {
    if (!orderMessage.trim() || !selectedOrder?._id) return;
    setSendingMessage(true);
    try {
      const res = await SendOrderMessage(selectedOrder._id, orderMessage.trim());
      if (res.success) {
        setSelectedOrder(res.data);
        setOrderMessage("");
        toast.success("Message sent");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const addOrderKeyPoint = () => {
    if (!newKeyPoint.trim() || !selectedOrder?._id) return;
    const current = selectedOrder.keyPoints || [];
    if (current.includes(newKeyPoint.trim())) return;
    saveOrderKeyPoints([...current, newKeyPoint.trim()]);
  };

  const removeOrderKeyPoint = (point) => {
    const current = selectedOrder?.keyPoints || [];
    saveOrderKeyPoints(current.filter((p) => p !== point));
  };

  const saveOrderKeyPoints = async (keyPoints) => {
    setUpdatingKeyPoints(true);
    try {
      const res = await UpdateOrderKeyPoints(selectedOrder._id, keyPoints);
      if (res.success) {
        setSelectedOrder(res.data);
        setNewKeyPoint("");
      }
    } catch (error) {
      toast.error("Failed to update key points");
    } finally {
      setUpdatingKeyPoints(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedOrder?.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const openConfirmation = (order, newStatus) => {
    setSelectedOrder(order);
    setStatus(newStatus);
    setConfirmationModal(true);
  };

  const getTabCount = (tab) => {
    if (!allOrders) return 0;
    if (tab === "all") return allOrders.length;
    return allOrders.filter((o) => o?.order_status === tab).length;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-10 md:py-16">
      <Container className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
                Order{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                EasyShoppingMall Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { id: "total", label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-blue-400", accent: "from-blue-500 via-purple-500 to-indigo-500" },
            { id: "pending", label: "Pending", value: stats.pending, icon: Clock, color: "text-orange-400", accent: "from-orange-500 to-yellow-500" },
            { id: "processing", label: "Processing", value: stats.processing, icon: RefreshCw, color: "text-cyan-400", accent: "from-cyan-500 to-blue-500" },
            { id: "shipped", label: "Shipped", value: stats.shipped, icon: Truck, color: "text-purple-400", accent: "from-purple-500 to-pink-500" },
            { id: "revenue", label: "Revenue", value: stats.revenue, icon: DollarSign, color: "text-green-400", accent: "from-green-500 to-emerald-500", prefix: "৳", format: (v) => v?.toFixed(0) || "0" },
          ].map((card) => (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-slate-300 shadow-xl"
            >
              <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${card.accent}`} />
              <div className="relative">
                <card.icon className={cn("h-8 w-8 mb-3", card.color)} />
                <p className="text-gray-400 text-sm">{card.label}</p>
                {ordersLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-slate-400" />
                ) : (
                  <p className="text-3xl font-bold text-slate-300">
                    {card.prefix || ""}{card.format ? card.format(card.value) : (card.value ?? 0)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by customer, ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-300 placeholder-gray-400"
              />
            </div>
            <div className="px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-300 font-medium backdrop-blur-sm whitespace-nowrap">
              {filteredOrders.length} Orders
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {statusTabs.map((tab) => {
              const count = getTabCount(tab.key);
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-600"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    isActive ? "bg-white/20" : "bg-gray-600/50"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-slate-300">
                {statusTabs.find((t) => t.key === activeTab)?.label || "All"} Orders
                <span className="text-gray-400 text-lg ml-2">
                  ({ordersLoading ? "..." : filteredOrders.length})
                </span>
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredOrders.length === 0 && !ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => { setSearchTerm(""); setActiveTab("all"); }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-300 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {ordersLoading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonOrderCard key={i} />)
                  : paginatedOrders.map((order) => {
                      const StatusIcon = statusIcons[order?.order_status];
                      return (
                        <div
                          key={order?._id}
                          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-gray-600 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/5"
                          onClick={() => handleViewOrder(order)}
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />

                          <div className="px-3 py-6">
                            <div className="flex flex-col-reverse gap-3 items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-sm lg:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-slate-300 shadow-lg px-3">
                                  <Package className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="text-xs font-bold text-slate-300 group-hover:text-blue-400">
                                    {order?.orderId}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-gray-300 font-medium">
                                      {order?.userId?.name}
                                    </span>
                                    {order?.userId?.role === "DROPSHIPPING" && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">
                                        Dropshipping
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}
                                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-300 shadow-lg"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {isDSOrder(order) && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDsStatusUpdate(order); }}
                                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-300 shadow-lg"
                                    title="Update Dropshipping Status"
                                  >
                                    <Truck className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center py-3 px-2 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                                  <Calendar className="h-4 w-4" />
                                  Date
                                </div>
                                <div className="text-slate-300 font-semibold text-base">
                                  {new Date(order?.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-center py-3 px-2 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                                <div className="flex items-center justify-center text-gray-400 text-sm mb-1">
                                  <DollarSign className="h-4 w-4" />
                                  Total
                                </div>
                                <div className="text-base font-semibold text-green-400">
                                  ৳{(order?.totalAmt || 0).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                {StatusIcon && <StatusIcon className="h-5 w-5 text-slate-300" />}
                                <span className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize text-black ${statusColors[order?.order_status]}`}>
                                  {order?.order_status?.charAt(0).toUpperCase() + order?.order_status?.slice(1)}
                                </span>
                              </div>
                              {order?.products?.[0]?.productId?.ratings && (
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < order?.products[0]?.productId?.ratings ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {order?.userId?.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  {order?.products?.length} item{order?.products?.length > 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-slate-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-10 h-10 rounded-xl",
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-300 shadow-lg"
                              : "bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-slate-300 hover:border-gray-500"
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-slate-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 min-h-screen">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-blue-200">
                      {selectedOrder?.orderId}{" "}
                      <button onClick={handleCopy} className="p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 cursor-pointer" title="Copy Order ID">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </p>
                    <p className="text-blue-200">
                      <span className="font-bold">Order Date:</span>{" "}
                      {new Date(selectedOrder?.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 cursor-pointer hover:text-red-600">
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Customer Information */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder?.address?.customer_name && (
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-slate-300">{selectedOrder?.address?.customer_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{selectedOrder?.address?.mobile || "N/A"}</span>
                        </div>
                        <div className="flex flex-col items-start gap-3">
                          <h3 className="font-bold text-slate-300">
                            Address: <span className="text-gray-300 font-normal">{selectedOrder?.address?.address_line || "None"}</span>
                          </h3>
                          {selectedOrder?.address?.district && (
                            <h3 className="font-bold text-slate-300">
                              District: <span className="text-gray-300 font-normal">{selectedOrder?.address?.district}</span>
                            </h3>
                          )}
                          {selectedOrder?.address?.division && (
                            <h3 className="font-bold text-slate-300">
                              Division: <span className="text-gray-300 font-normal">{selectedOrder?.address?.division}</span>
                            </h3>
                          )}
                          {selectedOrder?.address?.upazila_thana && (
                            <h3 className="font-bold text-slate-300">
                              Upazila: <span className="text-gray-300 font-normal">{selectedOrder?.address?.upazila_thana}</span>
                            </h3>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dropshipper Information */}
                    {isDSOrder(selectedOrder) && (
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-green-400" />
                          Dropshipper Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-300">{selectedOrder?.userId?.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">Dropshipping</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{selectedOrder?.userId?.email}</span>
                          </div>
                          {selectedOrder?.userId?.shopName && (
                            <div className="flex items-center gap-3">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{selectedOrder?.userId?.shopName}</span>
                            </div>
                          )}
                          {selectedOrder?.userId?.shopAddress && (
                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{selectedOrder?.userId?.shopAddress}</span>
                            </div>
                          )}
                          {selectedOrder?.userId?.mobile && (
                            <div className="flex items-center gap-3">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{selectedOrder?.userId?.mobile}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Date:</span>
                          <span className="font-medium text-slate-300">{new Date(selectedOrder?.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Items:</span>
                          <span className="font-medium text-slate-300">{selectedOrder?.products?.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Order Status:</span>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const SI = statusIcons[selectedOrder?.order_status];
                              return SI ? <SI className="h-4 w-4 text-slate-300" /> : null;
                            })()}
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[selectedOrder?.order_status]}`}>
                              {selectedOrder?.order_status?.charAt(0).toUpperCase() + selectedOrder?.order_status?.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sub Total:</span>
                          <span className="font-medium text-slate-300">
                            ৳{(() => {
                              const isDS = isDSOrder(selectedOrder);
                              const hasCorrected = !isDS && (selectedOrder?.products || []).some((item) => {
                                const rp = Number(item?.productId?.price) || 0;
                                const sp = Number(item?.price) || 0;
                                return rp > 0 && rp !== sp;
                              });
                              return hasCorrected
                                ? (selectedOrder?.products || []).reduce((sum, item) => {
                                    const rp = Number(item?.productId?.price) || Number(item?.price) || 0;
                                    return sum + rp * (Number(item?.quantity) || 1);
                                  }, 0)
                                : Number(selectedOrder?.subTotalAmt) || 0;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Delivery Charge:</span>
                          <span className="font-medium text-slate-300">৳{selectedOrder?.deliveryCharge || 0}</span>
                        </div>
                        {selectedOrder?.couponDiscount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Coupon ({selectedOrder?.appliedCoupon}):</span>
                            <span className="font-medium">-৳{selectedOrder?.couponDiscount}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total:</span>
                          <span className="font-medium text-slate-300">
                            ৳{(() => {
                              const isDS = isDSOrder(selectedOrder);
                              const hasCorrected = !isDS && (selectedOrder?.products || []).some((item) => {
                                const rp = Number(item?.productId?.price) || 0;
                                const sp = Number(item?.price) || 0;
                                return rp > 0 && rp !== sp;
                              });
                              const sub = hasCorrected
                                ? (selectedOrder?.products || []).reduce((sum, item) => {
                                    const rp = Number(item?.productId?.price) || Number(item?.price) || 0;
                                    return sum + rp * (Number(item?.quantity) || 1);
                                  }, 0)
                                : Number(selectedOrder?.subTotalAmt) || 0;
                              const total = sub + (Number(selectedOrder?.deliveryCharge) || 0) - (Number(selectedOrder?.couponDiscount) || 0);
                              return total > 0 ? total : Number(selectedOrder?.totalAmt) || 0;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="font-medium text-slate-300">{selectedOrder?.payment_method || "N/A"}</span>
                        </div>
                        {selectedOrder?.payment_method === "manual" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Provider:</span>
                              <span className="font-medium text-slate-300">{selectedOrder?.payment_details?.manual?.provider || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Transaction ID:</span>
                              <span className="font-medium text-slate-300">{selectedOrder?.payment_details?.manual?.transactionId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sender Number:</span>
                              <span className="font-medium text-slate-300">{selectedOrder?.payment_details?.manual?.senderNumber || "N/A"}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount Due:</span>
                          <span className="font-medium text-slate-300">
                            ৳{(() => {
                              const isDS = isDSOrder(selectedOrder);
                              const hasCorrected = !isDS && (selectedOrder?.products || []).some((item) => {
                                const rp = Number(item?.productId?.price) || 0;
                                const sp = Number(item?.price) || 0;
                                return rp > 0 && rp !== sp;
                              });
                              const sub = hasCorrected
                                ? (selectedOrder?.products || []).reduce((sum, item) => {
                                    const rp = Number(item?.productId?.price) || Number(item?.price) || 0;
                                    return sum + rp * (Number(item?.quantity) || 1);
                                  }, 0)
                                : Number(selectedOrder?.subTotalAmt) || 0;
                              const total = sub + (Number(selectedOrder?.deliveryCharge) || 0) - (Number(selectedOrder?.couponDiscount) || 0);
                              const displayTotal = total > 0 ? total : Number(selectedOrder?.totalAmt) || 0;
                              return Math.max(0, displayTotal - (Number(selectedOrder?.amount_paid) || 0));
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount Paid:</span>
                          <span className="font-medium text-slate-300">৳{selectedOrder?.amount_paid || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-3 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-400" />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {(() => {
                          const isDS = isDSOrder(selectedOrder);
                          const correctedItems = (selectedOrder?.products || []).map((item) => {
                            if (isDS) return { ...item, _ep: item.sellingPrice || item.price || 0 };
                            const rp = Number(item?.productId?.price) || 0;
                            const sp = Number(item?.price) || 0;
                            const ep = rp > 0 && rp !== sp ? rp : sp;
                            return { ...item, _ep: ep };
                          });
                          return correctedItems.map((item, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-2 shadow-sm border border-gray-700">
                              <div className="flex justify-between items-center">
                                <div className="flex">
                                  <img
                                    className="w-15 h-15 object-cover object-top rounded-sm mr-1"
                                    src={
                                      (Array.isArray(item?.image) ? item.image[0] : typeof item?.image === "string" ? item.image : null) ||
                                      (Array.isArray(item?.productId?.images) ? item.productId.images[0] : typeof item?.productId?.images === "string" ? item.productId.images : null) ||
                                      "/img/product.jpg"
                                    }
                                    alt={item?.name || "Product"}
                                  />
                                  <div>
                                    <h4 className="text-xs text-slate-300">{item?.name}</h4>
                                    <p className="text-xs text-gray-400">Qty: {item?.quantity}</p>
                                    <p className="text-gray-400 text-xs">Color: {item?.color || "none"}</p>
                                    <p className="text-gray-400 text-xs">Size: {item?.size || "none"}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-400">৳{item._ep.toFixed(2)}</p>
                                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Unit Price</p>
                                  {isDS && item?.sellingPrice > 0 && item?.sellingPrice !== item?.price && (
                                    <div className="mt-1 pt-1 border-t border-gray-700/50">
                                      <p className="text-[10px] text-blue-400 font-bold">Cost: ৳{item?.price.toFixed(2)}</p>
                                      <p className="text-[10px] text-emerald-400 font-bold">
                                        Profit: ৳{((Number(item?.sellingPrice || 0) - Number(item?.price || 0)) * Number(item?.quantity || 1)).toFixed(2)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      <div className="mt-6 pt-4 border-t-2 border-gray-600">
                        {isDSOrder(selectedOrder) && (
                          <div className="flex flex-col gap-2 mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-500/30 shadow-inner">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">Dropshipping Profit</span>
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-black uppercase">Verified</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">
                                Total Profit:
                                {Number(selectedOrder?.couponDiscount) > 0 && (
                                  <span className="ml-2 text-[10px] text-emerald-400 font-bold">(incl. coupon)</span>
                                )}
                              </span>
                              <span className="text-2xl font-black text-blue-400">
                                ৳{(selectedOrder?.products.reduce((sum, p) => {
                                  const cost = Number(p.costPrice || p.price) || 0;
                                  const selling = Number(p.sellingPrice) || 0;
                                  return sum + (selling > cost ? (selling - cost) * (p.quantity || 1) : 0);
                                }, 0) + (Number(selectedOrder?.couponDiscount) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-slate-300">Total:</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ৳{(() => {
                              const isDS = isDSOrder(selectedOrder);
                              const hasCorrected = !isDS && (selectedOrder?.products || []).some((item) => {
                                const rp = Number(item?.productId?.price) || 0;
                                const sp = Number(item?.price) || 0;
                                return rp > 0 && rp !== sp;
                              });
                              const sub = hasCorrected
                                ? (selectedOrder?.products || []).reduce((sum, item) => {
                                    const rp = Number(item?.productId?.price) || Number(item?.price) || 0;
                                    return sum + rp * (Number(item?.quantity) || 1);
                                  }, 0)
                                : Number(selectedOrder?.subTotalAmt) || 0;
                              const total = sub + (Number(selectedOrder?.deliveryCharge) || 0) - (Number(selectedOrder?.couponDiscount) || 0);
                              return (total > 0 ? total : Number(selectedOrder?.totalAmt) || 0).toFixed(2);
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {canModify("orders") && (
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                        <h3 className="text-lg font-bold text-slate-300 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedOrder?.order_status === "pending" && (
                            <button onClick={() => handleStatusChange(selectedOrder?._id, "processing")} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-slate-300 rounded-xl text-sm font-medium">
                              Mark Processing
                            </button>
                          )}
                          {(selectedOrder?.order_status === "pending" || selectedOrder?.order_status === "processing") && (
                            <button onClick={() => handleStatusChange(selectedOrder?._id, "shipped")} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-slate-300 rounded-xl text-sm font-medium">
                              Mark Shipped
                            </button>
                          )}
                          {selectedOrder?.order_status === "shipped" && (
                            <button onClick={() => handleStatusChange(selectedOrder?._id, "completed")} className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-slate-300 rounded-xl text-sm font-medium">
                              Mark Delivered
                            </button>
                          )}
                          {selectedOrder?.order_status !== "completed" && selectedOrder?.order_status !== "cancelled" && (
                            <button onClick={() => openConfirmation(selectedOrder, "cancelled")} className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-slate-300 rounded-xl text-sm font-medium">
                              Cancel Order
                            </button>
                          )}
                          {selectedOrder?.order_status !== "return" && selectedOrder?.order_status !== "cancelled" && selectedOrder?.order_status !== "completed" && (
                            <button onClick={() => openConfirmation(selectedOrder, "return")} className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-300 rounded-xl text-sm font-medium col-span-2">
                              Mark as Returned
                            </button>
                          )}
                          {isDSOrder(selectedOrder) && (
                            <button onClick={() => { setShowModal(false); handleDsStatusUpdate(selectedOrder); }} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-slate-300 rounded-xl text-sm font-medium col-span-2">
                              Update Dropshipping Status
                            </button>
                          )}
                        </div>

                        {/* Status History */}
                        {selectedOrder?.dropshippingStatusHistory?.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-600">
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Status History</h4>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {[...selectedOrder.dropshippingStatusHistory].reverse().map((entry, idx) => (
                                <div key={idx} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                                  <div className="flex items-center justify-between mb-1">
                                    {entry.type === "message" ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-300 shadow-lg shadow-cyan-500/25">MESSAGE</span>
                                    ) : (
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[entry.status] || "bg-gray-600 text-gray-300"}`}>
                                        {entry.status?.toUpperCase()}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-500">
                                      {entry.statusUpdatedAt ? new Date(entry.statusUpdatedAt).toLocaleString() : "N/A"}
                                    </span>
                                  </div>
                                  {entry.message && (
                                    <p className="text-xs text-cyan-300 mt-1 bg-cyan-900/20 rounded-lg p-2 border border-cyan-800/30">{entry.message}</p>
                                  )}
                                  {entry.statusNote && <p className="text-xs text-gray-400 mt-1">{entry.statusNote}</p>}
                                  {entry.trackingNumber && <p className="text-xs text-blue-400 mt-1">Tracking: {entry.trackingNumber}</p>}
                                  {entry.estimatedDelivery && <p className="text-xs text-amber-400 mt-1">Est. Delivery: {entry.estimatedDelivery}</p>}
                                  {entry.shippedBy && <p className="text-xs text-cyan-400 mt-1">Shipped by: {entry.shippedBy}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Send Message to Dropshipper */}
                        {isDSOrder(selectedOrder) && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Send Message to Dropshipper</h4>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={orderMessage}
                                onChange={(e) => setOrderMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl text-sm text-slate-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!orderMessage.trim() || sendingMessage}
                                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-300 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {sendingMessage ? "Sending..." : "Send"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Key Highlights */}
                        {isDSOrder(selectedOrder) && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Key Highlights</h4>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newKeyPoint}
                                onChange={(e) => setNewKeyPoint(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOrderKeyPoint())}
                                placeholder="Add a highlight and press Enter"
                                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl text-sm text-slate-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                              />
                              <button onClick={addOrderKeyPoint} disabled={!newKeyPoint.trim() || updatingKeyPoints} className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-slate-300 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                            </div>
                            {selectedOrder?.keyPoints?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {selectedOrder.keyPoints.map((point, i) => (
                                  <span key={i} className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                                    {point}
                                    <button onClick={() => removeOrderKeyPoint(point)} disabled={updatingKeyPoints} className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors">
                                      <X size={10} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmationModal && canModify("orders") && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-700/50 rounded-full">
                  {status === "completed" ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : status === "cancelled" ? (
                    <CircleX className="w-8 h-8 text-rose-500" />
                  ) : (
                    <RefreshCw className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-300 capitalize">Update to {status}</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to change the order status to{" "}
                <span className="text-slate-300 font-bold">{status}</span>?
                {status === "completed" && " This will mark the order as delivered and finalize it."}
                {status === "cancelled" && " This will cancel the order and cannot be undone."}
                {status === "return" && (
                  <> For <strong>COD</strong> dropshipping orders this will deduct the delivery charge (৳{selectedOrder?.deliveryCharge || 0}) from the dropshipper&apos;s balance.</>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange(selectedOrder?._id, status)}
                  className={cn(
                    "flex-1 px-6 py-3 font-semibold rounded-lg text-white shadow-lg",
                    status === "completed"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      : status === "cancelled"
                        ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                        : "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  )}
                >
                  Confirm {status}
                </button>
                <button onClick={() => { setStatus(""); setSelectedOrder(null); setConfirmationModal(false); }} className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dropshipping Status Update Modal */}
        <DropshippingStatusUpdateModal
          order={dsStatusOrder}
          isOpen={dsStatusModal}
          onClose={() => { setDsStatusModal(false); setDsStatusOrder(null); }}
          onSuccess={() => refetch()}
        />
      </Container>
    </section>
  );
};

export default OrderManagementPage;
