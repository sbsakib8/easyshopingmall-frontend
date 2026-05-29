"use client";

import Container from "@/src/compronent/shared/Container";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";
import { cn } from "@/src/utlis/utils";
import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  Film,
  Hash,
  Link2,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const statusColors = {
  pending:
    "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25",
  approved:
    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25",
  completed:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
  rejected:
    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
};

const customRequestTypeLabels = {
  facebook_ad: "Facebook Ad Creative",
  tiktok_video: "TikTok Ad Video",
  youtube_short: "YouTube Short/Reel",
  unboxing: "Unboxing / UGC Video",
  other: "Custom / Special Video",
};

const StatCard = ({ stat = {}, className = "" }) => {
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-3.5 bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 md:p-6 hover:bg-slate-800 transition-all group text-center",
          className,
        )}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`p-4 bg-${stat.color}-500/10 text-${stat.color}-400 rounded-2xl group-hover:scale-110 transition-transform`}
          >
            <stat.icon />
          </div>
        </div>

        {/* Value */}
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tighter tabular-nums">
          {stat.prefix && stat.prefix}
          {stat.value}
        </p>

        {/* Label */}
        <span className="text-xs sm:text-sm md:text-base font-medium text-slate-400 uppercase tracking-widest block mt-auto">
          {stat.label}
        </span>
      </div>
    </>
  );
};

const tabs = [
  {
    id: "premium_access",
    label: "Paid Video Payments",
    icon: CreditCard,
  },
  {
    id: "custom_requests",
    label: "Custom Video Orders",
    icon: Film,
  },
];

