"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Plus, Trash2, Edit2, Video, Youtube,
    X, Save, Crown, Zap, RefreshCw, Film, FolderPlus, Folder, BookOpen, Layers, PlayCircle, PlusCircle, ChevronRight, ChevronDown, CheckCircle2
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
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sidebar state
    const [expandedCourses, setExpandedCourses] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    
    // Workspace state
    // selectedItem: { type: 'course'|'module'|'video'|'new_course'|'new_module'|'new_video', data: any, parentId?: string }
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Form States
    const [courseType, setCourseType] = useState("free"); // "free" | "paid"
    const [courseFormData, setCourseFormData] = useState({ title: "", description: "", price: 0, isActive: true });
    const [moduleFormData, setModuleFormData] = useState({ title: "", description: "", price: 0, courseId: "", isActive: true });
    const [videoFormData, setVideoFormData] = useState({ title: "", description: "", url: "", moduleId: "", videoType: "standard" });
    const [previewUrl, setPreviewUrl] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: "", id: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [coursesRes, modsRes, vidsRes] = await Promise.all([
                axios.get(`${UrlBackend}/video-course/admin/all`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-module/admin/all`, { withCredentials: true }),
                axios.get(`${UrlBackend}/video-content/admin/all`, { withCredentials: true })
            ]);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
            if (modsRes.data.success) setModules(modsRes.data.data);
            if (vidsRes.data.success) setVideos(vidsRes.data.data);
        } catch (error) {
            toast.error("Failed to load data.");
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

    // Tree Toggles
    const toggleCourse = (id) => setExpandedCourses(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleModule = (id) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

    // Selection Handlers
    const selectItem = (type, data, parentId = null) => {
        setSelectedItem({ type, data, parentId });
        if (type === 'course') {
            setCourseFormData({ title: data.title, description: data.description, price: data.price, isActive: data.isActive });
            setCourseType(data.price > 0 ? "paid" : "free");
        } else if (type === 'new_course') {
            setCourseFormData({ title: "", description: "", price: 0, isActive: true });
            setCourseType("free");
        } else if (type === 'module') {
            setModuleFormData({ title: data.title, description: data.description, price: data.price, courseId: data.courseId, isActive: data.isActive });
        } else if (type === 'new_module') {
            setModuleFormData({ title: "", description: "", price: 0, courseId: parentId || "", isActive: true });
        } else if (type === 'video') {
            setVideoFormData({ title: data.title, description: data.description, url: data.url, moduleId: data.moduleId, videoType: data.videoType });
        } else if (type === 'new_video') {
            setVideoFormData({ title: "", description: "", url: "", moduleId: parentId || "", videoType: "standard" });
        }
    };

    // Submits
    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (selectedItem.type === 'course') {
                await axios.put(`${UrlBackend}/video-course/admin/${selectedItem.data._id}`, courseFormData, { withCredentials: true });
                toast.success("Course updated");
            } else {
                await axios.post(`${UrlBackend}/video-course/admin/create`, courseFormData, { withCredentials: true });
                toast.success("Course created");
            }
            await fetchData();
            setSelectedItem(null);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (selectedItem.type === 'module') {
                await axios.put(`${UrlBackend}/video-module/admin/${selectedItem.data._id}`, moduleFormData, { withCredentials: true });
                toast.success("Module updated");
            } else {
                await axios.post(`${UrlBackend}/video-module/admin/create`, moduleFormData, { withCredentials: true });
                toast.success("Module created");
                setExpandedCourses(prev => ({ ...prev, [moduleFormData.courseId]: true }));
            }
            await fetchData();
            setSelectedItem(null);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = { ...videoFormData };
            if (!payload.moduleId) delete payload.moduleId;
            if (selectedItem.type === 'video') {
                await axios.patch(`${UrlBackend}/video-content/update/${selectedItem.data._id}`, payload, { withCredentials: true });
                toast.success("Video updated");
            } else {
                await axios.post(`${UrlBackend}/video-content/create`, payload, { withCredentials: true });
                toast.success("Video added");
                if (payload.moduleId) {
                    setExpandedModules(prev => ({ ...prev, [payload.moduleId]: true }));
                }
            }
            await fetchData();
            setSelectedItem(null);
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    // Deletes
    const handleDeleteAction = async (type, id) => {
        try {
            if (type === 'course') await axios.delete(`${UrlBackend}/video-course/admin/${id}`, { withCredentials: true });
            else if (type === 'module') await axios.delete(`${UrlBackend}/video-module/admin/${id}`, { withCredentials: true });
            else if (type === 'video') await axios.delete(`${UrlBackend}/video-content/delete/${id}`, { withCredentials: true });
            
            toast.success(`${type} deleted`);
            setSelectedItem(null);
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) return <DashboardLoader />;

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row text-slate-300 font-sans overflow-hidden">
            
            {/* ── Left Sidebar (Tree View) ── */}
            <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden flex-shrink-0">
                <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                        <Folder className="text-blue-500" size={16} /> Curriculum
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={fetchData} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors"><RefreshCw size={14}/></button>
                        <button onClick={() => selectItem('new_course')} className="p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-md transition-colors"><Plus size={14}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                    {courses.map(course => {
                        const courseModules = modules.filter(m => m.courseId === course._id);
                        const isCourseExpanded = expandedCourses[course._id];
                        const isCourseSelected = selectedItem?.data?._id === course._id;

                        return (
                            <div key={course._id} className="select-none">
                                {/* Course Node */}
                                <div className={`flex items-center group rounded-lg transition-colors ${isCourseSelected ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-slate-800 border border-transparent'}`}>
                                    <button onClick={() => toggleCourse(course._id)} className="p-2 text-slate-500 hover:text-slate-300">
                                        {isCourseExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                    <div onClick={() => selectItem('course', course)} className="flex-1 p-2 pl-0 flex items-center gap-2 cursor-pointer">
                                        <BookOpen size={14} className={isCourseSelected ? 'text-blue-400' : 'text-slate-500'} />
                                        <span className={`text-sm font-semibold ${isCourseSelected ? 'text-blue-100' : 'text-slate-300'} truncate`}>{course.title}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); selectItem('new_module', null, course._id); }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-blue-400 transition-opacity"><PlusCircle size={14} /></button>
                                </div>

                                {/* Modules Nodes */}
                                {isCourseExpanded && (
                                    <div className="ml-5 pl-3 border-l border-slate-800 space-y-1 mt-1">
                                        {courseModules.map(mod => {
                                            const moduleVideos = videos.filter(v => v.moduleId === mod._id);
                                            const isModExpanded = expandedModules[mod._id];
                                            const isModSelected = selectedItem?.data?._id === mod._id;

                                            return (
                                                <div key={mod._id}>
                                                    {/* Module Node */}
                                                    <div className={`flex items-center group rounded-lg transition-colors ${isModSelected ? 'bg-purple-500/10 border border-purple-500/30' : 'hover:bg-slate-800 border border-transparent'}`}>
                                                        <button onClick={() => toggleModule(mod._id)} className="p-1.5 text-slate-500 hover:text-slate-300">
                                                            {isModExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                        </button>
                                                        <div onClick={() => selectItem('module', mod)} className="flex-1 p-1.5 pl-0 flex items-center gap-2 cursor-pointer">
                                                            <Layers size={12} className={isModSelected ? 'text-purple-400' : 'text-slate-500'} />
                                                            <span className={`text-xs font-medium ${isModSelected ? 'text-purple-100' : 'text-slate-400'} truncate`}>{mod.title}</span>
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); selectItem('new_video', null, mod._id); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-purple-400 transition-opacity"><PlusCircle size={12} /></button>
                                                    </div>

                                                    {/* Video Nodes */}
                                                    {isModExpanded && (
                                                        <div className="ml-4 pl-3 border-l border-slate-800/50 space-y-0.5 mt-0.5 mb-1">
                                                            {moduleVideos.map(video => {
                                                                const isVidSelected = selectedItem?.data?._id === video._id;
                                                                return (
                                                                    <div key={video._id} onClick={() => selectItem('video', video)} className={`flex items-center gap-2 p-1.5 pl-3 cursor-pointer group rounded-md transition-colors ${isVidSelected ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-slate-800 text-slate-500'}`}>
                                                                        <PlayCircle size={10} className={isVidSelected ? 'text-emerald-400' : 'group-hover:text-emerald-500'} />
                                                                        <span className="text-[11px] truncate flex-1">{video.title}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                            {moduleVideos.length === 0 && <div className="text-[10px] text-slate-600 pl-3 py-1 italic">No videos</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        {courseModules.length === 0 && <div className="text-xs text-slate-600 pl-3 py-1 italic">No modules</div>}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Standalone Videos Section */}
                    {(() => {
                        const standalone = videos.filter(v => !v.moduleId);
                        return (
                            <div className="mt-6 border-t border-slate-800/60 pt-4 pb-2">
                                <div className="flex items-center justify-between px-2 mb-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Film size={12} className="text-emerald-500" /> Standalone / Promo
                                    </h3>
                                    <button onClick={() => selectItem('new_video', null, null)} className="p-1 text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors" title="Add Standalone Video"><Plus size={10}/></button>
                                </div>
                                <div className="space-y-0.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                    {standalone.map(video => {
                                        const isVidSelected = selectedItem?.data?._id === video._id;
                                        return (
                                            <div key={video._id} onClick={() => selectItem('video', video)} className={`flex items-center gap-2 p-1.5 pl-3 cursor-pointer group rounded-md transition-colors ${isVidSelected ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-slate-800 text-slate-500'}`}>
                                                <PlayCircle size={10} className={isVidSelected ? 'text-emerald-400' : 'group-hover:text-emerald-500'} />
                                                <span className="text-[11px] truncate flex-1">{video.title}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${video.videoType === 'demo' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{video.videoType}</span>
                                            </div>
                                        )
                                    })}
                                    {standalone.length === 0 && <div className="text-[10px] text-slate-600 pl-3 py-1 italic">No standalone videos</div>}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ── Right Workspace ── */}
            <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
                {!selectedItem ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                        <FolderPlus size={64} className="mb-4 text-slate-600" />
                        <h2 className="text-xl font-bold tracking-widest uppercase">Select an Item</h2>
                        <p className="text-sm mt-2">Click on a course, module, or video from the sidebar to edit it.</p>
                    </div>
                ) : (
                    <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header & Delete Btn */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                                    {selectedItem.type.replace('_', ' ')} Settings
                                </span>
                                <h1 className="text-2xl font-black text-white">
                                    {selectedItem.data ? selectedItem.data.title : `Create New ${selectedItem.type.split('_')[1]}`}
                                </h1>
                            </div>
                            {selectedItem.data && (
                                <button onClick={() => setDeleteConfirm({ show: true, type: selectedItem.type, id: selectedItem.data._id })} className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* Forms */}
                        {(selectedItem.type === 'course' || selectedItem.type === 'new_course') && (
                            <form onSubmit={handleCourseSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Free/Paid Selection Upfront */}
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Course Access Type</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div
                                                onClick={() => {
                                                    setCourseType("free");
                                                    setCourseFormData({ ...courseFormData, price: 0 });
                                                }}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                                    courseType === "free"
                                                        ? "bg-blue-500/10 border-blue-500/80 ring-2 ring-blue-500/20"
                                                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-slate-200">Free Course</span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${courseType === "free" ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}>
                                                        {courseType === "free" && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-normal">Free for all registered dropshipping users.</p>
                                            </div>

                                            <div
                                                onClick={() => {
                                                    setCourseType("paid");
                                                    // Set to a placeholder default price if it is currently 0
                                                    if (courseFormData.price === 0) {
                                                        setCourseFormData({ ...courseFormData, price: 500 });
                                                    }
                                                }}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                                    courseType === "paid"
                                                        ? "bg-blue-500/10 border-blue-500/80 ring-2 ring-blue-500/20"
                                                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-slate-200">Paid / Premium Course</span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${courseType === "paid" ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}>
                                                        {courseType === "paid" && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-normal">Requires premium access plan payment to unlock.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Course Title</label>
                                        <input type="text" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={courseFormData.title} onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-y" value={courseFormData.description} onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})} />
                                    </div>

                                    {/* Conditional Price field */}
                                    {courseType === "paid" ? (
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price (৳)</label>
                                            <div className="relative animate-in slide-in-from-top-2 duration-200">
                                                <span className="absolute left-4 top-3 text-slate-500">৳</span>
                                                <input type="number" min="1" required className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={courseFormData.price} onChange={(e) => setCourseFormData({...courseFormData, price: Number(e.target.value)})} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500/50 uppercase tracking-widest mb-2">Price (৳)</label>
                                            <div className="relative opacity-50 cursor-not-allowed">
                                                <span className="absolute left-4 top-3 text-slate-500">৳</span>
                                                <input type="text" disabled className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-400 outline-none" value="Free (0 ৳)" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer mt-4">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only peer" checked={courseFormData.isActive} onChange={(e) => setCourseFormData({...courseFormData, isActive: e.target.checked})} />
                                                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Published</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button type="submit" disabled={actionLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
                                        <Save size={16} /> {actionLoading ? "Saving..." : "Save Course"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(selectedItem.type === 'module' || selectedItem.type === 'new_module') && (
                            <form onSubmit={handleModuleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Parent Course</label>
                                        <select required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={moduleFormData.courseId} onChange={(e) => setModuleFormData({...moduleFormData, courseId: e.target.value})}>
                                            <option value="" disabled>Select a Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Module Title</label>
                                        <input type="text" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={moduleFormData.title} onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32 resize-y" value={moduleFormData.description} onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})} />
                                    </div>
                                    <div className="flex items-center md:col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer mt-2">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only peer" checked={moduleFormData.isActive} onChange={(e) => setModuleFormData({...moduleFormData, isActive: e.target.checked})} />
                                                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Active</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button type="submit" disabled={actionLoading} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50">
                                        <Save size={16} /> {actionLoading ? "Saving..." : "Save Module"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(selectedItem.type === 'video' || selectedItem.type === 'new_video') && (
                            <form onSubmit={handleVideoSubmit} className="space-y-6">
                                {/* Live Preview Area */}
                                {previewUrl && (
                                    <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-slate-800 relative group">
                                        <iframe src={previewUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Parent Module</label>
                                        <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={videoFormData.moduleId || ""} onChange={(e) => setVideoFormData({...videoFormData, moduleId: e.target.value})}>
                                            <option value="">None (Standalone Video - e.g. Demo / Promo)</option>
                                            {modules.map(m => (
                                                <option key={m._id} value={m._id}>
                                                    {courses.find(c => c._id === m.courseId)?.title ? `${courses.find(c => c._id === m.courseId).title} > ` : ''}{m.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Video Title</label>
                                        <input type="text" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={videoFormData.title} onChange={(e) => setVideoFormData({...videoFormData, title: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">YouTube URL</label>
                                        <input type="text" required placeholder="https://youtu.be/..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={videoFormData.url} onChange={(e) => setVideoFormData({...videoFormData, url: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Access Type</label>
                                        <select required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={videoFormData.videoType} onChange={(e) => setVideoFormData({...videoFormData, videoType: e.target.value})}>
                                            <option value="standard">Standard (Requires Course Access)</option>
                                            <option value="demo">Demo (Public/Marketing)</option>
                                            <option value="free">Free (Logged in users)</option>
                                            <option value="premium">Premium (Extra Paywall)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-y" value={videoFormData.description} onChange={(e) => setVideoFormData({...videoFormData, description: e.target.value})} />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button type="submit" disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                                        <Save size={16} /> {actionLoading ? "Saving..." : "Save Video"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-5">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 size={28} className="animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Delete {deleteConfirm.type}?</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Are you sure you want to permanently delete this {deleteConfirm.type}? This action is irreversible and will remove all associated content.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm({ show: false, type: "", id: "" })}
                                className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors border border-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const { type, id } = deleteConfirm;
                                    setDeleteConfirm({ show: false, type: "", id: "" });
                                    await handleDeleteAction(type, id);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-600/20"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
};

export default VideoManagement;
