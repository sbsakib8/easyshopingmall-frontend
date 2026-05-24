"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Check, 
    X, 
    Eye, 
    Clock, 
    User, 
    Phone, 
    Hash, 
    ExternalLink,
    AlertCircle,
    Search,
    Video,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    Film,
    FileText,
    Link2,
    RefreshCw,
    Download,
    DollarSign,
    CreditCard
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";

const statusColors = {
    pending: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25",
    approved: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25",
    completed: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
    rejected: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
};

const customRequestTypeLabels = {
    facebook_ad: "Facebook Ad Creative",
    tiktok_video: "TikTok Ad Video",
    youtube_short: "YouTube Short/Reel",
    unboxing: "Unboxing / UGC Video",
    other: "Custom / Special Video"
};

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

    const fetchAllRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${UrlBackend}/api/video-access/all`, {
                withCredentials: true
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
            const res = await axios.get(`${UrlBackend}/api/video-request/all`, {
                withCredentials: true
            });
            if (res.data.success) {
                setCustomRequests(res.data.data);
                // Pre-populate input states
                const delivered = {};
                const notes = {};
                res.data.data.forEach(req => {
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
        return requests.filter(req => {
            const matchesSearch = 
                req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.senderNumber?.includes(searchTerm) ||
                req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === "all" || req.status === filterStatus;
            
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, filterStatus]);

    // Filter custom video requests
    const filteredCustomRequests = useMemo(() => {
        return customRequests.filter(req => {
            const matchesSearch = 
                req.userId?.name?.toLowerCase().includes(customSearchTerm.toLowerCase()) ||
                req.userId?.email?.toLowerCase().includes(customSearchTerm.toLowerCase()) ||
                req.productId?.productName?.toLowerCase().includes(customSearchTerm.toLowerCase());
            
            const matchesStatus = customFilterStatus === "all" || req.status === customFilterStatus;
            
            return matchesSearch && matchesStatus;
        });
    }, [customRequests, customSearchTerm, customFilterStatus]);

    const stats = useMemo(() => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const approved = requests.filter(r => r.status === 'approved').length;
        const revenue = requests
            .filter(r => r.status === 'approved')
            .reduce((sum, r) => sum + (r.amount || 0), 0);
        return { total, pending, approved, revenue };
    }, [requests]);

    const customStats = useMemo(() => {
        const total = customRequests.length;
        const pending = customRequests.filter(r => r.status === 'pending').length;
        const completed = customRequests.filter(r => r.status === 'completed').length;
        return { total, pending, completed };
    }, [customRequests]);

    const handleUpdateStatus = async (requestId, status) => {
        const confirmMsg = status === "approved" 
            ? "Approve this payment and grant video access?" 
            : "Reject this payment request?";
            
        if (!window.confirm(confirmMsg)) return;

        setActionLoading(true);
        try {
            const res = await axios.patch(
                `${UrlBackend}/api/video-access/update/${requestId}`,
                { status, adminNote },
                { withCredentials: true }
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

    const handleUpdateCustomRequest = async (requestId, status) => {
        const note = adminNoteInput[requestId] || "";
        const deliveredUrl = deliveredUrlInput[requestId] || "";

        if (status === "completed" && !deliveredUrl) {
            toast.error("Delivered Video URL is required when marking completed!");
            return;
        }

        const confirmMsg = `Are you sure you want to mark this custom video request as ${status}?`;
        if (!window.confirm(confirmMsg)) return;

        setActionLoading(true);
        try {
            const res = await axios.patch(
                `${UrlBackend}/api/video-request/update/${requestId}`,
                { 
                    status, 
                    adminNote: note,
                    deliveredVideoUrl: deliveredUrl
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(`Custom video request ${status}! ✅`);
                fetchAllCustomRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update custom video request");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && requests.length === 0) return <DashboardLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header with Tab Switcher */}
                <div className="mb-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tight">Dropshipping <span className="text-emerald-400">Media</span> Admin</h1>
                        <p className="text-slate-400 font-medium">Verify premium access payments and dispatch custom high-converting ad videos.</p>
                    </div>
                    
                    {/* Tab Controller */}
                    <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex gap-2 relative z-10 self-start md:self-center">
                        <button 
                            onClick={() => setActiveTab("premium_access")}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === "premium_access" 
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <CreditCard size={14} /> Paid Video Payments
                        </button>
                        <button 
                            onClick={() => setActiveTab("custom_requests")}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === "custom_requests" 
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Film size={14} /> Custom Video Orders
                        </button>
                    </div>
                </div>

                {/* ========================================================
                    TAB 1: PREMIUM COURSE ACCESS VERIFICATION
                    ======================================================== */}
                {activeTab === "premium_access" && (
                    <div className="animate-in fade-in duration-300">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Total Requests", value: stats.total, icon: <Hash />, color: "emerald", prefix: "" },
                                { label: "Pending Approval", value: stats.pending, icon: <Clock />, color: "amber", prefix: "" },
                                { label: "Approved Users", value: stats.approved, icon: <ShieldCheck />, color: "teal", prefix: "" },
                                { label: "Total Revenue", value: stats.revenue.toLocaleString(), icon: <DollarSign />, color: "purple", prefix: "৳" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform`}>
                                            {stat.icon}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 text-right`}>{stat.label}</span>
                                    </div>
                                    <p className="text-3xl font-black">{stat.prefix}{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, email, TxID or sender number..."
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border shrink-0 ${
                                            filterStatus === status 
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Requests Table/Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredRequests.map((req) => (
                                <div key={req._id} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-6 hover:bg-slate-800/50 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                                    <User size={28} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-100 text-lg leading-tight">{req.userId?.name}</p>
                                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">{req.userId?.email}</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[req.status]}`}>
                                                {req.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Payment Method</p>
                                                <p className="text-sm font-black text-emerald-400 flex items-center gap-2">
                                                    <ArrowUpRight size={14} /> {req.paymentMethod}
                                                </p>
                                            </div>
                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Paid Amount</p>
                                                <p className="text-sm font-black text-white">৳{req.amount}</p>
                                            </div>
                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sender Number</p>
                                                <p className="text-sm font-black text-slate-200 flex items-center gap-2">
                                                    <Phone size={14} className="text-slate-500" /> {req.senderNumber}
                                                </p>
                                            </div>
                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Transaction ID</p>
                                                <p className="text-sm font-black text-slate-200 select-all cursor-copy flex items-center gap-2">
                                                    <Hash size={14} className="text-slate-500" /> {req.transactionId}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-6 bg-slate-900/50 p-3 rounded-xl w-fit">
                                            <Calendar size={14} />
                                            {new Date(req.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="space-y-4">
                                            <textarea 
                                                placeholder="Add a note (optional)..."
                                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500"
                                                value={adminNote}
                                                onChange={(e) => setAdminNote(e.target.value)}
                                            />
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => handleUpdateStatus(req._id, "approved")}
                                                    disabled={actionLoading}
                                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <Check size={18} /> Approve Access
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(req._id, "rejected")}
                                                    disabled={actionLoading}
                                                    className="w-14 bg-slate-900/50 text-red-500 hover:bg-red-500/10 py-4 rounded-2xl flex items-center justify-center transition-all border border-white/5 disabled:opacity-50"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {req.adminNote && (
                                        <div className="mt-4 p-4 bg-slate-900/50 rounded-2xl border-l-4 border-emerald-500">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Admin Note</p>
                                            <p className="text-xs text-slate-300 italic">"{req.adminNote}"</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredRequests.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-32 opacity-20">
                                <Search size={64} className="mb-4" />
                                <p className="text-2xl font-black uppercase tracking-widest">No access requests found</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: "Total Video Orders", value: customStats.total, icon: <Film />, color: "indigo" },
                                { label: "Pending Processing", value: customStats.pending, icon: <Clock />, color: "amber" },
                                { label: "Completed Ads Delivered", value: customStats.completed, icon: <Check />, color: "emerald" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform`}>
                                            {stat.icon}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500`}>{stat.label}</span>
                                    </div>
                                    <p className="text-4xl font-black">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Search by user name, email, or product name..."
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-bold"
                                    value={customSearchTerm}
                                    onChange={(e) => setCustomSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['all', 'pending', 'approved', 'completed', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setCustomFilterStatus(status)}
                                        className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border shrink-0 ${
                                            customFilterStatus === status 
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={fetchAllCustomRequests}
                                className="p-4 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-colors text-slate-400 hover:text-white"
                                title="Refresh"
                            >
                                <RefreshCw size={20} className={loadingCustom ? "animate-spin" : ""} />
                            </button>
                        </div>

                        {/* Custom Requests List */}
                        <div className="space-y-6">
                            {filteredCustomRequests.map((req) => (
                                <div key={req._id} className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-6 lg:p-8 hover:bg-slate-800/40 transition-all flex flex-col lg:flex-row gap-8 justify-between">
                                    
                                    {/* Left: Product & Dropshipper Details */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-slate-850 border border-slate-700/50 text-emerald-400 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                    {customRequestTypeLabels[req.videoType] || req.videoType}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold">
                                                    {new Date(req.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[req.status] || "bg-slate-700"}`}>
                                                {req.status}
                                            </div>
                                        </div>

                                        {/* Dual Block: User Info & Product Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            {/* User */}
                                            <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                                                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                                                    <User size={14} /> Dropshipper
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-100 text-base">{req.userId?.name || "Unknown Dropshipper"}</p>
                                                    <p className="text-xs text-slate-400 mt-1 select-all">{req.userId?.email}</p>
                                                    {req.userId?.mobile && (
                                                        <p className="text-xs text-slate-400 mt-1 select-all">{req.userId?.mobile}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product */}
                                            <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                                    <Video size={14} /> Target Product
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {req.productId?.images?.[0] ? (
                                                        <img 
                                                            src={req.productId.images[0]} 
                                                            alt={req.productId.productName} 
                                                            className="w-12 h-12 object-cover rounded-xl border border-white/10" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs">P</div>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-slate-100 text-sm line-clamp-1">{req.productId?.productName || "Product Deleted"}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Price: ৳{req.productId?.price || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Requirements */}
                                        {req.notes && (
                                            <div className="bg-black/10 border border-white/5 rounded-3xl p-5">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Customer Requirements & Notes</span>
                                                <p className="text-xs text-slate-300 font-medium leading-relaxed select-all">
                                                    {req.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Dispatch / Delivery Operations */}
                                    <div className="lg:w-96 shrink-0 flex flex-col justify-between bg-black/10 border border-white/5 rounded-[2rem] p-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                                <FileText size={14} /> Dispatch Controls
                                            </h4>

                                            {/* Delivered URL Input */}
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Delivered Video URL (Google Drive, Dropbox, YouTube, etc.)</label>
                                                <div className="relative">
                                                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                                    <input 
                                                        type="url"
                                                        placeholder="https://drive.google.com/..."
                                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500"
                                                        value={deliveredUrlInput[req._id] || ""}
                                                        onChange={(e) => setDeliveredUrlInput({
                                                            ...deliveredUrlInput,
                                                            [req._id]: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Admin Note Input */}
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Admin Note (Send message / rejection reason to dropshipper)</label>
                                                <textarea 
                                                    rows={3}
                                                    placeholder="Add an admin response note..."
                                                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-3 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-18"
                                                    value={adminNoteInput[req._id] || ""}
                                                    onChange={(e) => setAdminNoteInput({
                                                        ...adminNoteInput,
                                                        [req._id]: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Action buttons based on status */}
                                        <div className="mt-6 space-y-2">
                                            {req.status === "completed" ? (
                                                <div className="space-y-2">
                                                    <a 
                                                        href={req.deliveredVideoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full bg-slate-900 hover:bg-slate-850 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5"
                                                    >
                                                        <ExternalLink size={14} /> Open Delivered Video
                                                    </a>
                                                    <button 
                                                        onClick={() => handleUpdateCustomRequest(req._id, "completed")}
                                                        disabled={actionLoading}
                                                        className="w-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600 hover:to-teal-600 text-emerald-400 hover:text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Update Delivery Info
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {/* If pending, can approve to processing, or directly complete */}
                                                    <div className="flex gap-2">
                                                        {req.status === "pending" && (
                                                            <button 
                                                                onClick={() => handleUpdateCustomRequest(req._id, "approved")}
                                                                disabled={actionLoading}
                                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest"
                                                            >
                                                                Approve / Process
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleUpdateCustomRequest(req._id, "rejected")}
                                                            disabled={actionLoading}
                                                            className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/20"
                                                        >
                                                            Reject Order
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleUpdateCustomRequest(req._id, "completed")}
                                                        disabled={actionLoading}
                                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                                                    >
                                                        <Check size={16} /> Deliver Custom Ad Video
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredCustomRequests.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-32 opacity-20">
                                    <Film size={64} className="mb-4" />
                                    <p className="text-2xl font-black uppercase tracking-widest">No custom video orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoAccessManagement;
