"use client";

import { UrlBackend } from "@/src/confic/urlExport";
import { cn } from "@/src/utlis/utils";
import axios from "axios";
import {
  AlertCircle,
  Check,
  Clock,
  ExternalLink,
  Eye,
  Hash,
  Loader2,
  Phone,
  Search,
  Upload,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const statusColors = {
  pending:
    "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25",
  approved:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
  rejected:
    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
};

const WithdrawalRequestSkeleton = () => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 flex flex-col justify-between h-full animate-pulse">
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="w-12 h-12 rounded-2xl bg-gray-700/50" />
            <div>
              {/* Name skeleton */}
              <div className="h-4 w-32 bg-gray-700/50 rounded-lg mb-2" />
              {/* Email skeleton */}
              <div className="h-2 w-24 bg-gray-700/50 rounded" />
            </div>
          </div>
          {/* Status badge skeleton */}
          <div className="w-20 h-7 bg-gray-700/50 rounded-full" />
        </div>

        <div className="space-y-4 mb-6">
          {/* Amount & Method Card */}
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-2 w-24 bg-gray-700/50 rounded mb-2" />
                <div className="h-7 w-32 bg-gray-700/50 rounded" />
              </div>
              <div className="text-right">
                <div className="h-2 w-16 bg-gray-700/50 rounded mb-2 ml-auto" />
                <div className="h-4 w-20 bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>

          {/* Receive No. & Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-2 w-20 bg-gray-700/50 rounded mb-2 ml-1" />
              <div className="bg-gray-900/50 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-gray-700/50 rounded" />
                  <div className="h-3 w-24 bg-gray-700/50 rounded" />
                </div>
              </div>
            </div>
            <div>
              <div className="h-2 w-12 bg-gray-700/50 rounded mb-2 ml-1" />
              <div className="bg-gray-900/50 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-gray-700/50 rounded" />
                  <div className="h-3 w-20 bg-gray-700/50 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof Section Skeleton (optional - shows for approved status) */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-2 w-24 bg-gray-700/50 rounded" />
              <div className="h-2 w-20 bg-gray-700/50 rounded" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
              <div className="h-2 w-16 bg-gray-700/50 rounded" />
              <div className="h-2 w-24 bg-gray-700/50 rounded" />
            </div>
            <div className="w-full h-10 bg-emerald-500/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-3">
        <div className="flex-1 h-12 bg-gray-700/50 rounded-2xl" />
        <div className="w-12 h-12 bg-gray-700/50 rounded-2xl" />
      </div>

      {/* Admin Note Skeleton (optional) */}
      <div className="mt-4 p-3 bg-black/20 rounded-xl">
        <div className="h-2 w-20 bg-gray-700/50 rounded mb-2" />
        <div className="h-2 w-full bg-gray-700/50 rounded" />
        <div className="h-2 w-3/4 bg-gray-700/50 rounded mt-1" />
      </div>
    </div>
  );
};

// For multiple skeletons (grid layout)
const WithdrawalRequestsSkeletonGrid = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <WithdrawalRequestSkeleton key={index} />
      ))}
    </>
  );
};

const PayoutManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  // Approval Form State
  const [approvingId, setApprovingId] = useState(null);
  const [adminTransactionId, setAdminTransactionId] = useState("");
  const [adminSenderNumber, setAdminSenderNumber] = useState("");
  const [adminScreenshot, setAdminScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${UrlBackend}/payment-request/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to load payment requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.number?.includes(searchTerm) ||
        req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.senderNumber?.includes(searchTerm);

      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const totalAmount = requests
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0);
    return { total, pending, totalAmount };
  }, [requests]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!adminTransactionId || !adminSenderNumber || !adminScreenshot) {
      toast.error("Transaction ID, Sender Number and Screenshot are required");
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("transactionId", adminTransactionId);
      formData.append("senderNumber", adminSenderNumber);
      formData.append("screenshot", adminScreenshot);
      formData.append("adminNote", adminNote);

      const res = await axios.patch(
        `${UrlBackend}/payment-request/approve/${approvingId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        toast.success("Payment marked as sent!");
        setApprovingId(null);
        setAdminTransactionId("");
        setAdminSenderNumber("");
        setAdminScreenshot(null);
        setScreenshotPreview(null);
        setAdminNote("");
        fetchAllRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this request? The balance will be refunded to the user.",
      )
    )
      return;

    try {
      const res = await axios.patch(
        `${UrlBackend}/payment-request/reject/${requestId}`,
        { adminNote },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success("Request rejected and balance refunded");
        fetchAllRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  //   if (loading) return <DashboardLoader />;

  const overviewStats = [
    {
      label: "Total Paid",
      value: `৳${stats.totalAmount.toLocaleString()}`,
      subtitle: "Successfully fulfilled",
      icon: Wallet,
      color: "emerald",
    },
    {
      label: "Pending",
      value: stats.pending,
      subtitle: "Waiting for action",
      icon: Clock,
      color: "amber",
    },
    {
      label: "Total Requests",
      value: stats.total,
      subtitle: "Lifetime processed",
      icon: AlertCircle,
      color: "teal",
    },
  ];

  return (
    <section className="min-h-dvh bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-600/5 to-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-emerald-900/40 to-teal-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
                Payout{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl">
                Review and fulfill withdrawal requests from dropshippers.
                Maintain financial transparency and speed.
              </p>
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10 hidden lg:block">
              <Wallet size={120} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {overviewStats.map((stat, idx) => {
            const Icon = stat.icon;

            return (
              <div
                key={idx}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={cn(
                      `p-3 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400 group-hover:scale-110 transition-transform`,
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest text-${stat.color}-500/50`}
                  >
                    {stat.label}
                  </span>
                </div>

                {loading ? (
                  <Loader2 className="animate-spin text-slate-200" />
                ) : (
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                )}
                <p className="text-xs text-gray-400 mt-1 font-bold">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, number or TxID..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all backdrop-blur-sm text-gray-200 placeholder-gray-500 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                  filterStatus === status
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <WithdrawalRequestsSkeletonGrid />
          ) : filteredRequests.length === 0 ? (
            <>
              <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Search size={48} />
                </div>
                <p className="text-xl font-black">No requests found</p>
                <p className="text-sm font-bold">
                  Try adjusting your filters or search term
                </p>
              </div>
            </>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 hover:bg-gray-800/50 transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-black text-gray-100 text-sm leading-none">
                          {req.userId?.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">
                          {req.userId?.email}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColors[req.status]}`}
                    >
                      {req.status}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-black/20 rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-inner">
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
                          Withdrawal Amount
                        </p>
                        <p className="text-xl font-black text-emerald-400">
                          ৳{req.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
                          Method
                        </p>
                        <p className="text-sm font-black text-gray-300">
                          {req.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">
                          Receive No.
                        </p>
                        <div className="bg-gray-900/50 rounded-xl p-3 flex items-center gap-2 border border-white/5">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-300">
                            {req.number}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">
                          Date
                        </p>
                        <div className="bg-gray-900/50 rounded-xl p-3 flex items-center gap-2 border border-white/5">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-300">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {req.status === "approved" && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                          <span>Payment Proof</span>
                          <span className="flex items-center gap-1">
                            <Hash size={10} /> {req.transactionId}
                          </span>
                        </div>
                        {req.senderNumber && (
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-emerald-500/10 pt-2">
                            <span>Sent From</span>
                            <span>{req.senderNumber}</span>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedImage(req.screenshot)}
                          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-emerald-500/10"
                        >
                          <Eye size={16} /> View Receipt
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {req.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setApprovingId(req._id)}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Send Payout
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="w-12 bg-gray-900/50 text-red-500 hover:bg-red-500/10 py-3.5 rounded-2xl flex items-center justify-center transition-all border border-white/5 group-hover:border-red-500/30"
                      title="Reject & Refund"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {req.adminNote && (
                  <p className="mt-4 p-3 bg-black/20 rounded-xl text-[10px] text-gray-500 italic border-l-2 border-emerald-500 leading-relaxed">
                    <span className="font-black uppercase text-[8px] block mb-1">
                      Admin Note:
                    </span>
                    "{req.adminNote}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {approvingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Complete Payout
                </h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Enter transaction details
                </p>
              </div>
              <button
                onClick={() => setApprovingId(null)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Recipient Details Summary */}
            {requests.find((r) => r._id === approvingId) && (
              <div className="bg-emerald-500/5 rounded-3xl p-5 space-y-3 border border-emerald-500/10 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Send Amount
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    ৳
                    {requests
                      .find((r) => r._id === approvingId)
                      .amount.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-gray-800/50 w-full"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Method & No.
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-200">
                      {
                        requests.find((r) => r._id === approvingId)
                          .paymentMethod
                      }
                    </p>
                    <p className="text-xs font-bold text-emerald-400 select-all cursor-pointer">
                      {requests.find((r) => r._id === approvingId).number}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleApprove} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Your Sender No.
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="text"
                      value={adminSenderNumber}
                      onChange={(e) => setAdminSenderNumber(e.target.value)}
                      placeholder="e.g. 017..."
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-10 pr-4 py-4 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-white placeholder-gray-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Transaction ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="text"
                      value={adminTransactionId}
                      onChange={(e) => setAdminTransactionId(e.target.value)}
                      placeholder="TxID..."
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-10 pr-4 py-4 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-white placeholder-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                  Proof of Payment
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="w-full h-32 border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all overflow-hidden">
                    {screenshotPreview ? (
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="h-full w-full object-cover p-2 rounded-3xl"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-600 group-hover:text-emerald-500" />
                        <p className="text-[10px] font-black text-gray-500">
                          Drop receipt or click
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Payout Completion"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-[3rem] overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Receipt"
              className="w-full h-auto max-h-[80vh] object-contain rounded-[2.5rem]"
            />
            <div className="p-6 flex justify-between items-center bg-gray-900">
              <div>
                <p className="text-xs font-black text-gray-100 uppercase tracking-widest">
                  Official Receipt
                </p>
                <p className="text-[10px] font-bold text-gray-500">
                  Verified by EasyShoppingMall Admin
                </p>
              </div>
              <a
                href={selectedImage}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
              >
                Open Original <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PayoutManagement;
