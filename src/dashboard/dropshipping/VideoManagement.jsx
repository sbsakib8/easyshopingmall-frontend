"use client";

import Container from "@/src/compronent/shared/Container";
import { UrlBackend } from "@/src/confic/urlExport";
import DashboardLoader from "@/src/helper/loading/DashboardLoader";
import { cn } from "@/src/utlis/utils";
import axios from "axios";
import {
  Crown,
  Edit2,
  Film,
  Folder,
  FolderPlus,
  Plus,
  RefreshCw,
  Trash2,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function EmptyState({
  icon: Icon = Folder,
  title = "No Modules Created",
  message = "Create your first module to start adding videos.",
  buttonText = "Create Module",
  onButtonClick,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 md:py-16 px-6",
        "bg-slate-800/20 border border-dashed border-slate-700/50 rounded-3xl",
        className,
      )}
    >
      <div className="mb-5 md:mb-6">
        <Icon size={44} className="text-slate-500 md:size-12 transition-all" />
      </div>

      <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-slate-400 text-center">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-slate-500 mt-2 text-center max-w-xs md:max-w-sm font-medium">
        {message}
      </p>

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className={cn(
            "mt-7 md:mt-8 bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
            "px-5 md:px-7 py-3 rounded-2xl font-black uppercase text-[10px] md:text-xs",
            "tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-500/30",
          )}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) videoId = match[2];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

// Modules array
const modulesData = [
  {
    _id: "mod_001",
    title: "INTRODUCTION TO WEB DEVELOPMENT",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript basics.",
    price: 0,
    isActive: true,
  },
  {
    _id: "mod_002",
    title: "HTML & CSS MASTERY",
    description:
      "Deep dive into semantic HTML5, modern CSS techniques, and responsive design.",
    price: 1499,
    isActive: true,
  },
  {
    _id: "mod_003",
    title: "JAVASCRIPT ESSENTIALS",
    description:
      "Core JavaScript concepts: variables, functions, arrays, objects, and DOM manipulation.",
    price: 2499,
    isActive: true,
  },
  {
    _id: "mod_004",
    title: "REACT FUNDAMENTALS",
    description:
      "Introduction to React.js, components, props, state, and hooks.",
    price: 3499,
    isActive: false,
  },
  {
    _id: "mod_005",
    title: "BACKEND BASICS WITH NODE.JS",
    description:
      "Learn server-side JavaScript, Express.js, and MongoDB integration.",
    price: 3999,
    isActive: true,
  },
];

// Videos array (linked to modules via moduleId)
const videosData = [
  // Module 001 videos (Free module)
  {
    _id: "vid_001a",
    title: "What is Web Development?",
    description:
      "Understanding the basics of web development and career opportunities.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "free",
    moduleId: "mod_001",
  },
  {
    _id: "vid_001b",
    title: "Setting Up Your Development Environment",
    description:
      "Install VS Code, Git, and necessary extensions for web development.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "free",
    moduleId: "mod_001",
  },

  // Module 002 videos (Premium module)
  {
    _id: "vid_002a",
    title: "HTML5 Semantic Elements",
    description:
      "Using header, nav, main, article, section, and footer tags properly.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_002",
  },
  {
    _id: "vid_002b",
    title: "CSS Flexbox Deep Dive",
    description: "Master flexbox layouts for modern, responsive web design.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_002",
  },
  {
    _id: "vid_002c",
    title: "CSS Grid Crash Course",
    description: "Creating complex two-dimensional layouts with CSS Grid.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "demo",
    moduleId: "mod_002",
  },

  // Module 003 videos (Premium module)
  {
    _id: "vid_003a",
    title: "JavaScript Variables & Data Types",
    description:
      "Understanding var, let, const, and JavaScript data types in depth.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_003",
  },
  {
    _id: "vid_003b",
    title: "Functions & Scope",
    description:
      "Function declarations, expressions, arrow functions, and scope chains.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_003",
  },
  {
    _id: "vid_003c",
    title: "Async JavaScript: Promises & Async/Await",
    description: "Handle asynchronous operations like a pro.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_003",
  },

  // Module 004 videos (Inactive module - has mixed types but module is inactive)
  {
    _id: "vid_004a",
    title: "React Components & Props",
    description:
      "Creating functional and class components, passing props between them.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "demo",
    moduleId: "mod_004",
  },
  {
    _id: "vid_004b",
    title: "State Management with useState",
    description: "Managing component state using React's useState hook.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_004",
  },

  // Module 005 videos (Premium module)
  {
    _id: "vid_005a",
    title: "Introduction to Node.js",
    description: "What is Node.js and how to set up your first server.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "free",
    moduleId: "mod_005",
  },
  {
    _id: "vid_005b",
    title: "Express.js Routing & Middleware",
    description: "Building RESTful APIs with Express.js middleware.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_005",
  },
  {
    _id: "vid_005c",
    title: "MongoDB & Mongoose ODM",
    description: "Connecting your Node app to MongoDB and creating schemas.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_005",
  },
  {
    _id: "vid_005d",
    title: "Building a Full-Stack CRUD App",
    description:
      "Combine React + Node + MongoDB to build a complete application.",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "premium",
    moduleId: "mod_005",
  },
];

