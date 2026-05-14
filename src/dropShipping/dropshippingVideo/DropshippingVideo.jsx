"use client";
import React, { useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { Play, Lock, CheckCircle, Clock, XCircle, ShieldCheck, CreditCard, Info, Youtube, Star, Video, ArrowRight, Layout } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UrlBackend } from "@/src/confic/urlExport";
import { useGetUser } from "@/src/utlis/useGetuser";

const DropshippingVideo = () => {
    const { user } = useGetUser();
    const [accessRequests, setAccessRequests] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
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

    useEffect(() => {
        fetchData();
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

    const premiumStatus = accessRequests.find(req => req.videoType === "premium_training")?.status || "none";

    const typeIcons = {
        standard: <Layout className="text-emerald-500" />,
        demo: <Youtube className="text-red-500" />,
        free: <Star className="text-amber-500" />,
        premium: <ShieldCheck className="text-purple-500" />
    };

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
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    // Group videos by row
    const row1 = videos.filter(v => v.videoType === 'standard' || v.videoType === 'demo').slice(0, 2);
    const row2 = videos.filter(v => v.videoType === 'free' || v.videoType === 'premium').slice(0, 2);
    const otherVideos = videos.filter(v => ![...row1, ...row2].some(rv => rv._id === v._id));

    return (
        <div className="min-h-screen bg-slate-50/30 py-8 lg:py-12">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="mb-12">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2">Learning Hub</h2>
                    <p className="text-gray-500 font-medium italic">Master the art of dropshipping with our curated training videos.</p>
                </div>

                {/* Rows as requested */}
                <div className="space-y-8">
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
                </div>

                {videos.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <Video size={64} className="mx-auto mb-4" />
                        <p className="text-xl font-black">No videos found. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
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
