"use client";

import Container from "@/src/compronent/shared/Container";
import Section from "@/src/compronent/shared/Section";
import { UrlBackend } from "@/src/confic/urlExport";
import BackButton from "@/src/dropShipping/BackButton/BackButton";
import { WebsiteinfoAllGet } from "@/src/hook/content/useWebsiteInfo";
import { ProductAllGet } from "@/src/hook/useProduct";
import { useGetUser } from "@/src/utlis/useGetuser";
import axios from "axios";
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Check,
    CheckCircle,
    ChevronRight,
    Clock,
    CreditCard,
    Crown,
    Download,
    Film,
    History,
    Info,
    Lock,
    Play,
    RefreshCw,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    Video,
    XCircle,
    Youtube,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

// ─── Helper: YouTube ID Extractor ────────────────────────────────────────────
const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) videoId = match[2];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// ─── Payment Form Sub-component ───────────────────────────────────────────────
const PaymentForm = ({ paymentData, setPaymentData, onSubmit, submitting, title = "Submit Payment", price = 500 }) => (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-5 md:p-8 shadow-lg w-full">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="text-emerald-600" size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h3>
                <p className="text-xs text-gray-400 font-bold mt-0.5">আপনার বিকাশ / নগদ লেনদেনের বিবরণ দিন</p>
            </div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 mb-8">
            <div className="flex items-center gap-2 mb-1.5">
                <Info className="text-emerald-600 w-4 h-4" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">পেমেন্ট নির্দেশিকা</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                অনুগ্রহ করে আমাদের বিকাশ/নগদ নম্বরে <span className="font-bold">(01626420774)</span> <span className="font-black">&#2547;{price}</span> (সেন্ড মানি) পাঠান। এরপর নিচে লেনদেনের বিবরণ দিন।
            </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
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
                    onChange={(e) => setPaymentData({ ...paymentData, senderNumber: e.target.value })} />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Transaction ID</label>
                <input type="text" required placeholder="TRX123456789"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })} />
            </div>
            <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                {submitting ? (<><RefreshCw className="animate-spin" size={16} /> Submitting...</>) : (<><ShieldCheck size={16} /> {title}</>)}
            </button>
        </form>
    </div >
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DropshippingVideo = () => {
    const { user } = useGetUser();
    const [activeTab, setActiveTab] = useState("academy");
    const [accessRequests, setAccessRequests] = useState([]);
    const [videos, setVideos] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [myRequests, setMyRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [requestSubmitLoading, setRequestSubmitLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [newRequestData, setNewRequestData] = useState({ productId: "", productName: "", productImage: "", videoType: "facebook_ad", notes: "" });
    const [premiumVideoPrice, setPremiumVideoPrice] = useState(500);
    const [activeVideo, setActiveVideo] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [paymentData, setPaymentData] = useState({ paymentMethod: "Bkash", transactionId: "", senderNumber: "", amount: 500 });

    const activeCourse = useMemo(() => courses.find(c => c._id === selectedCourseId), [courses, selectedCourseId]);
    const activeCourseModules = useMemo(() => modules.filter(m => m.courseId === selectedCourseId), [modules, selectedCourseId]);
    const premiumStatus = useMemo(() => {
        if (!selectedCourseId) return "none";
        const courseReqs = accessRequests.filter(req => req.courseId === selectedCourseId);
        if (courseReqs.length === 0) return "none";
        if (courseReqs.some(r => r.status === "approved")) return "approved";
        if (courseReqs.some(r => r.status === "pending")) return "pending";
        if (courseReqs.some(r => r.status === "rejected")) return "rejected";
        return courseReqs[0].status || "none";
    }, [accessRequests, selectedCourseId]);
    const isCoursePremium = activeCourse?.price > 0;
    const isCourseLocked = isCoursePremium && premiumStatus !== "approved";
    const isVideoLocked = isCourseLocked && activeVideo && (activeVideo.videoType === "premium" || activeVideo.videoType === "standard" || !activeVideo.videoType);
    const currentCoursePrice = useMemo(() => {
        if (!activeCourse) return premiumVideoPrice;
        return activeCourse.discountPrice > 0 ? activeCourse.discountPrice : activeCourse.price;
    }, [activeCourse, premiumVideoPrice]);

    const demoVideo = useMemo(() => videos.find(v => v.videoType === "demo"), [videos]);
    const freeVideos = useMemo(() => videos.filter(v => v.videoType === "free"), [videos]);



    const handleCourseSelect = (courseId) => {
        setSelectedCourseId(courseId);
        const courseModules = modules.filter(m => m.courseId === courseId);
        if (courseModules.length > 0) {
            setExpandedModules({ [courseModules[0]._id]: true });
            const firstModVideos = videos.filter(v => (v.moduleId?._id === courseModules[0]._id || v.moduleId === courseModules[0]._id));
            setActiveVideo(firstModVideos.length > 0 ? firstModVideos[0] : null);
        } else {
            setActiveVideo(null);
        }
    };

    const toggleModule = (mod) => setExpandedModules(prev => ({ ...prev, [mod]: !prev[mod] }));

    const fetchData = async () => {
        setLoading(true);
        try {
            const [accessResult, videosResult, coursesResult, modulesResult, websiteInfoResult] = await Promise.allSettled([
                axios.get(`${UrlBackend}/video-access/my-access`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-content/all`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-course/all`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-module/all`, { withCredentials: true }),
                WebsiteinfoAllGet()
            ]);
            if (accessResult.status === "fulfilled" && accessResult.value.data.success) setAccessRequests(accessResult.value.data.data);
            if (videosResult.status === "fulfilled" && videosResult.value.data.success) setVideos(videosResult.value.data.data);
            if (coursesResult.status === "fulfilled" && coursesResult.value.data.success) setCourses(coursesResult.value.data.data);
            if (modulesResult.status === "fulfilled" && modulesResult.value.data.success) setModules(modulesResult.value.data.data);
            if (websiteInfoResult.status === "fulfilled") {
                const info = websiteInfoResult.value.websiteinfo?.[0] || websiteInfoResult.value.data?.[0];
                if (info && info.premiumVideoPrice) {
                    setPremiumVideoPrice(info.premiumVideoPrice);
                    setPaymentData(prev => ({ ...prev, amount: info.premiumVideoPrice }));
                }
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

    useEffect(() => { fetchData(); fetchRequests(); fetchProducts(); }, []);

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${UrlBackend}/video-access/create`, {
                ...paymentData,
                amount: currentCoursePrice,
                videoType: "premium_training",
                courseId: selectedCourseId
            }, { withCredentials: true });
            if (res.data.success) { toast.success("Payment submitted! Waiting for admin approval."); fetchData(); }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit payment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitCustomRequest = async (e) => {
        e.preventDefault();
        if (!newRequestData.productId) { toast.error("Please select a product from the list"); return; }
        setRequestSubmitLoading(true);
        try {
            const res = await axios.post(`${UrlBackend}/video-request/create`, { productId: newRequestData.productId, videoType: newRequestData.videoType, notes: newRequestData.notes }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Ad creative request submitted!");
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

    const filteredProducts = useMemo(() => {
        if (!productSearch) return products.slice(0, 10);
        return products.filter(p => p.productName?.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 10);
    }, [products, productSearch]);

    const customRequestTypeLabels = {
        facebook_ad: "Facebook Ad Creative",
        tiktok_video: "TikTok Ad Video",
        youtube_short: "YouTube Short/Reel",
        unboxing: "Unboxing / UGC Video",
        other: "Custom / Special Video"
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Video Hub...</p>
            </div>
        </div>
    );

    return (
        <Section className="min-h-dvh bg-slate-50/30 py-8 overflow-x-hidden">
            <Container>
                <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-3 mb-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Learning Hub</h2>
                        <p className="text-gray-500 font-medium italic">Master the art of dropshipping with our curated training videos.</p>
                    </div>
                    <BackButton className="w-min" />
                </div>

                <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 lg:p-12 border border-slate-700/30 shadow-2xl overflow-hidden mb-10">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500 rounded-full blur-[80px] -ml-20 -mb-20" />
                    </div>
                    <div className="relative z-10">
                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
                            <Sparkles size={12} className="animate-pulse" /> Growth Academy
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase mb-2">Video Resources Center</h2>
                        <p className="text-slate-400 font-medium italic text-sm">Learn dropshipping strategies and scale your business with expert training.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {[
                        { key: "academy", label: "Training Academy", icon: BookOpen },
                        { key: "requests", label: "Order Custom Ads", icon: Film }
                    ].map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === key ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "bg-white text-gray-500 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"}`}>
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                {activeTab === "academy" && (
                    <div className="animate-in fade-in duration-300">
                        {!selectedCourseId ? (
                            <>
                                {/* Demo Video / Platform Trailer Section */}
                                {demoVideo && (
                                    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[2.5rem] p-6 lg:p-8 border border-slate-800 shadow-2xl overflow-hidden mb-10 relative">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                            <div className="lg:col-span-5 space-y-4">
                                                <span className="bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 inline-flex items-center gap-1.5">
                                                    <Sparkles size={12} className="animate-pulse" /> PLATFORM TRAILER
                                                </span>
                                                <h3 className="hidden md:block text-2xl lg:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                                                    {demoVideo.title}
                                                </h3>
                                                <p className="text-slate-400 font-medium text-xs leading-relaxed hidden md:block">
                                                    {demoVideo.description || "Watch this quick advertisement to see how our dropshipping platform works and how you can scale your sales instantly!"}
                                                </p>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">🏆</div>
                                                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-purple-500 flex items-center justify-center text-[10px] font-black text-white">⚡</div>
                                                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-pink-500 flex items-center justify-center text-[10px] font-black text-white">🔥</div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Join 10,000+ Students online</span>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-7">
                                                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                                                    <iframe
                                                        src={getYoutubeEmbedUrl(demoVideo.url)}
                                                        title={demoVideo.title}
                                                        width="100%"
                                                        height="100%"
                                                        className="absolute inset-0 w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Standalone Free Videos Section */}
                                {freeVideos.length > 0 && (
                                    <div className="mb-10">
                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                                    <Zap size={16} className="text-emerald-600 animate-bounce" /> Standalone Free Lessons
                                                </h3>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Quick tactics to scale your shop today</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {freeVideos.map(video => (
                                                <div key={video._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                                                    <div className="aspect-video bg-black relative">
                                                        <iframe
                                                            src={getYoutubeEmbedUrl(video.url)}
                                                            title={video.title}
                                                            width="100%"
                                                            height="100%"
                                                            className="absolute inset-0 w-full h-full border-0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                    <div className="p-5 flex-1 hidden md:flex flex-col justify-between">
                                                        <div>
                                                            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 inline-block mb-2">
                                                                Standalone Free
                                                            </span>
                                                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{video.title}</h4>
                                                            <p className="text-[11px] text-gray-500 font-medium line-clamp-2 mt-1">{video.description || "No description provided."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Standard Courses Section */}
                                <div className="mb-6 px-2">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                        <BookOpen size={16} className="text-emerald-600" /> Professional Video Courses
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Comprehensive step-by-step masterclasses</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map(course => {
                                        const courseModules = modules.filter(m => m.courseId === course._id);
                                        const courseModuleIds = courseModules.map(m => m._id);
                                        const courseVideos = videos.filter(v => {
                                            const mId = v.moduleId?._id || v.moduleId;
                                            return courseModuleIds.includes(mId);
                                        });
                                        const isPremium = course.price > 0;
                                        const courseAccess = accessRequests.find(req => req.courseId === course._id || (req.videoType === "premium_training" && !req.courseId));
                                        const courseStatus = courseAccess ? courseAccess.status : "none";
                                        const isLocked = isPremium && courseStatus !== "approved";
                                        return (
                                            <div key={course._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                                                <div>
                                                    <div className={`aspect-[2/1] relative flex items-center justify-center bg-gradient-to-br ${isPremium ? 'from-indigo-600 to-purple-600' : 'from-emerald-500 to-teal-500'} p-6 text-white`}>
                                                        <BookOpen size={48} className="opacity-80 group-hover:scale-110 transition-transform" />
                                                        <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isPremium ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-200' : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200'}`}>
                                                            {isPremium ? "Premium" : "Free"}
                                                        </span>
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1">{course.title}</h3>
                                                        {isPremium && (
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {course.discountPrice > 0 ? (
                                                                    <>
                                                                        <span className="text-xs text-gray-400 line-through">৳{course.price}</span>
                                                                        <span className="text-sm font-black text-purple-600">৳{course.discountPrice}</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-sm font-black text-purple-600">৳{course.price}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {course.referralBonus > 0 && (
                                                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-100">
                                                                <Sparkles size={10} className="text-emerald-500" /> Refer & Earn: ৳{course.referralBonus}
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 mb-4">{course.description || "No description provided."}</p>
                                                    </div>
                                                </div>
                                                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between gap-4">
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                                                        {courseModules.length} Modules &bull; {courseVideos.length} Videos
                                                    </div>
                                                    <button onClick={() => handleCourseSelect(course._id)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${isLocked ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100'}`}>
                                                        {isLocked ? (<><Lock size={12} /> Unlock</>) : (<><Play size={12} fill="currentColor" /> Learn</>)}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {courses.length === 0 && (
                                        <div className="col-span-full py-24 text-center text-slate-400 font-bold uppercase tracking-widest">No courses available.</div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <button onClick={() => setSelectedCourseId(null)} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors mb-4">
                                    <ArrowLeft size={14} /> Back to Course Catalog
                                </button>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {isCourseLocked ? (
                                        <div className="lg:col-span-12 max-w-2xl mx-auto w-full">
                                            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in duration-300">
                                                <div className="relative aspect-video bg-slate-900 flex flex-col items-center justify-center p-6 md:p-8 text-center">
                                                    <Lock size={48} className="text-purple-500/50 mb-4 animate-bounce" />
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Premium Course Content</h3>
                                                    <p className="text-slate-400 font-medium mt-2 max-w-md text-xs">Unlock this course and all premium training by joining the masterclass.</p>
                                                </div>
                                                <div className="p-5 md:p-8">
                                                    {premiumStatus === "pending" && (
                                                        <div className="flex flex-col items-center justify-center text-center py-6">
                                                            <div className="w-14 h-14 bg-amber-50 border-4 border-amber-200 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                                                <Clock className="text-amber-500" size={24} />
                                                            </div>
                                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Payment Under Review</h3>
                                                            <p className="text-gray-500 font-medium text-xs max-w-md mb-6">Your payment of &#2547;{currentCoursePrice} is currently being verified by our administrators.</p>
                                                            <button onClick={fetchData} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
                                                                <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "3s" }} /> Refresh Status
                                                            </button>
                                                        </div>
                                                    )}
                                                    {premiumStatus === "rejected" && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                                            <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6 text-center">
                                                                <XCircle className="text-red-500 mx-auto mb-3" size={32} />
                                                                <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Payment Rejected</h4>
                                                                <p className="text-[11px] text-gray-600 font-medium mt-2">Previous payment could not be verified. Please try again with valid details.</p>
                                                            </div>
                                                            <PaymentForm paymentData={paymentData} setPaymentData={setPaymentData} onSubmit={handleSubmitPayment} submitting={submitting} title="Try Again" price={currentCoursePrice} />
                                                        </div>
                                                    )}
                                                    {premiumStatus === "none" && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white border border-slate-700 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-4"><Crown size={18} /></div>
                                                                    <h3 className="text-lg font-black uppercase tracking-tight mb-1">মাস্টারক্লাস আনলক</h3>
                                                                    <p className="text-xl font-black text-purple-400 mb-6">&#2547;{currentCoursePrice} <span className="text-[10px] font-bold text-slate-400">এককালীন</span></p>
                                                                    <ul className="space-y-3">
                                                                        {["উন্নত কৌশল", "লাইভ কেস স্টাডি", "আজীবন এক্সেস"].map((item, i) => (
                                                                            <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                                                <Check size={12} className="text-purple-400" /> {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <PaymentForm paymentData={paymentData} setPaymentData={setPaymentData} onSubmit={handleSubmitPayment} submitting={submitting} title="পেমেন্ট জমা দিন" price={currentCoursePrice} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="lg:col-span-8 space-y-6">
                                                {!activeVideo ? (
                                                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-sm border border-gray-100 aspect-video flex flex-col items-center justify-center">
                                                        <Play size={48} className="text-gray-200 mb-4" />
                                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Select a video to begin</h3>
                                                        <p className="text-gray-500 font-medium text-sm mt-2">Choose a video from the curriculum on the right.</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in duration-300">
                                                        <div className="relative aspect-video bg-black">
                                                            <iframe src={getYoutubeEmbedUrl(activeVideo.url)} title={activeVideo.title} width="100%" height="100%"
                                                                className="absolute top-0 left-0 w-full h-full border-0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen></iframe>
                                                        </div>
                                                        <div className="p-5 md:p-8">
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                                                                {activeVideo.videoType === "demo" && <Youtube size={10} className="text-red-500" />}
                                                                {activeVideo.videoType === "free" && <Zap size={10} className="text-emerald-500" />}
                                                                {activeVideo.videoType === "premium" && <Crown size={10} className="text-purple-500" />}
                                                                {(activeVideo.videoType || "Standard")} Video
                                                            </div>
                                                            <h1 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{activeVideo.title}</h1>
                                                            {activeVideo.description ? (
                                                                <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-wrap break-words">{activeVideo.description}</p>
                                                            ) : (
                                                                <p className="text-xs text-gray-400 italic">No description provided for this video.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[2.5rem] p-5 shadow-sm h-fit max-h-[400px] md:max-h-[700px] overflow-y-auto">
                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4 px-2">Course Curriculum</h3>
                                                <div className="space-y-3">
                                                    {activeCourseModules.map((mod, modIdx) => {
                                                        const modVideos = videos.filter(v => (v.moduleId?._id === mod._id || v.moduleId === mod._id));
                                                        const isExpanded = !!expandedModules[mod._id];
                                                        return (
                                                            <div key={mod._id} className="border border-gray-100 rounded-2xl overflow-hidden">
                                                                <button onClick={() => toggleModule(mod._id)} type="button"
                                                                    className="w-full bg-slate-50 flex items-center justify-between p-3.5 hover:bg-slate-100 transition-colors">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <span className="text-[10px] font-black text-gray-400 shrink-0">M{modIdx + 1}</span>
                                                                        <span className="font-black text-gray-800 uppercase tracking-tight text-xs truncate">{mod.title}</span>
                                                                    </div>
                                                                    <ChevronRight size={14} className={`text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                                                </button>
                                                                {isExpanded && (
                                                                    <div className="p-1 bg-white space-y-0.5">
                                                                        {modVideos.map((video) => {
                                                                            const isActive = activeVideo?._id === video._id;
                                                                            return (
                                                                                <button key={video._id} onClick={() => setActiveVideo(video)} type="button"
                                                                                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                                                                                    <Play size={12} className={`shrink-0 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                                                    <span className="text-[11px] font-bold leading-tight flex-1 truncate">{video.title}</span>
                                                                                    {video.videoType === "demo" && <span className="text-[8px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase shrink-0">Demo</span>}
                                                                                    {video.videoType === "free" && <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase shrink-0">Free</span>}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                        {modVideos.length === 0 && <div className="p-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">No videos</div>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {activeCourseModules.length === 0 && <div className="text-center p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">No modules available</div>}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "requests" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Sparkles className="animate-spin" style={{ animationDuration: "3s" }} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">কাস্টম অ্যাডস অর্ডার করুন</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">ইউনিক ক্রিয়েটিভ দিয়ে আপনার সেলস বাড়ান</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 mb-6 text-xs text-slate-600 leading-relaxed font-medium">
                                <span className="font-black text-slate-800 uppercase block mb-1">প্রফেশনাল বিডি ড্রপশিপিং স্ট্যান্ডার্ড</span>
                                আপনার টার্গেটেড অ্যাড ক্যাম্পেইনের জন্য আমাদের মিডিয়া বিশেষজ্ঞদের তৈরি হাই-কনভার্টিং প্রোডাক্ট ভিডিও পান।
                            </div>
                            <form onSubmit={handleSubmitCustomRequest} className="space-y-5">
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
                                                <input type="text" placeholder="Search product name..."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={productSearch}
                                                    onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); }}
                                                    onFocus={() => setShowProductDropdown(true)} />
                                            </div>
                                            {showProductDropdown && (
                                                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                                                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                                        <div key={p._id}
                                                            onClick={() => { setNewRequestData(prev => ({ ...prev, productId: p._id, productName: p.productName, productImage: p.images?.[0] || "" })); setShowProductDropdown(false); }}
                                                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                                            {p.images?.[0] ? <img src={p.images[0]} alt={p.productName} className="w-8 h-8 object-cover rounded-lg border" /> : <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">P</div>}
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
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Requirements / Custom Notes</label>
                                    <textarea rows={4} placeholder="Examples: Provide Bangla voiceover; Highlight product key features; Keep it under 30 seconds..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 h-28 resize-none"
                                        value={newRequestData.notes}
                                        onChange={(e) => setNewRequestData(prev => ({ ...prev, notes: e.target.value }))} />
                                </div>
                                <button type="submit" disabled={requestSubmitLoading}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                                    {requestSubmitLoading ? (<><RefreshCw className="animate-spin" size={16} /> Submitting...</>) : (<><Send size={16} /> Submit Video Request</>)}
                                </button>
                            </form>
                        </div>

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
                                    <p className="text-xs text-slate-400 font-medium max-w-xs mt-1.5">Your requested custom video creatives will show up here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                                    {myRequests.map((req) => (
                                        <div key={req._id} className={`p-5 rounded-3xl border transition-all ${req.status === "completed" ? "border-emerald-100 bg-emerald-50/10" : req.status === "rejected" ? "border-red-100 bg-red-50/10" : "border-slate-100"}`}>
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
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">{customRequestTypeLabels[req.videoType] || req.videoType}</span>
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
                                                    <div className="break-words">
                                                        {req.notes}
                                                    </div>
                                                </div>
                                            )}
                                            {req.adminNote && (
                                                <div className="bg-amber-50/50 border border-amber-100 text-amber-800 rounded-2xl p-3 mb-3 text-xs font-medium flex items-start gap-2">
                                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Admin Note:</span>
                                                        <div className="break-words">
                                                            {req.adminNote}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {req.status === "completed" && req.deliveredVideoUrl && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-700">
                                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                                        Ready for download
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

            </Container>
        </Section>
    );
};

export default DropshippingVideo;
