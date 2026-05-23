"use client";
import React, { useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { 
    Play, Lock, CheckCircle, Clock, XCircle, ShieldCheck, CreditCard, 
    Info, Youtube, Star, Video, ArrowRight, Layout, Search, Sparkles,
    Film, Send, History, Check, ExternalLink, AlertCircle, RefreshCw, Eye, Download
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UrlBackend } from "@/src/confic/urlExport";
import { useGetUser } from "@/src/utlis/useGetuser";
import { ProductAllGet } from "@/src/hook/useProduct";

const DropshippingVideo = () => {
    const { user } = useGetUser();
    const [activeTab, setActiveTab] = useState("academy"); // "academy" or "requests"
    const [accessRequests, setAccessRequests] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Custom Video Request states
    const [myRequests, setMyRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [requestSubmitLoading, setRequestSubmitLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [newRequestData, setNewRequestData] = useState({
        productId: "",
        productName: "",
        productImage: "",
        videoType: "facebook_ad",
        notes: ""
    });

    // Form state for Premium Access
    const [paymentData, setPaymentData] = useState({
        paymentMethod: "Bkash",
        transactionId: "",
        senderNumber: "",
        amount: 500
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [accessRes, videosRes] = await Promise.all([
                axios.get(`${UrlBackend}/api/video-access/my-access`, { withCredentials: true }),
                axios.get(`${UrlBackend}/api/video-content/all`)
            ]);
            
            if (accessRes.data.success) {
                setAccessRequests(accessRes.data.data);
            }
            if (videosRes.data.success) {
                setVideos(videosRes.data.data);
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
            const res = await axios.get(`${UrlBackend}/api/video-request/my-requests`, { withCredentials: true });
            if (res.data.success) {
                setMyRequests(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch video requests", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await ProductAllGet({ limit: 150 });
            if (res.success) {
                setProducts(res.data || res.products || []);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRequests();
        fetchProducts();
    }, []);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${UrlBackend}/api/video-access/create`, {
                ...paymentData,
                videoType: "premium_training"
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Request submitted successfully!");
                setIsModalOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
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
            const res = await axios.post(`${UrlBackend}/api/video-request/create`, {
                productId: newRequestData.productId,
                videoType: newRequestData.videoType,
                notes: newRequestData.notes
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Ad creative request submitted! 🎬");
                setNewRequestData({
                    productId: "",
                    productName: "",
                    productImage: "",
                    videoType: "facebook_ad",
                    notes: ""
                });
                setProductSearch("");
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setRequestSubmitLoading(false);
        }
    };

    const premiumStatus = accessRequests.find(req => req.videoType === "premium_training")?.status || "none";

    const typeIcons = {
        standard: <Layout className="text-emerald-500" />,
        demo: <Youtube className="text-red-500" />,
        free: <Star className="text-amber-500" />,
        premium: <ShieldCheck className="text-purple-500" />
    };

    const customRequestTypeLabels = {
        facebook_ad: "Facebook Ad Creative",
        tiktok_video: "TikTok Ad Video",
        youtube_short: "YouTube Short/Reel",
        unboxing: "Unboxing / UGC Video",
        other: "Custom / Special Video"
    };

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!productSearch) return products.slice(0, 10);
        return products.filter(p => 
            p.productName?.toLowerCase().includes(productSearch.toLowerCase())
        ).slice(0, 10);
    }, [products, productSearch]);

    const VideoCard = ({ video }) => {
        const isLocked = video.videoType === "premium" && premiumStatus !== "approved";
        
        return (
            <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                            {typeIcons[video.videoType] || <Video />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{video.title}</h3>
                            <p className="text-xs font-bold text-gray-400 line-clamp-1">{video.description}</p>
                        </div>
                    </div>
                    {video.videoType === "premium" && (
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                            premiumStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                            premiumStatus === 'pending' ? 'bg-amber-100 text-amber-600' :
                            premiumStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-purple-100 text-purple-600'
                        }`}>
                            {premiumStatus === 'none' ? 'Premium' : premiumStatus}
                        </div>
                    )}
                </div>

                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-900 border border-gray-100 shadow-inner mt-auto">
                    {isLocked ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-md z-10 text-center px-6">
                            <div className="p-4 bg-white/10 rounded-full mb-4">
                                <Lock className="text-white w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Premium Content Locked</h4>
                            {premiumStatus === 'pending' ? (
                                <p className="text-amber-400 text-xs font-bold">Your payment is being verified by admin.</p>
                            ) : premiumStatus === 'rejected' ? (
                                <div className="space-y-3">
                                    <p className="text-red-400 text-xs font-bold">Your previous request was rejected.</p>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    Unlock Now <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            controls
                            light={true}
                            playIcon={
                                <div className="p-4 bg-emerald-600 rounded-full shadow-xl shadow-emerald-600/30">
                                    <Play className="text-white fill-current" />
                                </div>
                            }
                        />
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Video Hub...</p>
            </div>
        </div>
    );

    // Group videos by row
    const row1 = videos.filter(v => v.videoType === 'standard' || v.videoType === 'demo').slice(0, 2);
    const row2 = videos.filter(v => v.videoType === 'free' || v.videoType === 'premium').slice(0, 2);
    const otherVideos = videos.filter(v => ![...row1, ...row2].some(rv => rv._id === v._id));

    return (
        <div className="min-h-screen bg-slate-50/30 py-8 lg:py-12">
            <div className="container mx-auto px-4 lg:px-12">
                
                {/* Stunning Premium Header */}
                <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 lg:p-12 border border-slate-700/30 shadow-2xl overflow-hidden mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500 rounded-full blur-[80px] -ml-20 -mb-20"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
                            <Sparkles size={12} className="animate-pulse" /> Growth Academy & Creative Hub
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase mb-2">Video Resources Center</h2>
                        <p className="text-slate-400 font-medium italic text-sm">Boost your dropshipping margins with masterclasses and custom-tailored video advertisements.</p>
                    </div>

                    {/* Tab Switcher inside Header */}
                    <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex gap-2 relative z-10 self-start md:self-center">
                        <button 
                            onClick={() => setActiveTab("academy")}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === "academy" 
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Youtube size={14} /> Training Academy
                        </button>
                        <button 
                            onClick={() => setActiveTab("requests")}
                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === "requests" 
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Film size={14} /> Order Custom Video
                        </button>
                    </div>
                </div>

                {/* TAB 1: ACADEMY (Videos) */}
                {activeTab === "academy" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* First Row (Standard & Demo) */}
                        {row1.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {row1.map(video => <VideoCard key={video._id} video={video} />)}
                            </div>
                        )}

                        {/* Second Row (Free & Premium) */}
                        {row2.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {row2.map(video => <VideoCard key={video._id} video={video} />)}
                            </div>
                        )}

                        {/* Others */}
                        {otherVideos.length > 0 && (
                            <div className="mt-16">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-6 ml-2">Previously Shown & Extra Content</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherVideos.map(video => <VideoCard key={video._id} video={video} />)}
                                </div>
                            </div>
                        )}

                        {videos.length === 0 && (
                            <div className="text-center py-20 opacity-30">
                                <Video size={64} className="mx-auto mb-4" />
                                <p className="text-xl font-black uppercase tracking-widest">No academy videos found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: CUSTOM VIDEO AD REQUESTS */}
                {activeTab === "requests" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        
                        {/* LEFT: Submission Form */}
                        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Sparkles className="animate-spin duration-3000" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Custom Ads</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scale your sales with unique creatives</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 mb-6 text-xs text-slate-600 leading-relaxed font-medium">
                                <span className="font-black text-slate-800 uppercase block mb-1">💡 Professional BD Dropshipping standard</span>
                                Get high-converting product videos made by our media experts tailored for your targeted ad campaigns. Direct link to download will be delivered below!
                            </div>

                            <form onSubmit={handleSubmitCustomRequest} className="space-y-5">
                                {/* Searchable Product Dropdown */}
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Select Product *</label>
                                    
                                    {newRequestData.productId ? (
                                        <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3">
                                            <div className="flex items-center gap-3">
                                                {newRequestData.productImage ? (
                                                    <img 
                                                        src={newRequestData.productImage} 
                                                        alt={newRequestData.productName} 
                                                        className="w-10 h-10 object-cover rounded-xl border border-emerald-100" 
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">P</div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 line-clamp-1">{newRequestData.productName}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Selected</p>
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setNewRequestData(prev => ({...prev, productId: "", productName: "", productImage: ""}))}
                                                className="text-xs text-gray-400 hover:text-red-500 font-black uppercase tracking-widest p-1 px-2.5 rounded-lg hover:bg-red-50"
                                            >
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
                                                    onChange={(e) => {
                                                        setProductSearch(e.target.value);
                                                        setShowProductDropdown(true);
                                                    }}
                                                    onFocus={() => setShowProductDropdown(true)}
                                                />
                                            </div>

                                            {showProductDropdown && (
                                                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                                                    {filteredProducts.length > 0 ? (
                                                        filteredProducts.map(p => (
                                                            <div 
                                                                key={p._id}
                                                                onClick={() => {
                                                                    setNewRequestData(prev => ({
                                                                        ...prev,
                                                                        productId: p._id,
                                                                        productName: p.productName,
                                                                        productImage: p.images?.[0] || ""
                                                                    }));
                                                                    setShowProductDropdown(false);
                                                                }}
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                                            >
                                                                {p.images?.[0] ? (
                                                                    <img 
                                                                        src={p.images[0]} 
                                                                        alt={p.productName} 
                                                                        className="w-8 h-8 object-cover rounded-lg border" 
                                                                    />
                                                                ) : (
                                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">P</div>
                                                                )}
                                                                <span className="text-xs font-bold text-gray-800 line-clamp-1">{p.productName}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs font-bold text-center text-gray-400 p-4">No products matching your search</p>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Video Type Selection */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Video Ad Type *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(customRequestTypeLabels).map(([val, label]) => (
                                            <div 
                                                key={val}
                                                onClick={() => setNewRequestData(prev => ({...prev, videoType: val}))}
                                                className={`p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                                                    newRequestData.videoType === val 
                                                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20" 
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <p className="text-xs font-black text-gray-800">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes / Custom Instructions */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Requirements / Custom Notes</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Examples: Provide Bangla voiceover; Highlight product key features; Keep it under 30 seconds; Show product utility..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 h-28 resize-none"
                                        value={newRequestData.notes}
                                        onChange={(e) => setNewRequestData(prev => ({...prev, notes: e.target.value}))}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={requestSubmitLoading}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {requestSubmitLoading ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={16} /> Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> Submit Video Request
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: History List */}
                        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm flex flex-col h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                        <History />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Request History</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Track and download your delivered videos</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={fetchRequests}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Refresh List"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            {loadingRequests ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2"></div>
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
                                        <div 
                                            key={req._id}
                                            className={`p-5 rounded-3xl border transition-all ${
                                                req.status === 'completed' ? 'border-emerald-100 bg-emerald-50/10 hover:border-emerald-200' :
                                                req.status === 'rejected' ? 'border-red-100 bg-red-50/10 hover:border-red-200' :
                                                'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <div className="flex items-start gap-4">
                                                    {req.productId?.images?.[0] ? (
                                                        <img 
                                                            src={req.productId.images[0]} 
                                                            alt={req.productId.productName} 
                                                            className="w-12 h-12 object-cover rounded-2xl border" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-xs">P</div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 line-clamp-1">{req.productId?.productName || "Deleted Product"}</h4>
                                                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                                {customRequestTypeLabels[req.videoType] || req.videoType}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold">
                                                                {new Date(req.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 self-start ${
                                                    req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                    req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {req.status === 'pending' ? <Clock size={12} /> :
                                                     req.status === 'approved' ? <CheckCircle size={12} /> :
                                                     req.status === 'completed' ? <Check size={12} /> :
                                                     <XCircle size={12} />}
                                                    {req.status}
                                                </div>
                                            </div>

                                            {req.notes && (
                                                <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-3 text-xs text-gray-600 font-medium">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">My Requirements:</span>
                                                    {req.notes}
                                                </div>
                                            )}

                                            {/* Admin feedback or Note */}
                                            {req.adminNote && (
                                                <div className="bg-amber-50/50 border border-amber-100 text-amber-800 rounded-2xl p-3 mb-3 text-xs font-medium flex items-start gap-2">
                                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Admin Note:</span>
                                                        {req.adminNote}
                                                    </div>
                                                </div>
                                            )}

                                            {/* DELIVERED AD VIDEO */}
                                            {req.status === 'completed' && req.deliveredVideoUrl && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-700">
                                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                                                        Ready for download & deployment
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a 
                                                            href={req.deliveredVideoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md shadow-emerald-100 hover:scale-105"
                                                        >
                                                            <Download size={12} /> Download Video
                                                        </a>
                                                    </div>
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

            {/* Payment Modal for Premium Course */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XCircle className="text-gray-400" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="text-emerald-600 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Unlock Premium</h3>
                            <p className="text-gray-400 text-sm font-bold mt-1">Get lifetime access to elite training</p>
                        </div>

                        <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Info className="text-emerald-600 w-4 h-4" />
                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Payment Instructions</span>
                            </div>
                            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                Please send <span className="font-black">৳500</span> (Send Money) to our Bkash/Nagad number. Then provide the transaction details below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={paymentData.paymentMethod}
                                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                                >
                                    <option value="Bkash">Bkash</option>
                                    <option value="Nagad">Nagad</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Sender Number</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="017XXXXXXXX"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={paymentData.senderNumber}
                                    onChange={(e) => setPaymentData({...paymentData, senderNumber: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Transaction ID</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="TRX123456789"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={paymentData.transactionId}
                                    onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-50 mt-4"
                            >
                                {submitting ? "Submitting..." : "Verify Payment"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropshippingVideo;