const VideoAccessManagement = () => {
  const [activeTab, setActiveTab] = useState("premium_access"); // "premium_access" or "custom_requests"

  // Premium Access Requests
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  // Custom Video Requests state
  const [customRequests, setCustomRequests] = useState([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [customSearchTerm, setCustomSearchTerm] = useState("");
  const [customFilterStatus, setCustomFilterStatus] = useState("all");
  const [deliveredUrlInput, setDeliveredUrlInput] = useState({});
  const [adminNoteInput, setAdminNoteInput] = useState({});

  // Custom confirmation modal state
  const [actionConfirm, setActionConfirm] = useState({
    show: false,
    requestId: null,
    status: "",
    type: "access", // "access" | "custom"
    message: "",
    deliveredVideoUrl: "",
    adminNote: "",
  });

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${UrlBackend}/video-access/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to load video access requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCustomRequests = async () => {
    setLoadingCustom(true);
    try {
      const res = await axios.get(`${UrlBackend}/video-request/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCustomRequests(res.data.data);
        // Pre-populate input states
        const delivered = {};
        const notes = {};
        res.data.data.forEach((req) => {
          delivered[req._id] = req.deliveredVideoUrl || "";
          notes[req._id] = req.adminNote || "";
        });
        setDeliveredUrlInput(delivered);
        setAdminNoteInput(notes);
      }
    } catch (error) {
      console.error("Failed to fetch custom video requests", error);
      toast.error("Failed to load custom video requests");
    } finally {
      setLoadingCustom(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    fetchAllCustomRequests();
  }, []);

  // Filter premium access requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.senderNumber?.includes(searchTerm) ||
        req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, filterStatus]);

  // Filter custom video requests
  const filteredCustomRequests = useMemo(() => {
    return customRequests.filter((req) => {
      const matchesSearch =
        req.userId?.name
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase()) ||
        req.userId?.email
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase()) ||
        req.productId?.productName
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase());

      const matchesStatus =
        customFilterStatus === "all" || req.status === customFilterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customRequests, customSearchTerm, customFilterStatus]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const revenue = requests
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { total, pending, approved, revenue };
  }, [requests]);

  const customStats = useMemo(() => {
    const total = customRequests.length;
    const pending = customRequests.filter((r) => r.status === "pending").length;
    const completed = customRequests.filter(
      (r) => r.status === "completed",
    ).length;

    return { total, pending, completed };
  }, [customRequests]);

  const triggerUpdateStatus = (requestId, status) => {
    const message =
      status === "approved"
        ? "Approve this payment and grant video access?"
        : "Reject this payment request?";

    setActionConfirm({
      show: true,
      requestId,
      status,
      type: "access",
      message,
      deliveredVideoUrl: "",
      adminNote: adminNote,
    });
  };

  const executeUpdateStatus = async () => {
    const { requestId, status, adminNote: note } = actionConfirm;
    setActionConfirm((prev) => ({ ...prev, show: false }));
    setActionLoading(true);
    try {
      const res = await axios.patch(
        `${UrlBackend}/video-access/update/${requestId}`,
        { status, adminNote: note || adminNote },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(`Request ${status} successfully`);
        setAdminNote("");
        fetchAllRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setActionLoading(false);
    }
  };

  const triggerUpdateCustomRequest = (requestId, status) => {
    const note = adminNoteInput[requestId] || "";
    const deliveredUrl = deliveredUrlInput[requestId] || "";

    if (status === "completed" && !deliveredUrl) {
      toast.error("Delivered Video URL is required when marking completed!");
      return;
    }

    const message = `Are you sure you want to mark this custom video request as ${status}?`;
    setActionConfirm({
      show: true,
      requestId,
      status,
      type: "custom",
      message,
      deliveredVideoUrl: deliveredUrl,
      adminNote: note,
    });
  };

  const executeUpdateCustomRequest = async () => {
    const { requestId, status, adminNote: note, deliveredVideoUrl: deliveredUrl } = actionConfirm;
    setActionConfirm((prev) => ({ ...prev, show: false }));
    setActionLoading(true);
    try {
      const res = await axios.patch(
        `${UrlBackend}/video-request/update/${requestId}`,
        {
          status,
          adminNote: note,
          deliveredVideoUrl: deliveredUrl,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(`Custom video request ${status}! ✅`);
        fetchAllCustomRequests();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update custom video request",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = () => {
    if (actionConfirm.type === "access") {
      executeUpdateStatus();
    } else {
      executeUpdateCustomRequest();
    }
  };

  if (loading && requests.length === 0) return <DashboardLoader />;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 md:py-16">
      <Container className="space-y-10 overflow-hidden">
        {/* Header with Tab Switcher */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 md:p-7 lg:p-9 shadow-2xl overflow-hidden relative group flex flex-col xl:flex-row xl:items-center justify-between gap-5 lg:gap-8">
          {/* Background Accent */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-emerald-500 rounded-full blur-[100px] -mr-12 -mt-12"></div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 uppercase tracking-tight leading-tight">
              Dropshipping <span className="text-emerald-400">Media</span> Admin
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              Verify premium access payments and dispatch custom high-converting
              ad videos.
            </p>
          </div>

          {/* Tab Controller */}
          <div className="self-end bg-white/5 backdrop-blur-md rounded-2xl flex  relative z-10 lg:w-auto lg:min-w-[420px] w-min">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[min(10px,2.3vw)] md:text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap flex-1 sm:flex-none",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                <tab.icon size={14} className="hidden sm:inline-block" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
                    TAB 1: PREMIUM COURSE ACCESS VERIFICATION
                    ======================================================== */}
        {activeTab === "premium_access" && (
          <div className="animate-in fade-in duration-300">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                {
                  label: "Total Requests",
                  value: stats.total ?? 0,
                  icon: Hash,
                  color: "emerald",
                  prefix: "",
                },
                {
                  label: "Pending Approval",
                  value: stats.pending ?? 0,
                  icon: Clock,
                  color: "amber",
                  prefix: "",
                },
                {
                  label: "Approved Users",
                  value: stats.approved ?? 0,
                  icon: ShieldCheck,
                  color: "teal",
                  prefix: "",
                },
                {
                  label: "Total Revenue",
                  value: stats.revenue.toLocaleString() ?? 0,
                  icon: DollarSign,
                  color: "purple",
                  prefix: "৳",
                },
              ].map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, TxID or sender number..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-2 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-semibold text-xs sm:text-sm md:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest transition-all border",
                      {
                        "bg-emerald-600 border-emerald-500 text-white shadow-lg":
                          filterStatus === status,
                        "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800":
                          filterStatus !== status,
                      },
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Table/Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 md:p-6 hover:bg-slate-800/70 transition-all group flex flex-col justify-between gap-4 h-full overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                        <User size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-100 text-sm leading-tight truncate">
                          {req.userId?.name}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                          {req.userId?.email}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-[8px] font-semibold uppercase tracking-widest whitespace-nowrap ${statusColors[req.status]}`}
                    >
                      {req.status}
                    </div>
                  </div>

                  {req.courseId?.title && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-2.5 flex items-center gap-2">
                      <Video size={14} className="text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-bold text-indigo-300 truncate">
                        {req.courseId.title}
                      </span>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                        Payment Method
                      </p>
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 capitalize">
                        <ArrowUpRight size={12} /> {req.paymentMethod}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                        Paid Amount
                      </p>
                      <p className="text-xs font-semibold text-white">
                        ৳{req.amount}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                        Sender Number
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {req.senderNumber}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                        Transaction ID
                      </p>
                      <p className="text-xs font-semibold text-slate-200 select-all cursor-copy">
                        {req.transactionId}
                      </p>
                    </div>
                  </div>

                  {/* Date - Kept as is */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-900/50 px-3 py-2 rounded-2xl w-fit">
                    <Calendar size={14} />
                    {new Date(req.createdAt).toLocaleString()}
                  </div>

                  {/* Action Buttons - Right Side */}
                  {req.status === "pending" && (
                    <div className="flex items-center justify-end gap-3 mt-auto">
                      <button
                        onClick={() => triggerUpdateStatus(req._id, "approved")}
                        disabled={actionLoading}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-3 rounded-2xl text-xs font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Check size={16} /> Approve Access
                      </button>

                      <button
                        onClick={() => triggerUpdateStatus(req._id, "rejected")}
                        disabled={actionLoading}
                        className="px-3 py-2 bg-slate-900/70 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all border border-white/5 disabled:opacity-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  {req.adminNote && (
                    <div className="p-4 bg-slate-900/50 rounded-2xl border-l-4 border-emerald-500">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                        Admin Note
                      </p>
                      <p className="text-xs text-slate-300 italic">
                        "{req.adminNote}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-14 opacity-20">
                <Search size={64} className="mb-4" />
                <p className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                  No access requests found
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
                    TAB 2: CUSTOM DROPSHIPPER VIDEO REQUESTS
                    ======================================================== */}
        {activeTab === "custom_requests" && (
          <div className="animate-in fade-in duration-300">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: "Total Video Orders",
                  value: customStats.total ?? 0,
                  icon: Film,
                  color: "indigo",
                },
                {
                  label: "Pending Processing",
                  value: customStats.pending ?? 0,
                  icon: Clock,
                  color: "amber",
                },
                {
                  label: "Completed Ads Delivered",
                  value: customStats.completed ?? 0,
                  icon: Check,
                  color: "emerald",
                },
              ].map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by user name, email, or product name..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-2 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-semibold text-xs sm:text-sm md:text-base"
                  value={customSearchTerm}
                  onChange={(e) => setCustomSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {["all", "pending", "approved", "completed", "rejected"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setCustomFilterStatus(status)}
                      className={cn(
                        "px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[8px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest transition-all border",
                        {
                          "bg-emerald-600 border-emerald-500 text-white shadow-lg":
                            customFilterStatus === status,
                          "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800":
                            customFilterStatus !== status,
                        },
                      )}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={fetchAllCustomRequests}
                className="w-max p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-colors text-slate-400 hover:text-white"
                title="Refresh"
              >
                <RefreshCw
                  size={20}
                  className={cn("size-4 md:size-5", {
                    "animate-spin": loadingCustom,
                  })}
                />
              </button>
            </div>

            {/* Custom Requests List */}
            <div className="space-y-6">
              {filteredCustomRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-6 lg:p-8 hover:bg-slate-800/40 transition-all flex flex-col lg:flex-row gap-8 justify-between"
                >
                  {/* Left: Product & Dropshipper Details */}
                  <div className="flex-1 space-y-5 md:space-y-6">
                    {/* Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-800 border border-slate-700/50 text-emerald-400 px-3 py-1.5 rounded-2xl text-[9px] md:text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
                          {customRequestTypeLabels[req.videoType] ||
                            req.videoType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(req.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div
                        className={`px-4 py-1.5 rounded-full text-[9px] md:text-xs font-semibold uppercase tracking-widest whitespace-nowrap ${statusColors[req.status] || "bg-slate-700 text-white"}`}
                      >
                        {req.status}
                      </div>
                    </div>

                    {/* Dual Info Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Dropshipper Info */}
                      <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                          <User size={15} /> Dropshipper
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100 text-base md:text-lg leading-tight">
                            {req.userId?.name || "Unknown Dropshipper"}
                          </p>
                          <p className="text-xs md:text-sm text-slate-400 mt-1 select-all">
                            {req.userId?.email}
                          </p>
                          {req.userId?.mobile && (
                            <p className="text-xs md:text-sm text-slate-400 mt-1 select-all">
                              {req.userId?.mobile}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                          <Video size={15} /> Target Product
                        </div>
                        <div className="flex items-center gap-4">
                          {req.productId?.images?.[0] ? (
                            <img
                              src={req.productId.images[0]}
                              alt={req.productId.productName}
                              className="w-12 h-12 object-cover rounded-2xl border border-white/10 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">
                              P
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-100 text-sm md:text-base line-clamp-2 leading-tight">
                              {req.productId?.productName || "Product Deleted"}
                            </p>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Price: ৳{req.productId?.price || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Requirements / Notes */}
                    {req.notes && (
                      <div className="bg-black/10 border border-white/5 rounded-3xl p-5">
                        <span className="text-[9px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                          CUSTOMER REQUIREMENTS & NOTES
                        </span>
                        <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed select-all">
                          {req.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Dispatch / Delivery Operations */}
                  <div className="lg:w-96 shrink-0 flex flex-col bg-black/10 border border-white/5 rounded-3xl p-5 md:p-6 lg:p-7 h-full">
                    <div className="space-y-5 flex-1">
                      <h4 className="text-xs md:text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <FileText size={16} /> Dispatch Controls
                      </h4>

                      {/* Delivered Video URL */}
                      <div>
                        <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
                          Delivered Video URL
                        </label>
                        <div className="relative">
                          <Link2
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            size={16}
                          />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/..."
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-xs md:text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600"
                            value={deliveredUrlInput[req._id] || ""}
                            onChange={(e) =>
                              setDeliveredUrlInput({
                                ...deliveredUrlInput,
                                [req._id]: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Admin Note */}
                      <div>
                        <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
                          Admin Note
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Add an admin response note..."
                          className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl p-4 text-xs md:text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-y min-h-[100px]"
                          value={adminNoteInput[req._id] || ""}
                          onChange={(e) =>
                            setAdminNoteInput({
                              ...adminNoteInput,
                              [req._id]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap items-center justify-evenly gap-3">
                      {[
                        ...(req.status === "completed"
                          ? [
                              {
                                label: "Open Delivered Video",
                                icon: ExternalLink,
                                onClick: () =>
                                  window.open(req.deliveredVideoUrl, "_blank"),
                                variant: "secondary",
                              },
                              {
                                label: "Update Delivery Info",
                                onClick: () =>
                                  triggerUpdateCustomRequest(
                                    req._id,
                                    "completed",
                                  ),
                                variant: "primary",
                                disabled: actionLoading,
                              },
                            ]
                          : [
                              ...(req.status === "pending"
                                ? [
                                    {
                                      label: "Approve / Process",
                                      onClick: () =>
                                        triggerUpdateCustomRequest(
                                          req._id,
                                          "approved",
                                        ),
                                      variant: "primary",
                                      disabled: actionLoading,
                                    },
                                  ]
                                : []),
                              {
                                label: "Reject Order",
                                onClick: () =>
                                  triggerUpdateCustomRequest(
                                    req._id,
                                    "rejected",
                                  ),
                                variant: "danger",
                                disabled: actionLoading,
                              },
                              {
                                label: "Deliver Custom Ad Video",
                                icon: Check,
                                onClick: () =>
                                  triggerUpdateCustomRequest(
                                    req._id,
                                    "completed",
                                  ),
                                variant: "primary",
                                disabled: actionLoading,
                              },
                            ]),
                      ].map((btn, index) => (
                        <button
                          key={index}
                          onClick={btn.onClick}
                          disabled={actionLoading || btn.disabled}
                          className={cn(
                            "whitespace-nowrap py-2.5 px-2 flex-1 w-max rounded-2xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2",
                            btn.variant === "primary" &&
                              "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5",
                            btn.variant === "secondary" &&
                              "bg-slate-900 hover:bg-slate-800 text-white border border-white/10",
                            btn.variant === "danger" &&
                              "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30",
                            btn.variant === "link" &&
                              "bg-slate-900 hover:bg-slate-800 text-white border border-white/10",
                          )}
                        >
                          {btn.icon && <btn.icon size={16} />}
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {filteredCustomRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-12 opacity-20">
                  <Film size={64} className="mb-4" />
                  <p className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                    No custom video orders found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>

      {/* Custom Confirmation Modal */}
      {actionConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden bg-slate-900/90 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Close Button */}
            <button 
              onClick={() => setActionConfirm(prev => ({ ...prev, show: false }))}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            {/* Warning Icon & Title */}
            <div className="flex flex-col items-center text-center mt-2 space-y-4">
              <div className={cn(
                "p-4 rounded-2xl",
                actionConfirm.status === "approved" || actionConfirm.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : actionConfirm.status === "rejected"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-amber-500/10 text-amber-400"
              )}>
                {actionConfirm.status === "approved" || actionConfirm.status === "completed" ? (
                  <Check size={28} />
                ) : actionConfirm.status === "rejected" ? (
                  <X size={28} />
                ) : (
                  <Clock size={28} />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                  Confirm Action
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium px-2">
                  {actionConfirm.message}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setActionConfirm(prev => ({ ...prev, show: false }))}
                className="flex-1 py-3 px-4 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-xs md:text-sm font-semibold transition-all hover:text-white text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 py-3 px-4 text-xs md:text-sm font-semibold text-white rounded-2xl transition-all shadow-lg",
                  actionConfirm.status === "approved" || actionConfirm.status === "completed"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20"
                    : actionConfirm.status === "rejected"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/20"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20"
                )}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoAccessManagement;