const VideoManagement = () => {
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: "",
    price: 0,
    isActive: true,
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    description: "",
    url: "",
    moduleId: "",
    videoType: "standard",
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modsRes, vidsRes] = await Promise.all([
        axios.get(`${UrlBackend}/video-module/admin/all`, {
          withCredentials: true,
        }),
        axios.get(`${UrlBackend}/video-content/admin/all`, {
          withCredentials: true,
        }),
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
      setModuleFormData({
        title: mod.title,
        description: mod.description || "",
        price: mod.price || 0,
        isActive: mod.isActive,
      });
    } else {
      setModuleFormData({
        title: "",
        description: "",
        price: 0,
        isActive: true,
      });
    }
    setIsModuleModalOpen(true);
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    if (!moduleFormData.title.trim()) return toast.error("Title is required");
    setActionLoading(true);
    try {
      if (editingModule) {
        await axios.put(
          `${UrlBackend}/video-module/admin/${editingModule._id}`,
          moduleFormData,
          { withCredentials: true },
        );
        toast.success("Module updated!");
      } else {
        await axios.post(
          `${UrlBackend}/video-module/admin/create`,
          moduleFormData,
          { withCredentials: true },
        );
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
    if (
      !window.confirm(
        "Delete this module and all its contents? (Videos inside might get orphaned)",
      )
    )
      return;
    try {
      await axios.delete(`${UrlBackend}/video-module/admin/${id}`, {
        withCredentials: true,
      });
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
      setVideoFormData({
        title: video.title,
        description: video.description || "",
        url: video.url,
        moduleId: video.moduleId || moduleId,
        videoType: video.videoType || "standard",
      });
    } else {
      setVideoFormData({
        title: "",
        description: "",
        url: "",
        moduleId: moduleId || (modules.length > 0 ? modules[0]._id : ""),
        videoType: "standard",
      });
    }
    setIsVideoModalOpen(true);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (
      !videoFormData.title.trim() ||
      !videoFormData.url.trim() ||
      !videoFormData.moduleId
    )
      return toast.error("Title, URL, and Module are required");
    setActionLoading(true);
    try {
      if (editingVideo) {
        await axios.patch(
          `${UrlBackend}/video-content/update/${editingVideo._id}`,
          videoFormData,
          { withCredentials: true },
        );
        toast.success("Video updated!");
      } else {
        await axios.post(`${UrlBackend}/video-content/create`, videoFormData, {
          withCredentials: true,
        });
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
      await axios.delete(`${UrlBackend}/video-content/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Video deleted");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <DashboardLoader />;

  videosData.forEach((item) => {
    if (!videos.some((v) => item._id === v._id)) videos.push(item);
  });
  modulesData.forEach((item) => {
    if (!modules.some((m) => item._id === m._id)) modules.push(item);
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 md:py">
      <Container className="space-y-10">
        {/* ── Header ── */}
        <div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 lg:gap-8
                bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Background Accent */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-emerald-500 rounded-full blur-[100px] -mr-12 -mt-12" />
          </div>

          <div className="relative z-10 flex-1">
            <span className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-1.5 mb-1.5">
              <Film size={12} /> Programming Hero Style Modules
            </span>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
              <Folder className="text-emerald-400 w-6 h-6 md:w-7 md:h-7" />
              Manage <span className="text-emerald-400">Curriculum</span>
            </h1>

            <p className="text-slate-400 font-medium text-xs md:text-sm mt-1.5 leading-relaxed">
              Create modules, set their prices, and add videos inside them.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 self-end lg:self-center mt-4 lg:mt-0">
            <button
              onClick={fetchData}
              className="p-3 md:p-4 bg-white/5 hover:bg-white/10 font-medium border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw size={17} />
            </button>

            <button
              onClick={() => openModuleModal()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                 px-5 py-3 md:py-3.5 rounded-2xl font-black uppercase tracking-widest
                 text-[10px] md:text-xs flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <FolderPlus size={17} />
              <span>New Module</span>
            </button>
          </div>
        </div>

        {/* ── Modules List ── */}
        {modules.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="No Modules Created"
            message="Create your first module to start adding videos."
            buttonText="Create Module"
            onButtonClick={() => openModuleModal()}
          />
        ) : (
          modules.map((mod) => {
            const moduleVideos = videos.filter((v) => v.moduleId === mod._id);

            return (
              <div
                key={mod._id}
                className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-6 lg:p-10"
              >
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6 mb-8 border-b border-slate-700/50 pb-6">
                  {/* Left Side - Info */}
                  <div className="flex items-start gap-3.5 w-full lg:w-auto">
                    <div
                      className={`p-3 rounded-2xl shadow-md flex-shrink-0 ${
                        mod.price > 0
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                          : "bg-gradient-to-br from-emerald-600 to-teal-600"
                      }`}
                    >
                      {mod.price > 0 ? <Crown size={20} /> : <Zap size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base md:text-lg lg:text-xl font-black uppercase tracking-tight">
                          {mod.title}
                        </h2>

                        {mod.price > 0 ? (
                          <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                            Premium · ৳{mod.price}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                            Free
                          </span>
                        )}

                        {!mod.isActive && (
                          <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                        {mod.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => openVideoModal(mod._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={13} />
                      <span className="hidden sm:inline">Add Video</span>
                      <span className="sm:hidden">Add</span>
                    </button>

                    <button
                      onClick={() => openModuleModal(mod)}
                      className="p-2.5 bg-slate-700 hover:bg-blue-600 rounded-2xl transition-all active:scale-95"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteModule(mod._id)}
                      className="p-2.5 bg-slate-700 hover:bg-red-600 rounded-2xl transition-all active:scale-95"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Videos Grid */}
                {[moduleVideos].length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <Video size={32} className="mx-auto text-slate-500 mb-2" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      No videos in this module
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                    {moduleVideos.map((video) => (
                      <div
                        key={video._id}
                        className="bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden group hover:border-slate-600 transition-all flex flex-col"
                      >
                        <div className="relative aspect-video bg-black/60 overflow-hidden">
                          {getYoutubeEmbedUrl(video.url) ? (
                            <iframe
                              src={getYoutubeEmbedUrl(video.url)}
                              title={video.title}
                              width="100%"
                              height="100%"
                              className="absolute top-0 left-0 border-0"
                              allowFullScreen
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Video size={24} className="text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="text-sm font-black text-slate-100 mb-1 uppercase tracking-tight line-clamp-1">
                            {video.title}
                          </h3>
                          {video.description && (
                            <p className="text-[10px] font-medium text-slate-500 mb-4 line-clamp-2">
                              {video.description}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openVideoModal(mod._id, video)}
                                className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video._id)}
                                className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                video.videoType === "demo"
                                  ? "bg-red-500/20 text-red-400"
                                  : video.videoType === "free"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : video.videoType === "premium"
                                      ? "bg-purple-500/20 text-purple-400"
                                      : "bg-slate-500/20 text-slate-400"
                              }`}
                            >
                              {video.videoType || "standard"}
                            </span>
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
      </Container>

      {/* ── Module Modal ── */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModuleModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
              {editingModule ? "Edit Module" : "Create Module"}
            </h3>
            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: Introduction"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500"
                  value={moduleFormData.title}
                  onChange={(e) =>
                    setModuleFormData({
                      ...moduleFormData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  placeholder="What will they learn?"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                  value={moduleFormData.description}
                  onChange={(e) =>
                    setModuleFormData({
                      ...moduleFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Price (৳) [0 = Free]
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-purple-500"
                  value={moduleFormData.price}
                  onChange={(e) =>
                    setModuleFormData({
                      ...moduleFormData,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-3 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moduleFormData.isActive}
                    onChange={(e) =>
                      setModuleFormData({
                        ...moduleFormData,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 bg-slate-800"
                  />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Active
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl mt-4 disabled:opacity-50"
              >
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
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
              {editingVideo ? "Edit Video" : "Add Video"}
            </h3>
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Module *
                </label>
                <select
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  value={videoFormData.moduleId}
                  onChange={(e) =>
                    setVideoFormData({
                      ...videoFormData,
                      moduleId: e.target.value,
                    })
                  }
                >
                  {modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setting up your store"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  value={videoFormData.title}
                  onChange={(e) =>
                    setVideoFormData({
                      ...videoFormData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  YouTube URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  value={videoFormData.url}
                  onChange={(e) =>
                    setVideoFormData({ ...videoFormData, url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Video Type *
                </label>
                <select
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  value={videoFormData.videoType}
                  onChange={(e) =>
                    setVideoFormData({
                      ...videoFormData,
                      videoType: e.target.value,
                    })
                  }
                >
                  <option value="standard">Standard</option>
                  <option value="demo">Demo</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              {previewUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-700/50">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={previewUrl}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                  value={videoFormData.description}
                  onChange={(e) =>
                    setVideoFormData({
                      ...videoFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl mt-4 disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Save Video"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoManagement;
