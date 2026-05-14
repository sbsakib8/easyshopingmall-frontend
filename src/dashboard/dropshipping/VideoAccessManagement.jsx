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
    ArrowUpRight
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";

const statusColors = {
    pending: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25",
    approved: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
    rejected: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
};

const VideoAccessManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [actionLoading, setActionLoading] = useState(false);
    const [adminNote, setAdminNote] = useState("");

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

    useEffect(() => {
        fetchAllRequests();
    }, []);

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

    const stats = useMemo(() => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const approved = requests.filter(r => r.status === 'approved').length;
        return { total, pending, approved };
    }, [requests]);

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

    if (loading) return <DashboardLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-2">Video <span className="text-emerald-400">Access</span> Requests</h1>
                        <p className="text-slate-400 font-medium">Verify payments and grant access to premium training content.</p>
                    </div>
                    <Video size={150} className="absolute -right-10 -bottom-10 text-emerald-400/10 group-hover:rotate-12 transition-transform duration-700" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Total Requests", value: stats.total, icon: <Hash />, color: "emerald" },
                        { label: "Pending Approval", value: stats.pending, icon: <Clock />, color: "amber" },
                        { label: "Approved Users", value: stats.approved, icon: <ShieldCheck />, color: "teal" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 bg-${stat.color}-500/10 text-${stat.color}-400 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest text-${stat.color}-500/50`}>{stat.label}</span>
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
                        <p className="text-2xl font-black uppercase tracking-widest">No requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoAccessManagement;
