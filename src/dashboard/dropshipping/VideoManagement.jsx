"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Video, 
    ExternalLink, 
    Youtube, 
    ShieldCheck, 
    Star, 
    Layout,
    Search,
    X,
    Save
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";

const videoTypes = [
    { value: "standard", label: "Standard Training", icon: <Layout size={14} />, color: "emerald" },
    { value: "demo", label: "Demo Tutorial", icon: <Youtube size={14} />, color: "red" },
    { value: "free", label: "Free Strategy", icon: <Star size={14} />, color: "amber" },
    { value: "premium", label: "Premium Masterclass", icon: <ShieldCheck size={14} />, color: "purple" }
];

const VideoManagement = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        videoType: "standard"
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${UrlBackend}/api/video-content/admin/all`, {
                withCredentials: true
            });
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            let res;
            if (editingVideo) {
                res = await axios.patch(`${UrlBackend}/api/video-content/update/${editingVideo._id}`, formData, { withCredentials: true });
            } else {
                res = await axios.post(`${UrlBackend}/api/video-content/create`, formData, { withCredentials: true });
            }

            if (res.data.success) {
                toast.success(editingVideo ? "Video updated!" : "Video added!");
                setIsModalOpen(false);
                setEditingVideo(null);
                setFormData({ title: "", description: "", url: "", videoType: "standard" });
                fetchVideos();
            }
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this video?")) return;
        try {
            const res = await axios.delete(`${UrlBackend}/api/video-content/delete/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("Video deleted");
                fetchVideos();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const openEditModal = (video) => {
        setEditingVideo(video);
        setFormData({
            title: video.title,
            description: video.description,
            url: video.url,
            videoType: video.videoType
        });
        setIsModalOpen(true);
    };

    if (loading) return <DashboardLoader />;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                    <div>
                        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                            <Video className="text-emerald-400" />
                            Manage <span className="text-emerald-400">Training Videos</span>
                        </h1>
                        <p className="text-slate-400 font-medium italic">Configure the training videos dropshippers see in their hub.</p>
                    </div>
                    <button 
                        onClick={() => {
                            setEditingVideo(null);
                            setFormData({ title: "", description: "", url: "", videoType: "standard" });
                            setIsModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                    >
                        <Plus size={18} /> Add New Video
                    </button>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => {
                        const typeInfo = videoTypes.find(t => t.value === video.videoType);
                        return (
                            <div key={video._id} className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col">
                                <div className="aspect-video relative bg-black/40">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white">
                                            <Video size={24} />
                                        </div>
                                    </div>
                                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-${typeInfo?.color}-500 text-white shadow-lg`}>
                                        {typeInfo?.icon} {typeInfo?.label}
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-black text-slate-100 mb-2 uppercase tracking-tight line-clamp-1">{video.title}</h3>
                                    <p className="text-xs font-bold text-slate-500 mb-6 line-clamp-2">{video.description}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-6">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openEditModal(video)}
                                                className="p-3 bg-slate-700/50 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-xl transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(video._id)}
                                                className="p-3 bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <a 
                                            href={video.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:underline"
                                        >
                                            Watch <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {videos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-20">
                        <Video size={64} className="mb-4" />
                        <p className="text-2xl font-black uppercase tracking-widest">No videos found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                {editingVideo ? "Edit Video" : "Add New Video"}
                            </h3>
                            <p className="text-slate-500 text-sm font-bold mt-1">Configure training content</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Video Title</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="Enter video title"
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">YouTube URL</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.url}
                                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Video Category</label>
                                <select 
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.videoType}
                                    onChange={(e) => setFormData({...formData, videoType: e.target.value})}
                                >
                                    {videoTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                <textarea 
                                    placeholder="Brief description of the content..."
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={actionLoading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? "Processing..." : (
                                    <>
                                        <Save size={18} /> {editingVideo ? "Update Video" : "Save Video"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoManagement;
