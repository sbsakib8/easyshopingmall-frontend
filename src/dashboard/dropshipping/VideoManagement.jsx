"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Plus, Trash2, Edit2, Video, ExternalLink, Youtube, ShieldCheck,
    Zap, X, Save, Crown, Star, RefreshCw, Eye, Film, FolderPlus, Folder
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";

const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) videoId = match[2];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

const VideoManagement = () => {
    const [modules, setModules] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [moduleFormData, setModuleFormData] = useState({ title: "", description: "", price: 0, isActive: true });

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [videoFormData, setVideoFormData] = useState({ title: "", description: "", url: "", moduleId: "", videoType: "standard" });
    const [previewUrl, setPreviewUrl] = useState("");

    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [modsRes, vidsRes] = await Promise.all([
                axios.get(`${UrlBackend}/video-module/admin/all`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-content/admin/all`, { withCredentials: true })
            ]);
            if (modsRes.data.success) setModules(modsRes.data.data);
            if (vidsRes.data.success) setVideos(vidsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load data. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setPreviewUrl(getYoutubeEmbedUrl(videoFormData.url));
    }, [videoFormData.url]);

    // Module Handlers
    const openModuleModal = (mod = null) => {
        setEditingModule(mod);
        if (mod) {
            setModuleFormData({ title: mod.title, description: mod.description || "", price: mod.price || 0, isActive: mod.isActive });
        } else {
            setModuleFormData({ title: "", description: "", price: 0, isActive: true });
        }
        setIsModuleModalOpen(true);
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        if (!moduleFormData.title.trim()) return toast.error("Title is required");
        setActionLoading(true);
        try {
            if (editingModule) {
                await axios.put(`${UrlBackend}/video-module/admin/${editingModule._id}`, moduleFormData, { withCredentials: true });
                toast.success("Module updated!");
            } else {
                await axios.post(`${UrlBackend}/video-module/admin/create`, moduleFormData, { withCredentials: true });
                toast.success("Module created!");
            }
            setIsModuleModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteModule = async (id) => {
        if (!window.confirm("Delete this module and all its contents? (Videos inside might get orphaned)")) return;
        try {
            await axios.delete(`${UrlBackend}/video-module/admin/${id}`, { withCredentials: true });
            toast.success("Module deleted");
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // Video Handlers
    const openVideoModal = (moduleId = "", video = null) => {
        setEditingVideo(video);
        if (video) {
            setVideoFormData({ title: video.title, description: video.description || "", url: video.url, moduleId: video.moduleId || moduleId, videoType: video.videoType || "standard" });
        } else {
            setVideoFormData({ title: "", description: "", url: "", moduleId: moduleId || (modules.length > 0 ? modules[0]._id : ""), videoType: "standard" });
        }
        setIsVideoModalOpen(true);
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        if (!videoFormData.title.trim() || !videoFormData.url.trim() || !videoFormData.moduleId) return toast.error("Title, URL, and Module are required");
        setActionLoading(true);
        try {
            if (editingVideo) {
                await axios.patch(`${UrlBackend}/video-content/update/${editingVideo._id}`, videoFormData, { withCredentials: true });
                toast.success("Video updated!");
            } else {
                await axios.post(`${UrlBackend}/video-content/create`, videoFormData, { withCredentials: true });
                toast.success("Video added!");
            }
            setIsVideoModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!window.confirm("Delete this video?")) return;
        try {
            await axios.delete(`${UrlBackend}/video-content/delete/${id}`, { withCredentials: true });
            toast.success("Video deleted");
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) return <DashboardLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                            <Film size={12} /> Programming Hero Style Modules
                        </span>
                        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Folder className="text-emerald-400" />
                            Manage <span className="text-emerald-400">Curriculum</span>
                        </h1>
                        <p className="text-slate-400 font-medium italic mt-1 text-sm">
                            Create modules, set their prices, and add videos inside them.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 self-start md:self-center">
                        <button onClick={fetchData} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><RefreshCw size={18} /></button>
                        <button onClick={() => openModuleModal()} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                            <FolderPlus size={18} /> New Module
                        </button>
                    </div>
                </div>

                {/* ── Modules List ── */}
                {modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 border border-dashed border-slate-700/50 rounded-3xl opacity-50">
                        <Folder size={48} className="mb-4 text-slate-500" />
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">No Modules Created</h3>
                        <p className="text-sm mt-2 font-medium">Create your first module to start adding videos.</p>
                        <button onClick={() => openModuleModal()} className="mt-6 bg-purple-600 px-6 py-3 rounded-xl font-black uppercase text-xs">Create Module</button>
                    </div>
                ) : (
                    modules.map((mod) => {
                        const moduleVideos = videos.filter(v => v.moduleId === mod._id);
                        return (
                            <div key={mod._id} className="mb-12 bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-6 lg:p-10">
                                {/* Section Header */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-700/50 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl shadow-md ${mod.price > 0 ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-gradient-to-br from-emerald-600 to-teal-600"}`}>
                                            {mod.price > 0 ? <Crown size={24} /> : <Zap size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-black uppercase tracking-tight">{mod.title}</h2>
                                                {mod.price > 0 ? (
                                                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest">Premium · ৳{mod.price}</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Free</span>
                                                )}
                                                {!mod.isActive && <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest">Inactive</span>}
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium mt-1">{mod.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openVideoModal(mod._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all shadow-lg"><Plus size={14} /> Add Video</button>
                                        <button onClick={() => openModuleModal(mod)} className="p-3 bg-slate-700 hover:bg-blue-600 rounded-2xl transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDeleteModule(mod._id)} className="p-3 bg-slate-700 hover:bg-red-600 rounded-2xl transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* Videos Grid */}
                                {moduleVideos.length === 0 ? (
                                    <div className="text-center py-10 opacity-50">
                                        <Video size={32} className="mx-auto text-slate-500 mb-2" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No videos in this module</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {moduleVideos.map((video) => (
                                            <div key={video._id} className="bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden group hover:border-slate-600 transition-all flex flex-col">
                                                <div className="relative aspect-video bg-black/60 overflow-hidden">
                                                    {getYoutubeEmbedUrl(video.url) ? (
                                                        <iframe src={getYoutubeEmbedUrl(video.url)} title={video.title} width="100%" height="100%" className="absolute top-0 left-0 border-0" allowFullScreen />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center"><Video size={24} className="text-slate-600" /></div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex-grow flex flex-col">
                                                    <h3 className="text-sm font-black text-slate-100 mb-1 uppercase tracking-tight line-clamp-1">{video.title}</h3>
                                                    {video.description && <p className="text-[10px] font-medium text-slate-500 mb-4 line-clamp-2">{video.description}</p>}
                                                    <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-3">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => openVideoModal(mod._id, video)} className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all" title="Edit"><Edit2 size={12} /></button>
                                                            <button onClick={() => handleDeleteVideo(video._id)} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all" title="Delete"><Trash2 size={12} /></button>
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-500 uppercase">{video.videoType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

            </div>

            {/* ── Module Modal ── */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                        <button onClick={() => setIsModuleModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white"><X size={20} /></button>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">{editingModule ? "Edit Module" : "Create Module"}</h3>
                        <form onSubmit={handleModuleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Module Title *</label>
                                <input type="text" required placeholder="e.g. Module 1: Introduction" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500" value={moduleFormData.title} onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                <textarea placeholder="What will they learn?" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none" value={moduleFormData.description} onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Price (৳) [0 = Free]</label>
                                <input type="number" min="0" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500" value={moduleFormData.price} onChange={(e) => setModuleFormData({...moduleFormData, price: Number(e.target.value)})} />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={moduleFormData.isActive} onChange={(e) => setModuleFormData({...moduleFormData, isActive: e.target.checked})} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 bg-slate-800" />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active</span>
                                </label>
                            </div>
                            <button type="submit" disabled={actionLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl mt-4 disabled:opacity-50">
                                {actionLoading ? "Saving..." : "Save Module"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Video Modal ── */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto">
                        <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white"><X size={20} /></button>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">{editingVideo ? "Edit Video" : "Add Video"}</h3>
                        <form onSubmit={handleVideoSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Module *</label>
                                <select required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500" value={videoFormData.moduleId} onChange={(e) => setVideoFormData({...videoFormData, moduleId: e.target.value})}>
                                    {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Video Title *</label>
                                <input type="text" required placeholder="e.g. Setting up your store" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500" value={videoFormData.title} onChange={(e) => setVideoFormData({...videoFormData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">YouTube URL *</label>
                                <input type="text" required placeholder="https://youtube.com/watch?v=..." className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500" value={videoFormData.url} onChange={(e) => setVideoFormData({...videoFormData, url: e.target.value})} />
                            </div>
                            {previewUrl && (
                                <div className="rounded-2xl overflow-hidden border border-slate-700/50">
                                    <div className="relative aspect-video bg-black"><iframe src={previewUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen /></div>
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                <textarea className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none" value={videoFormData.description} onChange={(e) => setVideoFormData({...videoFormData, description: e.target.value})} />
                            </div>
                            <button type="submit" disabled={actionLoading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl mt-4 disabled:opacity-50">
                                {actionLoading ? "Saving..." : "Save Video"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoManagement;
