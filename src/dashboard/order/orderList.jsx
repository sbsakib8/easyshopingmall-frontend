"use client";

import Container from "@/src/compronent/shared/Container";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders";
import { OrderUpdate } from "@/src/utlis/useOrder";
import { isDSOrder } from "@/src/utlis/orderHelpers";
import { cn } from "@/src/utlis/utils";
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
  Loader2,
  LoaderIcon,
  Mail,
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
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

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

const priorityColors = {
  high: "bg-gradient-to-r from-red-500 to-pink-500 text-slate-300",
  medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-300",
  low: "bg-gradient-to-r from-green-500 to-teal-500 text-slate-300",
};

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  shipped: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
  return: RefreshCw,
};

const SkeletonOrderCard = () => {
  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 shadow-lg animate-pulse">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

        <div className="px-3 py-6">
          {/* Header Section */}
          <div className="flex flex-col-reverse gap-3 items-start justify-between mb-4">
            <div className="flex items-center gap-4 w-full">
              {/* Checkbox */}
              <div className="w-7 h-7 bg-gray-700 rounded-lg"></div>

              {/* Package Icon */}
              <div className="w-12 h-12 bg-gray-700 rounded-2xl flex-shrink-0"></div>

              <div className="flex-1 min-w-0">
                {/* Order ID */}
                <div className="h-4 w-28 bg-gray-700 rounded mb-2"></div>
                {/* Customer Name */}
                <div className="h-4 w-40 bg-gray-700 rounded"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-700 rounded-xl"></div>
              <div className="w-9 h-9 bg-gray-700 rounded-xl"></div>
            </div>
          </div>

          {/* Date & Total Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="py-3 px-2 bg-gray-700/50 rounded-xl">
              <div className="h-4 w-16 bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-5 w-20 bg-gray-600 rounded mx-auto"></div>
            </div>
            <div className="py-3 px-2 bg-gray-700/50 rounded-xl">
              <div className="h-4 w-12 bg-gray-600 rounded mx-auto mb-2"></div>
              <div className="h-5 w-24 bg-gray-600 rounded mx-auto"></div>
            </div>
          </div>

          {/* Status & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-700 rounded"></div>
              <div className="h-8 px-6 bg-gray-700 rounded-2xl"></div>
            </div>

            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="pt-4 border-t border-gray-700">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <div className="h-3.5 w-36 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <div className="h-3.5 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New order received from John Doe",
      type: "info",
      time: "2 min ago",
    },
    {
      id: 2,
      message: "Order ORD-003 has been shipped",
      type: "success",
      time: "5 min ago",
    },
    {
      id: 3,
      message: "Payment failed for order ORD-007",
      type: "error",
      time: "10 min ago",
    },
  ]);

  const filteredOrders = useMemo(() => {
    const filtered = allOrders?.filter((order) => {
      const customerName = order?.userId?.name || "user";
      const customerEmail = order?.userId?.email || "user@damy.com";
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = order?.order_status === "pending";
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered?.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "updatedAt" || sortBy === "orderDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === "total") {
        aValue = Number.parseFloat(aValue);
        bValue = Number.parseFloat(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder, allOrders]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allOrders?.length;
    const completed = allOrders?.filter(
      (o) => o?.order_status === "completed",
    )?.length;
    const pending = allOrders?.filter(
      (o) => o?.order_status === "pending",
    )?.length;
    const processing = allOrders?.filter(
      (o) => o?.order_status === "processing",
    )?.length;
    const revenue = allOrders
      ?.filter((o) => o?.order_status === "completed")
      ?.reduce((sum, o) => sum + o.totalAmt, 0);
    const avgOrderValue = revenue / completed || 0;
    return { total, completed, pending, processing, revenue, avgOrderValue };
  }, [allOrders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleBulkAction = async (action) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Bulk ${action} for orders:`, Array.from(selectedOrders));
    setSelectedOrders(new Set());
    setIsLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedOrders?.size === paginatedOrders?.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(
        new Set(paginatedOrders.map((order) => order?.orderId)),
      );
    }
  };

  const handleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setIsLoading(true);
    const res = await OrderUpdate(orderId, newStatus);

    if (res.success) {
      setShowModal(false);

      refetch();
    }
    setIsLoading(false);
  };

  const handleDeleteOrder = async (orderId, newStatus) => {
    setIsLoading(true);
    const res = await OrderUpdate(orderId, newStatus);

    if (res.success) {
      setShowModal(false);
      setConfirmationModal(false);
      refetch();
    }
    setIsLoading(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
      id: "completed",
      label: "Completed",
      valueKey: "completed",
      icon: CheckCircle,
      iconColor: "text-green-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
    },
    {
      id: "pending",
      label: "Pending",
      valueKey: "pending",
      icon: Clock,
      iconColor: "text-orange-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
    },
    {
      id: "processing",
      label: "Processing",
      valueKey: "processing",
      icon: LoaderIcon,
      iconColor: "text-orange-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
    },
    {
      id: "revenue",
      label: "Revenue",
      valueKey: "revenue",
      icon: DollarSign,
      iconColor: "text-purple-400",
      accent: (
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
      ),
      prefix: "৳",
      formatValue: (value) => value?.toFixed(0) || "0",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-10 md:py-16">
      <Container className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
                Pending{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Orders
                </span>
                !
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                EasyShoppingMall Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {statsCards.map((card) => {
            const rawValue = stats?.[card.valueKey];
            const displayValue = card.formatValue
              ? card.formatValue(rawValue)
              : (rawValue ?? 0);

            return (
              <div
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900",
                  "border border-gray-700 p-6 text-slate-300 shadow-xl",
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
                      {card.prefix}
                      {displayValue}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 p-6">
          <div className="flex flex-col space-y-6">
            {/* Top row - Search and main controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders by customer, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-300 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {selectedOrders?.size > 0 && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
                    <span className="text-blue-300 text-sm font-medium">
                      {selectedOrders?.size} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-slate-300 rounded-lg text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleBulkAction("export")}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-slate-300 rounded-lg text-xs"
                    >
                      Export
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-300">
                  Orders ({ordersLoading ? <Loader2 /> : allOrders?.length || 0}
                  )
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="p-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-slate-300 hover:border-gray-500"
                >
                  {selectedOrders?.size === paginatedOrders?.length ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {ordersLoading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonOrderCard key={i} />
                  ))}
                </>
              ) : (
                paginatedOrders?.map((order) => {
                  const StatusIcon = statusIcons[order?.status];
                  const isSelected = selectedOrders.has(order?.orderId);

                  return (
                    <div
                      key={order?.orderId}
                      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border ${isSelected ? "border-blue-500 shadow-lg shadow-blue-500/25" : "border-gray-700 hover:border-gray-600"} shadow-lg cursor-pointer`}
                      onClick={() => handleViewOrder(order)}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                      <div className="px-3 py-6">
                        <div className="flex flex-col-reverse gap-3 items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectOrder(order?.orderId);
                              }}
                              className="p-1 rounded-lg hover:bg-gray-700"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-blue-400" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-400" />
                              )}
                            </button>

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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(order);
                              }}
                              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-300 shadow-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmationModal(true);
                                setSelectedOrder(order);
                              }}
                              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-slate-300 shadow-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center py-3 px-2 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                              <Calendar className="h-4 w-4" />
                              Date
                            </div>
                            <div className="text-slate-300 font-semibold text-base">
                              {new Date(
                                order?.products[0]?.productId?.createdAt,
                              ).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="text-center py-3 px-2 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                            <div className="flex items-center justify-center text-gray-400 text-sm mb-1">
                              <DollarSign className="h-4 w-4" />
                              Total
                            </div>
                            <div className="text-base font-semibold text-green-400">
                              ৳{order?.totalAmt.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {StatusIcon && (
                              <StatusIcon className="h-5 w-5 text-slate-300" />
                            )}
                            <span
                              className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize text-black ${statusColors[order?.order_status]}`}
                            >
                              {order?.order_status.charAt(0).toUpperCase() +
                                order?.order_status.slice(1)}
                            </span>
                          </div>

                          {order?.products[0]?.productId?.ratings && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < order?.products[0]?.productId?.ratings ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {order?.customerEmail}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {order?.products.length} item
                              {order?.products.length > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                          className={`w-10 h-10 rounded-xl ${currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-300 shadow-lg"
                              : "bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-slate-300 hover:border-gray-500"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 min-h-screen">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-blue-200">
                      {selectedOrder?.orderId}{" "}
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </p>
                    <p className="text-blue-200">
                      <span className="font-bold">Order Date:</span>{" "}
                      {new Date(selectedOrder?.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 cursor-pointer hover:text-red-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-300">
                              {selectedOrder?.userId?.name}
                            </span>
                            {isDSOrder(selectedOrder) && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">
                                Dropshipping
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">
                            {selectedOrder?.userId?.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">
                            {selectedOrder?.address?.mobile || "018XXXXXXXX"}
                          </span>
                        </div>
                        <div className="flex flex-col items-start gap-3">
                          {/* <MapPin className="h-4 w-4 text-gray-400 mt-1"/> */}
                          <h3 className="font-bold text-slate-300">
                            Address Line:{" "}
                            <span className="text-gray-300 font-normal">
                              {selectedOrder?.address?.address_line || "None"}
                            </span>
                          </h3>
                          {selectedOrder?.address?.district && (
                            <h3 className="font-bold text-slate-300">
                              District:{" "}
                              <span className="text-gray-300 font-normal">
                                {selectedOrder?.address?.district || "None"}
                              </span>
                            </h3>
                          )}
                          <h3 className="font-bold text-slate-300">
                            District:{" "}
                            <span className="text-gray-300 font-normal">
                              {selectedOrder?.address?.district || "None"}
                            </span>
                          </h3>
                          {selectedOrder?.address?.division && (
                            <h3 className="font-bold text-slate-300">
                              Division:{" "}
                              <span className="text-gray-300 font-normal">
                                {selectedOrder?.address?.division || "None"}
                              </span>
                            </h3>
                          )}

                          {selectedOrder?.address?.pincode && (
                            <h3 className="font-bold text-slate-300">
                              Pincode:{" "}
                              <span className="text-gray-300 font-normal">
                                {selectedOrder?.address?.pincode || "None"}
                              </span>
                            </h3>
                          )}

                          <h3 className="font-bold text-slate-300">
                            Upazila Thana:{" "}
                            <span className="text-gray-300 font-normal">
                              {selectedOrder?.address?.upazila_thana || "None"}
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Date:</span>
                          <span className="font-medium text-slate-300">
                            {new Date(
                              selectedOrder?.updatedAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Items:</span>
                          <span className="font-medium text-slate-300">
                            {selectedOrder?.products.length}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Order Status:</span>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const StatusIcon =
                                statusIcons[selectedOrder?.order_status];
                              return StatusIcon ? (
                                <StatusIcon className="h-4 w-4 text-slate-300" />
                              ) : null;
                            })()}
                            <span
                              className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[selectedOrder?.order_status]}`}
                            >
                              {selectedOrder?.order_status
                                .charAt(0)
                                .toUpperCase() +
                                selectedOrder?.order_status?.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Sub Total:</span>
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
                              return `৳${sub2}`;
                            })()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Delivery Charge:
                          </span>
                          <span className="font-medium text-slate-300">
                            ৳{selectedOrder?.deliveryCharge || "None"}
                          </span>
                        </div>

                        {selectedOrder?.couponDiscount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>
                              Coupon Discount ({selectedOrder?.appliedCoupon}):
                            </span>
                            <span className="font-medium">
                              - ৳{selectedOrder?.couponDiscount}
                            </span>
                          </div>
                        )}

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
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total:</span>
                              <span className="font-medium text-slate-300">
                                ৳{displayTotal2}
                              </span>
                            </div>
                          );
                        })()}

                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="font-medium text-slate-300">
                            {selectedOrder?.payment_method || "None"}
                          </span>
                        </div>
                        {/* payment manual */}
                        {selectedOrder?.payment_method === "manual" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Provider Name:
                              </span>
                              <span className="font-medium text-slate-300">
                                {selectedOrder?.payment_details?.manual
                                  ?.provider || "None"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Transaction Id:
                              </span>
                              <span className="font-medium text-slate-300">
                                {
                                  selectedOrder?.payment_details?.manual
                                    ?.transactionId
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Paid For :</span>
                              {selectedOrder?.payment_details?.manual
                                ?.paidFor && (
                                  <span className="font-medium text-slate-300">
                                    {selectedOrder?.payment_details?.manual
                                      ?.paidFor || "None"}{" "}
                                  </span>
                                )}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Provider Number:
                              </span>
                              <span className="font-medium text-slate-300">
                                {selectedOrder?.payment_details?.manual
                                  ?.senderNumber || "None"}
                              </span>
                            </div>
                          </>
                        )}

                        {/* payment ssl */}
                        {selectedOrder?.payment_method === "sslcommerz" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Transaction Id:
                              </span>
                              <span className="ml-2 text-xs text-slate-300">
                                {selectedOrder?.payment_details?.tran_id ||
                                  "None"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Transaction Date:
                              </span>
                              <span className="font-medium text-slate-300">
                                {new Date(
                                  selectedOrder?.payment_details?.tran_date ||
                                  "None",
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Card Issuer:
                              </span>
                              <span className="font-medium text-slate-300">
                                {selectedOrder?.payment_details?.card_issuer ||
                                  "None"}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="flex justify-between">
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
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount Paid:</span>
                          <span className="font-medium text-slate-300">
                            ৳{selectedOrder?.amount_paid}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Type:</span>
                          <span className="font-medium text-slate-300 capitalize">
                            {selectedOrder?.payment_type || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedOrder?.payment_status === "paid" ? "bg-green-500/20 text-green-400" :
                              selectedOrder?.payment_status === "submitted" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-gray-500/20 text-gray-400"
                            }`}>
                            {selectedOrder?.payment_status || "—"}
                          </span>
                        </div>

                        {selectedOrder?.rating && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < selectedOrder?.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-3 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-400" />
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
                              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-2 shadow-sm border border-gray-700"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex">
                                  <img
                                    className="w-15 h-15 object-cover object-top rounded-sm mr-1"
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
                                        : typeof item?.productId?.images ===
                                          "string"
                                          ? item.productId.images
                                          : null) ||
                                      (Array.isArray(item?.productId?.image)
                                        ? item.productId.image[0]
                                        : typeof item?.productId?.image ===
                                          "string"
                                          ? item.productId.image
                                          : null) ||
                                      "/img/product.jpg"
                                    }
                                    alt={item?.name || "Product"}
                                  />
                                  <div>
                                    <h4 className="text-xs text-slate-300">
                                      {item?.name}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Quantity: {item?.quantity}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      Color: {item?.color || "none"}
                                    </p>
                                    <p className="text-gray-400 text-xs">
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
                                          Dropshipping Cost: ৳{item?.price.toFixed(2)}
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
                            </div>
                          ));
                        })()}
                      </div>

                      <div className="mt-6 pt-4 border-t-2 border-gray-600">
                        {(selectedOrder?.userId?.role === "DROPSHIPPING" ||
                          (Array.isArray(selectedOrder?.userId?.roles) &&
                            selectedOrder?.userId?.roles.includes(
                              "DROPSHIPPING",
                            ))) && (
                            <div className="flex flex-col gap-2 mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-500/30 shadow-inner">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">
                                  Dropshipping Profit Breakdown
                                </span>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-black uppercase">
                                  Verified
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">
                                  Total Profit:
                                  {Number(selectedOrder?.couponDiscount) > 0 && (
                                    <span className="ml-2 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
                                      (incl. coupon compensation)
                                    </span>
                                  )}
                                </span>
                                <span className="text-2xl font-black text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
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
                            Total Amount:
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
                              <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                ৳{displayTotal2.toFixed(2)}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-slate-300 mb-4">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            handleStatusChange(selectedOrder?._id, "processing")
                          }
                          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-slate-300 rounded-xl text-sm font-medium"
                        >
                          Mark Processing
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(selectedOrder?._id, "shipped")
                          }
                          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-slate-300 rounded-xl text-sm font-medium"
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(selectedOrder?._id, "completed")
                          }
                          className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-slate-300 rounded-xl text-sm font-medium"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(selectedOrder?._id, "cancelled")
                          }
                          className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-slate-300 rounded-xl text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders?.length === 0 && (
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
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-300 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Container>

      {/* confirmation modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-full">
                <Trash2 className="w-8 h-8 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-300">
                Delete Product
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleDeleteOrder(selectedOrder?._id, "cancelled")
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-slate-300 font-semibold rounded-lg transform"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmationModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        . {
          animation: 0.3s forwards;
        }

        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default OrderManagement;
