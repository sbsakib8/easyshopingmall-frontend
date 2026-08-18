"use client";

import { deductCourierCost, getCourierDeductions } from "@/src/hook/useAuth";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Package,
  Search,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

const formatBDT = (amount) => {
  if (amount == null) return "৳ 0";
  return `৳${Number(amount).toLocaleString()}`;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
};

const CourierCostPage = () => {
  // Form state
  const [dropshipperInput, setDropshipperInput] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [courierCharge, setCourierCharge] = useState("");
  const [actualCourierCharge, setActualCourierCharge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // History state
  const [deductions, setDeductions] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const difference =
    courierCharge && actualCourierCharge
      ? Number(courierCharge) - Number(actualCourierCharge)
      : 0;

  const fetchDeductions = async (page = 1, search = "") => {
    try {
      setIsLoadingHistory(true);
      const params = { page, limit: 20 };
      if (search) params.search = search;

      const response = await getCourierDeductions(params);
      const transactions = response?.data?.transactions || [];
      const courierTransactions = transactions.filter(
        (t) => t.type === "courier_adjustment",
      );

      setDeductions(courierTransactions);
      setPagination(response?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      });
    } catch (err) {
      console.error("Fetch deductions error", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDeductions(currentPage, historySearch);
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!dropshipperInput.trim()) {
      setSubmitMessage({ type: "error", text: "Dropshipper ID or email is required" });
      return;
    }
    if (!orderInput.trim()) {
      setSubmitMessage({ type: "error", text: "Order ID is required" });
      return;
    }
    if (!courierCharge || Number(courierCharge) <= 0) {
      setSubmitMessage({ type: "error", text: "Courier charge must be greater than 0" });
      return;
    }
    if (!actualCourierCharge || Number(actualCourierCharge) < 0) {
      setSubmitMessage({ type: "error", text: "Actual courier charge must be non-negative" });
      return;
    }
    if (difference <= 0) {
      setSubmitMessage({
        type: "error",
        text: "Actual courier charge must be less than courier charge to have a deduction",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await deductCourierCost({
        dropshipperId: dropshipperInput.trim(),
        orderId: orderInput.trim(),
        courierCharge: Number(courierCharge),
        actualCourierCharge: Number(actualCourierCharge),
      });

      setSubmitMessage({
        type: "success",
        text: result?.message || "Courier cost deducted successfully",
      });

      // Reset form
      setDropshipperInput("");
      setOrderInput("");
      setCourierCharge("");
      setActualCourierCharge("");

      // Refresh history
      fetchDeductions(currentPage, historySearch);
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to deduct courier cost",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHistorySearch = (e) => {
    const value = e.target.value;
    setHistorySearch(value);
    setCurrentPage(1);
    fetchDeductions(1, value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="py-5 px-2 lg:px-9">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-300 mb-2">
                  Courier Cost Management
                </h1>
                <p className="text-gray-400">
                  Deduct courier cost differences from dropshipper balances
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-3 px-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Total Deductions",
                value: pagination.totalItems,
                icon: FileText,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "This Session Difference",
                value: difference > 0 ? formatBDT(difference) : "৳0",
                icon: AlertCircle,
                color: difference > 0 ? "from-red-500 to-orange-500" : "from-green-500 to-emerald-500",
              },
              {
                title: "Ready to Deduct",
                value: difference > 0 ? formatBDT(difference) : "৳0",
                icon: Wallet,
                color: "from-purple-500 to-pink-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-300 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Deduction Form */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">
              New Courier Cost Deduction
            </h2>

            {submitMessage && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  submitMessage.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {submitMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Dropshipper ID or Email
                  </label>
                  <input
                    type="text"
                    value={dropshipperInput}
                    onChange={(e) => setDropshipperInput(e.target.value)}
                    placeholder="Enter dropshipper ID or email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="Enter order ID"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Actual Courier Charge (BDT)
                  </label>
                  <input
                    type="number"
                    value={courierCharge}
                    onChange={(e) => setCourierCharge(e.target.value)}
                    placeholder="Actual courier cost"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Charged Delivery Amount (BDT)
                  </label>
                  <input
                    type="number"
                    value={actualCourierCharge}
                    onChange={(e) => setActualCourierCharge(e.target.value)}
                    placeholder="Amount charged to customer"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {difference > 0 && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    Difference to deduct: <span className="font-bold">{formatBDT(difference)}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || difference <= 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Processing..." : "Deduct Courier Cost"}
              </button>
            </form>
          </div>

          {/* Deduction History */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-6 py-4 border-b border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-300">
                  Deduction History
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by dropshipper..."
                    value={historySearch}
                    onChange={handleHistorySearch}
                    className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-700/50">
              {isLoadingHistory ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              ) : deductions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">
                    No courier deductions found
                  </div>
                  <p className="text-gray-500">
                    Deductions will appear here after processing
                  </p>
                </div>
              ) : (
                deductions.map((deduction) => (
                  <div
                    key={deduction._id}
                    className="px-6 py-4 hover:bg-gray-700/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300 font-medium">
                            {deduction.userId?.name || "Unknown"}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({deduction.userId?.email || "N/A"})
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 ml-7">
                          {deduction.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-bold">
                          {formatBDT(Math.abs(deduction.amount))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(deduction.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50">
                <div className="text-gray-400 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-slate-300 hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages),
                      )
                    }
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 text-gray-400 hover:text-slate-300 hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierCostPage;
