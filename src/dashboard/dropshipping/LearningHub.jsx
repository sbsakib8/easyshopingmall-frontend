"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    PlayCircle, CheckCircle2, ChevronRight, ChevronDown, Lock, Unlock, Play,
    BookOpen, Layers, MonitorPlay, Sparkles
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";

const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) videoId = match[2];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : "";
};

const LearningHub = () => {
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [expandedCourses, setExpandedCourses] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    
    // selectedVideo: the currently playing video object
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, modsRes, vidsRes] = await Promise.all([
                    axios.get(`${UrlBackend}/video-course/all`, { withCredentials: true }), // Using public/user route
                    axios.get(`${UrlBackend}/video-module/all`, { withCredentials: true }),
                    axios.get(`${UrlBackend}/video-content/all`, { withCredentials: true }) // Assuming public/user route exists
                ]);
                
                const fetchedCourses = coursesRes.data.success ? coursesRes.data.data : [];
                const fetchedModules = modsRes.data.success ? modsRes.data.data : [];
                const fetchedVideos = vidsRes.data.success ? vidsRes.data.data : [];
                
                setCourses(fetchedCourses);
                setModules(fetchedModules);
                setVideos(fetchedVideos);

                // Auto-expand the first course and module, and select first video
                if (fetchedCourses.length > 0) {
                    setExpandedCourses({ [fetchedCourses[0]._id]: true });
                    const firstCourseMods = fetchedModules.filter(m => m.courseId === fetchedCourses[0]._id);
                    if (firstCourseMods.length > 0) {
                        setExpandedModules({ [firstCourseMods[0]._id]: true });
                        const firstModVids = fetchedVideos.filter(v => v.moduleId === firstCourseMods[0]._id);
                        if (firstModVids.length > 0) {
                            setSelectedVideo(firstModVids[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load course data", error);
                // toast.error("Failed to load curriculum.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleCourse = (id) => setExpandedCourses(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleModule = (id) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

    if (loading) return <DashboardLoader />;

    return (
        <div className="h-[calc(100vh-4rem)] bg-[#1e1e1e] flex flex-col md:flex-row text-slate-300 font-sans overflow-hidden">
            
            {/* ── Left Sidebar (Curriculum) ── */}
            <div className="w-full md:w-80 lg:w-[22rem] bg-[#252526] border-r border-[#333333] flex flex-col h-full overflow-hidden flex-shrink-0 shadow-xl z-10">
                <div className="p-5 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center gap-3 shrink-0">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <MonitorPlay size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Learning Hub</h2>
                        <p className="text-[10px] text-slate-400 font-medium">Dropshipper Academy</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                    {courses.length === 0 ? (
                        <div className="text-center p-6 text-slate-500">
                            <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs">No courses available yet.</p>
                        </div>
                    ) : courses.map(course => {
                        const courseModules = modules.filter(m => m.courseId === course._id);
                        const isCourseExpanded = expandedCourses[course._id];

                        return (
                            <div key={course._id} className="select-none mb-2">
                                {/* Course Node */}
                                <div onClick={() => toggleCourse(course._id)} className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${isCourseExpanded ? 'bg-[#333333]' : 'hover:bg-[#2d2d2d]'}`}>
                                    <span className="text-slate-500 mr-2">
                                        {isCourseExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </span>
                                    <BookOpen size={14} className="text-blue-400 mr-2 shrink-0" />
                                    <span className="text-[13px] font-bold text-slate-200 truncate flex-1">{course.title}</span>
                                    {course.price > 0 && <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded ml-2 shrink-0">Premium</span>}
                                </div>

                                {/* Modules Nodes */}
                                {isCourseExpanded && (
                                    <div className="ml-5 pl-2 border-l border-[#404040] space-y-1 mt-1 pb-2">
                                        {courseModules.map(mod => {
                                            const moduleVideos = videos.filter(v => v.moduleId === mod._id);
                                            const isModExpanded = expandedModules[mod._id];

                                            return (
                                                <div key={mod._id} className="mt-1">
                                                    {/* Module Node */}
                                                    <div onClick={() => toggleModule(mod._id)} className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors ${isModExpanded ? 'bg-purple-500/10' : 'hover:bg-[#2d2d2d]'}`}>
                                                        <span className="text-slate-500 mr-1.5">
                                                            {isModExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                        </span>
                                                        <Layers size={12} className="text-purple-400 mr-2 shrink-0" />
                                                        <span className="text-[11px] font-semibold text-slate-300 truncate flex-1">{mod.title}</span>
                                                    </div>

                                                    {/* Video Nodes */}
                                                    {isModExpanded && (
                                                        <div className="ml-4 pl-2 border-l border-[#404040] space-y-0.5 mt-1 mb-2">
                                                            {moduleVideos.map(video => {
                                                                const isVidSelected = selectedVideo?._id === video._id;
                                                                const isLocked = video.videoType === 'premium' && course.price > 0; // Mock logic, ideally checked via user purchases

                                                                return (
                                                                    <div key={video._id} onClick={() => !isLocked && setSelectedVideo(video)} className={`flex items-center gap-2 p-2 cursor-pointer rounded-md transition-all ${isVidSelected ? 'bg-blue-600 text-white shadow-lg' : isLocked ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-slate-500' : 'hover:bg-[#2a2d3d] text-slate-400 hover:text-slate-200'}`}>
                                                                        <div className="shrink-0">
                                                                            {isVidSelected ? <Play size={12} fill="currentColor" /> : isLocked ? <Lock size={12} /> : <PlayCircle size={12} />}
                                                                        </div>
                                                                        <span className={`text-[11px] truncate flex-1 ${isVidSelected ? 'font-bold' : ''}`}>{video.title}</span>
                                                                        
                                                                        {!isVidSelected && video.videoType === 'free' && (
                                                                            <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/20 px-1 py-0.5 rounded shrink-0">Free</span>
                                                                        )}
                                                                        {!isVidSelected && video.videoType === 'demo' && (
                                                                            <span className="text-[8px] font-bold text-orange-400 bg-orange-500/20 px-1 py-0.5 rounded shrink-0">Demo</span>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                            {moduleVideos.length === 0 && <div className="text-[10px] text-slate-600 pl-2 py-1 italic">No videos in this module</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        {courseModules.length === 0 && <div className="text-[10px] text-slate-600 pl-2 py-1 italic">No modules in this course</div>}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Right Workspace (Video Player) ── */}
            <div className="flex-1 bg-[#1e1e1e] flex flex-col h-full overflow-y-auto custom-scrollbar relative">
                {!selectedVideo ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                        <MonitorPlay size={80} className="mb-6 text-slate-600 drop-shadow-2xl" />
                        <h2 className="text-2xl font-black tracking-widest uppercase text-white">Select a Video</h2>
                        <p className="text-sm mt-3 font-medium">Choose a video from the curriculum menu to start learning.</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Cinematic Player Area */}
                        <div className="w-full bg-black aspect-video md:max-h-[70vh] flex-shrink-0 relative shadow-2xl z-20">
                            {getYoutubeEmbedUrl(selectedVideo.url) ? (
                                <iframe src={getYoutubeEmbedUrl(selectedVideo.url)} title={selectedVideo.title} className="absolute inset-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#111]"><PlayCircle size={48} className="text-slate-700" /></div>
                            )}
                        </div>
                        
                        {/* Details Area */}
                        <div className="flex-1 p-6 md:p-10 max-w-5xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                    selectedVideo.videoType === 'demo' ? 'bg-orange-500/20 text-orange-400' :
                                    selectedVideo.videoType === 'free' ? 'bg-emerald-500/20 text-emerald-400' :
                                    selectedVideo.videoType === 'premium' ? 'bg-indigo-500/20 text-indigo-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {selectedVideo.videoType || 'standard'} Video
                                </span>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">{selectedVideo.title}</h1>
                            
                            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {selectedVideo.description || "No description provided for this video."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3e3e42;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555558;
                }
            `}</style>
        </div>
    );
};

export default LearningHub;
