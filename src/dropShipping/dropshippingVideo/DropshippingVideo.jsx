"use client";
import React, { useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import {
    Play, Lock, CheckCircle, Clock, XCircle, ShieldCheck, CreditCard,
    Info, Youtube, Star, Video, ArrowRight, Layout, Search, Sparkles,
    Film, Send, History, Check, ExternalLink, AlertCircle, RefreshCw,
    Download, ArrowLeft, Crown, Zap, ChevronRight
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UrlBackend } from "@/src/confic/urlExport";
import { useGetUser } from "@/src/utlis/useGetuser";
import { ProductAllGet } from "@/src/hook/useProduct";

// ─── Helper: YouTube ID Extractor ────────────────────────────────────────────
const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// ─── Helper: Video Card ──────────────────────────────────────────────────────
const VideoCard = ({ video }) => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
        <div className="relative aspect-video bg-gray-900">
            <iframe
                src={getYoutubeEmbedUrl(video.url)}
                title={video.title}
                width="100%"
                height="100%"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
        <div className="p-5 flex flex-col gap-1 flex-grow">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1">{video.title}</h3>
            {video.description && (
                <p className="text-xs font-medium text-gray-400 line-clamp-2">{video.description}</p>
            )}
        </div>
    </div>
);

// ─── Helper: Empty State ──────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
        <Icon size={56} className="mb-4" />
        <p className="text-lg font-black uppercase tracking-widest">{title}</p>
        {subtitle && <p className="text-xs font-bold mt-1 text-gray-500">{subtitle}</p>}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DropshippingVideo = () => {
    const { user } = useGetUser();

    // ── Tab & Module state ─────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState("academy");   // "academy" | "requests"
    const [moduleView, setModuleView] = useState(null);       // null | "free" | "paid"

    // ── Data state ─────────────────────────────────────────────────────────
    const [accessRequests, setAccessRequests] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ── Custom request state ───────────────────────────────────────────────
    const [myRequests, setMyRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [requestSubmitLoading, setRequestSubmitLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [newRequestData, setNewRequestData] = useState({
        productId: "", productName: "", productImage: "",
        videoType: "facebook_ad", notes: ""
    });

    // ── Payment form state ─────────────────────────────────────────────────
    const [paymentData, setPaymentData] = useState({
        paymentMethod: "Bkash", transactionId: "", senderNumber: "", amount: 500
    });

    // ── Fetch ──────────────────────────────────────────────────────────────
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch videos independently so demo always loads even if auth fails
            const [accessResult, videosResult] = await Promise.allSettled([
                axios.get(`${UrlBackend}/video-access/my-access`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-content/all`)
            ]);

            if (accessResult.status === "fulfilled" && accessResult.value.data.success) {
                setAccessRequests(accessResult.value.data.data);
            }
            if (videosResult.status === "fulfilled" && videosResult.value.data.success) {
                setVideos(videosResult.value.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await axios.get(`${UrlBackend}/video-request/my-requests`, { withCredentials: true });
            if (res.data.success) setMyRequests(res.data.data);
        } catch (error) {
            console.error("Failed to fetch video requests", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await ProductAllGet({ limit: 150 });
            if (res.success) setProducts(res.data || res.products || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRequests();
        fetchProducts();
    }, []);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${UrlBackend}/video-access/create`, {
                ...paymentData,
                videoType: "premium_training"
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Payment submitted! Waiting for admin approval.");
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit payment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitCustomRequest = async (e) => {
        e.preventDefault();
        if (!newRequestData.productId) {
            toast.error("Please select a product from the list");
            return;
        }
        setRequestSubmitLoading(true);
        try {
            const res = await axios.post(`${UrlBackend}/video-request/create`, {
                productId: newRequestData.productId,
                videoType: newRequestData.videoType,
                notes: newRequestData.notes
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Ad creative request submitted! 🎬");
                setNewRequestData({ productId: "", productName: "", productImage: "", videoType: "facebook_ad", notes: "" });
                setProductSearch("");
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setRequestSubmitLoading(false);
        }
    };

    // ── Derived data ───────────────────────────────────────────────────────
    const premiumStatus = accessRequests.find(req => req.videoType === "premium_training")?.status || "none";
    const demoVideo = videos.find(v => v.videoType === "demo");
    const freeVideos = videos.filter(v => v.videoType === "free");
    const premiumVideos = videos.filter(v => v.videoType === "premium");

    const filteredProducts = useMemo(() => {
        if (!productSearch) return products.slice(0, 10);
        return products.filter(p =>
            p.productName?.toLowerCase().includes(productSearch.toLowerCase())
        ).slice(0, 10);
    }, [products, productSearch]);

    const customRequestTypeLabels = {
        facebook_ad: "Facebook Ad Creative",
        tiktok_video: "TikTok Ad Video",
        youtube_short: "YouTube Short/Reel",
        unboxing: "Unboxing / UGC Video",
        other: "Custom / Special Video"
    };

    // ── Loading state ─────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Video Hub...</p>
            </div>
        </div>
    );

    // ════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-slate-50/30 py-8 lg:py-12">
            <div className="container mx-auto px-4 lg:px-12">

                {/* ── PAGE HEADER ── */}
                <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 lg:p-12 border border-slate-700/30 shadow-2xl overflow-hidden mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Glow blobs */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500 rounded-full blur-[80px] -ml-20 -mb-20" />
                    </div>

                    <div className="relative z-10">
                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
                            <Sparkles size={12} className="animate-pulse" /> Growth Academy & Creative Hub
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase mb-2">Video Resources Center</h2>
                        <p className="text-slate-400 font-medium italic text-sm">Learn dropshipping strategies and request custom-tailored video ads.</p>
                    </div>

                    {/* Tab switcher */}
                    <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex gap-2 relative z-10 self-start md:self-center">
                        <button
                            onClick={() => { setActiveTab("academy"); setModuleView(null); }}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "academy" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                        >
                            <Youtube size={14} /> Training Academy
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "requests" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                        >
                            <Film size={14} /> Order Custom Video
                        </button>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════════
                    TAB 1: TRAINING ACADEMY
                    ════════════════════════════════════════════════════════════ */}
                {activeTab === "academy" && (
                    <div className="animate-in fade-in duration-300">

                        {/* ── STAGE 1: LANDING (demo video + Free/Paid cards) ── */}
                        {moduleView === null && (
                            <div className="space-y-10">

                                {/* Demo Video */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden">
                                    <div className="p-6 pb-0 flex items-center gap-3">
                                        <div className="p-2.5 bg-red-50 rounded-2xl">
                                            <Youtube className="text-red-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Featured Demo</p>
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                                                {demoVideo?.title || "Welcome to Dropshipping Academy"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="relative aspect-video mt-5 bg-gray-900">
                                        {demoVideo ? (
                                            <iframe
                                                src={getYoutubeEmbedUrl(demoVideo.url)}
                                                title={demoVideo.title}
                                                width="100%"
                                                height="100%"
                                                className="absolute top-0 left-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                <Video size={48} className="mb-3 opacity-30" />
                                                <p className="text-xs font-black uppercase tracking-widest opacity-50">Demo video will appear here</p>
                                            </div>
                                        )}
                                    </div>
                                    {demoVideo?.description && (
                                        <p className="px-6 py-4 text-sm text-gray-500 font-medium">{demoVideo.description}</p>
                                    )}
                                </div>

                                {/* Choose Your Path */}
                                <div className="text-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Choose Your Learning Path</span>
                                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight mt-2">Select a Module</h2>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Access free strategies or unlock the full premium masterclass</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* ── FREE CARD ── */}
                                    <button
                                        onClick={() => setModuleView("free")}
                                        className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-[2.5rem] p-8 lg:p-10 text-left overflow-hidden hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Glow */}
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-300 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />

                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                                <Zap className="text-white" size={28} />
                                            </div>

                                            <div className="mb-2 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                <Check size={10} /> Free Access
                                            </div>

                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-3 mb-2">Free Module</h3>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                                                Get started with our curated free dropshipping strategy videos. No payment required.
                                            </p>

                                            <ul className="space-y-2 mb-8">
                                                {["Beginner-friendly lessons", "Core dropshipping strategies", "Instant access, no payment"].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-emerald-800">
                                                        <CheckCircle size={14} className="text-emerald-500 shrink-0" /> {item}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex items-center gap-2 font-black text-emerald-700 text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                                Watch Free Videos <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* ── PAID CARD ── */}
                                    <button
                                        onClick={() => setModuleView("paid")}
                                        className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-[2.5rem] p-8 lg:p-10 text-left overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Glow */}
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />

                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-purple-600/30 group-hover:scale-110 transition-transform">
                                                <Crown className="text-white" size={28} />
                                            </div>

                                            <div className="mb-2 inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-500/30">
                                                <Crown size={10} /> Premium Access · ৳500
                                            </div>

                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-3 mb-2">Paid Module</h3>
                                            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                                                Unlock the full masterclass with advanced techniques, live case studies & expert strategies.
                                            </p>

                                            <ul className="space-y-2 mb-8">
                                                {["Advanced expert masterclasses", "Live case study breakdowns", "Lifetime access after one payment"].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-300">
                                                        <ShieldCheck size={14} className="text-purple-400 shrink-0" /> {item}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex items-center gap-2 font-black text-purple-400 text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                                {premiumStatus === "approved" ? "Watch Premium Videos" : "Unlock Now"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </button>

                                </div>
                            </div>
                        )}

                        {/* ── STAGE 2A: FREE MODULE ── */}
                        {moduleView === "free" && (
                            <div className="animate-in fade-in duration-300 space-y-8">
                                {/* Back + header */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setModuleView(null)}
                                        className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-emerald-400 transition-all text-gray-600 hover:text-emerald-600"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Training Academy</p>
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Free Module</h2>
                                    </div>
                                    <div className="ml-auto bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Zap size={12} /> Free Access
                                    </div>
                                </div>

                                {freeVideos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {freeVideos.map(video => (
                                            <VideoCard key={video._id} video={video} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState icon={Video} title="Free videos coming soon" subtitle="Check back later for free training content" />
                                )}
                            </div>
                        )}

                        {/* ── STAGE 2B: PAID MODULE ── */}
                        {moduleView === "paid" && (
                            <div className="animate-in fade-in duration-300 space-y-8">

                                {/* Back + header */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setModuleView(null)}
                                        className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-purple-400 transition-all text-gray-600 hover:text-purple-600"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Training Academy</p>
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Paid Module</h2>
                                    </div>
                                    <div className={`ml-auto px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                        premiumStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                                        premiumStatus === "pending" ? "bg-amber-100 text-amber-700" :
                                        premiumStatus === "rejected" ? "bg-red-100 text-red-700" :
                                        "bg-purple-100 text-purple-700"
                                    }`}>
                                        <Crown size={12} />
                                        {premiumStatus === "approved" ? "Access Granted" :
                                         premiumStatus === "pending" ? "Payment Pending" :
                                         premiumStatus === "rejected" ? "Payment Rejected" : "Premium · ৳500"}
                                    </div>
                                </div>

                                {/* ── APPROVED: Show premium videos ── */}
                                {premiumStatus === "approved" && (
                                    <>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500 rounded-2xl">
                                                <ShieldCheck className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-emerald-800 text-sm uppercase tracking-wide">Full Access Granted</p>
                                                <p className="text-xs text-emerald-600 font-medium">You have lifetime access to all premium training content.</p>
                                            </div>
                                        </div>

                                        {premiumVideos.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {premiumVideos.map(video => (
                                                    <VideoCard key={video._id} video={video} />
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState icon={Crown} title="Premium videos coming soon" subtitle="Your access is ready. Content will appear here shortly." />
                                        )}
                                    </>
                                )}

                                {/* ── PENDING: Waiting for approval ── */}
                                {premiumStatus === "pending" && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-amber-100 shadow-lg">
                                        <div className="w-20 h-20 bg-amber-50 border-4 border-amber-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                            <Clock className="text-amber-500" size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Payment Under Review</h3>
                                        <p className="text-gray-500 font-medium text-sm max-w-md mb-6">
                                            Your payment has been submitted and is being reviewed by our team. This usually takes a few hours.
                                        </p>
                                        <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-widest bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200">
                                            <AlertCircle size={14} /> We'll notify you once approved
                                        </div>
                                        <button onClick={fetchData} className="mt-6 flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
                                            <RefreshCw size={14} /> Refresh Status
                                        </button>
                                    </div>
                                )}

                                {/* ── REJECTED: Show rejection + retry form ── */}
                                {premiumStatus === "rejected" && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Rejection notice */}
                                        <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <XCircle className="text-red-500" size={28} />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Payment Rejected</h3>
                                            <p className="text-sm text-gray-600 font-medium mb-4">
                                                Your previous payment could not be verified. Please try submitting again with valid transaction details.
                                            </p>
                                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold">
                                                Common reasons: wrong TxID, incorrect amount, or unverifiable sender number.
                                            </div>
                                        </div>
                                        {/* Payment form */}
                                        <PaymentForm
                                            paymentData={paymentData}
                                            setPaymentData={setPaymentData}
                                            onSubmit={handleSubmitPayment}
                                            submitting={submitting}
                                            title="Try Again"
                                        />
                                    </div>
                                )}

                                {/* ── NONE: Show payment form ── */}
                                {premiumStatus === "none" && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                        {/* Benefits panel */}
                                        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 overflow-hidden text-white border border-slate-700">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full blur-[80px] opacity-10" />
                                            <div className="relative z-10">
                                                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                                                    <Crown size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Unlock Premium</h3>
                                                <p className="text-3xl font-black text-purple-400 mb-6">৳500 <span className="text-sm font-bold text-slate-400">one-time</span></p>
                                                <ul className="space-y-3 mb-8">
                                                    {[
                                                        "Expert-level masterclass videos",
                                                        "Advanced sourcing & scaling tactics",
                                                        "Live case studies from top earners",
                                                        "Lifetime access, no renewals",
                                                        "Priority support from admin"
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                                            <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                                <Check size={10} className="text-purple-400" />
                                                            </div>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 font-medium leading-relaxed">
                                                    <span className="block font-black text-slate-200 mb-1">📱 Payment Instructions</span>
                                                    Send <strong className="text-white">৳500</strong> via Bkash/Nagad to our number, then enter the transaction details in the form.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment form */}
                                        <PaymentForm
                                            paymentData={paymentData}
                                            setPaymentData={setPaymentData}
                                            onSubmit={handleSubmitPayment}
                                            submitting={submitting}
                                            title="Submit Payment"
                                        />
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    TAB 2: ORDER CUSTOM VIDEO
                    ════════════════════════════════════════════════════════════ */}
                {activeTab === "requests" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">

                        {/* LEFT: Submission Form */}
                        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Sparkles className="animate-spin" style={{ animationDuration: "3s" }} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Custom Ads</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scale your sales with unique creatives</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 mb-6 text-xs text-slate-600 leading-relaxed font-medium">
                                <span className="font-black text-slate-800 uppercase block mb-1">💡 Professional BD Dropshipping standard</span>
                                Get high-converting product videos made by our media experts tailored for your targeted ad campaigns. Direct download link delivered below!
                            </div>

                            <form onSubmit={handleSubmitCustomRequest} className="space-y-5">
                                {/* Searchable Product Dropdown */}
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Select Product *</label>

                                    {newRequestData.productId ? (
                                        <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3">
                                            <div className="flex items-center gap-3">
                                                {newRequestData.productImage ? (
                                                    <img src={newRequestData.productImage} alt={newRequestData.productName} className="w-10 h-10 object-cover rounded-xl border border-emerald-100" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">P</div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 line-clamp-1">{newRequestData.productName}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Selected</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setNewRequestData(prev => ({ ...prev, productId: "", productName: "", productImage: "" }))}
                                                className="text-xs text-gray-400 hover:text-red-500 font-black uppercase tracking-widest p-1 px-2.5 rounded-lg hover:bg-red-50">
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Search product name..."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={productSearch}
                                                    onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); }}
                                                    onFocus={() => setShowProductDropdown(true)}
                                                />
                                            </div>
                                            {showProductDropdown && (
                                                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                                                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                                        <div key={p._id}
                                                            onClick={() => { setNewRequestData(prev => ({ ...prev, productId: p._id, productName: p.productName, productImage: p.images?.[0] || "" })); setShowProductDropdown(false); }}
                                                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                                            {p.images?.[0] ? (
                                                                <img src={p.images[0]} alt={p.productName} className="w-8 h-8 object-cover rounded-lg border" />
                                                            ) : (
                                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">P</div>
                                                            )}
                                                            <span className="text-xs font-bold text-gray-800 line-clamp-1">{p.productName}</span>
                                                        </div>
                                                    )) : (
                                                        <p className="text-xs font-bold text-center text-gray-400 p-4">No products matching your search</p>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Video Type */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Video Ad Type *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(customRequestTypeLabels).map(([val, label]) => (
                                            <div key={val} onClick={() => setNewRequestData(prev => ({ ...prev, videoType: val }))}
                                                className={`p-3 border rounded-2xl cursor-pointer text-center transition-all ${newRequestData.videoType === val ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"}`}>
                                                <p className="text-xs font-black text-gray-800">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Requirements / Custom Notes</label>
                                    <textarea rows={4}
                                        placeholder="Examples: Provide Bangla voiceover; Highlight product key features; Keep it under 30 seconds..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 h-28 resize-none"
                                        value={newRequestData.notes}
                                        onChange={(e) => setNewRequestData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>

                                <button type="submit" disabled={requestSubmitLoading}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                                    {requestSubmitLoading ? <><RefreshCw className="animate-spin" size={16} /> Submitting...</> : <><Send size={16} /> Submit Video Request</>}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: History */}
                        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm flex flex-col h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><History /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Request History</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Track and download your delivered videos</p>
                                    </div>
                                </div>
                                <button onClick={fetchRequests} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600" title="Refresh">
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            {loadingRequests ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading requests...</p>
                                </div>
                            ) : myRequests.length === 0 ? (
                                <div className="flex-1 border border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
                                    <Video size={40} className="text-slate-300 mb-3" />
                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">No requests made yet</h4>
                                    <p className="text-xs text-slate-400 font-medium max-w-xs mt-1.5">Your requested custom video creatives will show up here. Make your first request today!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                                    {myRequests.map((req) => (
                                        <div key={req._id} className={`p-5 rounded-3xl border transition-all ${req.status === "completed" ? "border-emerald-100 bg-emerald-50/10 hover:border-emerald-200" : req.status === "rejected" ? "border-red-100 bg-red-50/10 hover:border-red-200" : "border-slate-100 hover:border-slate-200"}`}>
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <div className="flex items-start gap-4">
                                                    {req.productId?.images?.[0] ? (
                                                        <img src={req.productId.images[0]} alt={req.productId.productName} className="w-12 h-12 object-cover rounded-2xl border" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-xs">P</div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 line-clamp-1">{req.productId?.productName || "Deleted Product"}</h4>
                                                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                                {customRequestTypeLabels[req.videoType] || req.videoType}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 self-start ${req.status === "completed" ? "bg-emerald-100 text-emerald-700" : req.status === "approved" ? "bg-blue-100 text-blue-700" : req.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                    {req.status === "pending" ? <Clock size={12} /> : req.status === "approved" ? <CheckCircle size={12} /> : req.status === "completed" ? <Check size={12} /> : <XCircle size={12} />}
                                                    {req.status}
                                                </div>
                                            </div>

                                            {req.notes && (
                                                <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-3 text-xs text-gray-600 font-medium">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">My Requirements:</span>
                                                    {req.notes}
                                                </div>
                                            )}
                                            {req.adminNote && (
                                                <div className="bg-amber-50/50 border border-amber-100 text-amber-800 rounded-2xl p-3 mb-3 text-xs font-medium flex items-start gap-2">
                                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Admin Note:</span>
                                                        {req.adminNote}
                                                    </div>
                                                </div>
                                            )}
                                            {req.status === "completed" && req.deliveredVideoUrl && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-700">
                                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                                        Ready for download & deployment
                                                    </div>
                                                    <a href={req.deliveredVideoUrl} target="_blank" rel="noopener noreferrer"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md shadow-emerald-100 hover:scale-105">
                                                        <Download size={12} /> Download Video
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// ─── Payment Form Sub-component ───────────────────────────────────────────────
const PaymentForm = ({ paymentData, setPaymentData, onSubmit, submitting, title = "Submit Payment" }) => (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="text-emerald-600" size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h3>
                <p className="text-xs text-gray-400 font-bold mt-0.5">Enter your Bkash / Nagad transaction details</p>
            </div>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 mb-8">
            <div className="flex items-center gap-2 mb-1.5">
                <Info className="text-emerald-600 w-4 h-4" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Payment Instructions</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                Please send <span className="font-black">৳500</span> (Send Money) to our Bkash/Nagad number. Then enter the transaction details below.
            </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Sender Number</label>
                <input type="text" required placeholder="017XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentData.senderNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, senderNumber: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Transaction ID</label>
                <input type="text" required placeholder="TRX123456789"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                />
            </div>

            <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                {submitting ? <><RefreshCw className="animate-spin" size={16} /> Submitting...</> : <><ShieldCheck size={16} /> {title}</>}
            </button>
        </form>
    </div>
);

export default DropshippingVideo;
