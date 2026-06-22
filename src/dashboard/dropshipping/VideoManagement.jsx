"use client";

import { cn } from "@/src/utlis/utils";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Film,
  Folder,
  FolderPlus,
  Layers,
  PlayCircle,
  Plus,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import useVideoManagement from "./useVideoManagement";
import EmptyState from "./EmptyState";
import CourseForm from "./CourseForm";
import ModuleForm from "./ModuleForm";
import VideoForm from "./VideoForm";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";

const SidebarSkeleton = () => (
  <div className="w-full md:w-70 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col md:h-full">
    <div className="p-5 border-b border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-slate-800 rounded-md animate-pulse" />
          <div className="w-7 h-7 bg-slate-800 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
    <div className="flex-1 p-3 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center gap-2 p-2">
            <div className="w-4 h-4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="ml-6 pl-2 space-y-1">
            <div className="flex items-center gap-2 p-1">
              <div className="w-3 h-3 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="ml-5 space-y-0.5">
              <div className="flex items-center gap-2 p-1">
                <div className="w-2 h-2 bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-20 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VideoManagement = () => {
  const { canModify } = useDashboardPermission();
  const {
    courses,
    modules,
    videos,
    loading,
    expandedCourses,
    expandedModules,
    toggleCourse,
    toggleModule,
    selectedItem,
    selectItem,
    actionLoading,
    courseType,
    setCourseType,
    courseFormData,
    setCourseFormData,
    moduleFormData,
    setModuleFormData,
    videoFormData,
    setVideoFormData,
    previewUrl,
    deleteConfirm,
    setDeleteConfirm,
    handleCourseSubmit,
    handleModuleSubmit,
    handleVideoSubmit,
    handleDeleteAction,
    fetchData,
  } = useVideoManagement();

  return (
    <section className="md:h-[calc(100dvh-4rem)] bg-slate-950 flex flex-col md:flex-row text-slate-300 font-sans overflow-hidden">
      {/* Left Sidebar (Tree View) */}
      {loading ? (
        <SidebarSkeleton />
      ) : (
        <div className="w-full md:w-70 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col md:h-full md:overflow-hidden md:flex-shrink-0">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between md:sticky md:top-0 md:z-10">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <Folder className="text-blue-500" size={16} /> Curriculum
            </h2>
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors"
              >
                <RefreshCw size={14} />
              </button>
              {canModify("dropshipping") && (
              <button
                onClick={() => selectItem("new_course")}
                className="p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-md transition-colors"
              >
                <Plus size={14} />
              </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {courses.map((course) => {
              const courseModules = modules.filter(
                (m) => String(m.courseId) === String(course._id),
              );
              const isCourseExpanded = expandedCourses[course._id];
              const isCourseSelected =
                selectedItem?.data?._id &&
                String(selectedItem.data._id) === String(course._id);

              return (
                <div key={course._id} className="select-none">
                  <div
                    className={`flex items-center group rounded-lg transition-colors ${isCourseSelected ? "bg-blue-500/10 border border-blue-500/30" : "hover:bg-slate-800 border border-transparent"}`}
                  >
                    <button
                      onClick={() => toggleCourse(course._id)}
                      className="p-2 text-slate-500 hover:text-slate-300"
                    >
                      {isCourseExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                    <div
                      onClick={() => selectItem("course", course)}
                      className="flex-1 p-2 pl-0 flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen
                        size={14}
                        className={
                          isCourseSelected ? "text-blue-400" : "text-slate-500"
                        }
                      />
                      <span
                        className={`text-sm font-semibold ${isCourseSelected ? "text-blue-100" : "text-slate-300"} truncate`}
                      >
                        {course.title}
                      </span>
                    </div>
                      {canModify("dropshipping") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectItem("new_module", null, course._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-blue-400 transition-opacity"
                      >
                        <PlusCircle size={14} />
                      </button>
                      )}
                  </div>

                  {isCourseExpanded && (
                    <div className="ml-5 pl-3 border-l border-slate-800 space-y-1 mt-1">
                      {courseModules.map((mod) => {
                        const moduleVideos = videos.filter(
                          (v) =>
                            v.moduleId &&
                            String(v.moduleId) === String(mod._id),
                        );
                        const isModExpanded = expandedModules[String(mod._id)];
                        const isModSelected =
                          selectedItem?.data?._id &&
                          String(selectedItem.data._id) === String(mod._id);

                        return (
                          <div key={mod._id}>
                            <div
                              className={`flex items-center group rounded-lg transition-colors ${isModSelected ? "bg-purple-500/10 border border-purple-500/30" : "hover:bg-slate-800 border border-transparent"}`}
                            >
                              <button
                                onClick={() => toggleModule(mod._id)}
                                className="p-1.5 text-slate-500 hover:text-slate-300"
                              >
                                {isModExpanded ? (
                                  <ChevronDown size={12} />
                                ) : (
                                  <ChevronRight size={12} />
                                )}
                              </button>
                              <div
                                onClick={() => selectItem("module", mod)}
                                className="flex-1 p-1.5 pl-0 flex items-center gap-2 cursor-pointer"
                              >
                                <Layers
                                  size={12}
                                  className={
                                    isModSelected
                                      ? "text-purple-400"
                                      : "text-slate-500"
                                  }
                                />
                                <span
                                  className={`text-xs font-medium ${isModSelected ? "text-purple-100" : "text-slate-400"} truncate`}
                                >
                                  {mod.title}
                                </span>
                              </div>
                              {canModify("dropshipping") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectItem("new_video", null, mod._id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-purple-400 transition-opacity"
                              >
                                <PlusCircle size={12} />
                              </button>
                              )}
                            </div>

                            {isModExpanded && (
                              <div className="ml-4 pl-3 border-l border-slate-800/50 space-y-0.5 mt-0.5 mb-1">
                                {moduleVideos.map((video) => {
                                  const isVidSelected =
                                    selectedItem?.data?._id &&
                                    String(selectedItem.data._id) ===
                                      String(video._id);
                                  return (
                                    <div
                                      key={video._id}
                                      onClick={() => selectItem("video", video)}
                                      className={`flex items-center gap-2 p-1.5 pl-3 cursor-pointer group rounded-md transition-colors ${isVidSelected ? "bg-emerald-500/10 text-emerald-300" : "hover:bg-slate-800 text-slate-500"}`}
                                    >
                                      <PlayCircle
                                        size={10}
                                        className={
                                          isVidSelected
                                            ? "text-emerald-400"
                                            : "group-hover:text-emerald-500"
                                        }
                                      />
                                      <span className="text-[11px] truncate flex-1">
                                        {video.title}
                                      </span>
                                    </div>
                                  );
                                })}
                                {moduleVideos.length === 0 && (
                                  <div className="text-[10px] text-slate-600 pl-3 py-1 italic">
                                    No videos
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {courseModules.length === 0 && (
                        <div className="text-xs text-slate-600 pl-3 py-1 italic">
                          No modules
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standalone Videos Section */}
            {(() => {
              const moduleIdStrings = new Set(
                modules.map((m) => String(m._id)),
              );
              const standalone = videos.filter((v) => {
                if (!v.moduleId) return true;
                return !moduleIdStrings.has(String(v.moduleId));
              });

              return (
                <div className="mt-6 border-t border-slate-800/60 pt-4 pb-2">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Film size={12} className="text-emerald-500" /> Standalone
                      / Promo
                    </h3>
                    <button
                      onClick={() => selectItem("new_video", null, null)}
                      className="p-1 text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors"
                      title="Add Standalone Video"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <div className="space-y-0.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    {standalone.map((video) => {
                      const isVidSelected =
                        selectedItem?.data?._id &&
                        String(selectedItem.data._id) === String(video._id);
                      return (
                        <div
                          key={video._id}
                          onClick={() => selectItem("video", video)}
                          className={`flex items-center gap-2 p-1.5 pl-3 cursor-pointer group rounded-md transition-colors ${isVidSelected ? "bg-emerald-500/10 text-emerald-300" : "hover:bg-slate-800 text-slate-500"}`}
                        >
                          <PlayCircle
                            size={10}
                            className={
                              isVidSelected
                                ? "text-emerald-400"
                                : "group-hover:text-emerald-500"
                            }
                          />
                          <span className="text-[11px] truncate flex-1">
                            {video.title}
                          </span>
                          <span
                            className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                              video.videoType === "demo"
                                ? "bg-red-500/20 text-red-400"
                                : video.videoType === "standard"
                                  ? "bg-sky-500/20 text-sky-400"
                                  : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {video.videoType}
                          </span>
                        </div>
                      );
                    })}
                    {standalone.length === 0 && (
                      <div className="text-[10px] text-slate-600 pl-3 py-1 italic">
                        No standalone videos
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Right Workspace */}
      <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        {!selectedItem ? (
          <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col items-center justify-center opacity-70 pointer-events-none text-slate-300 gap-4">
            <FolderPlus size={64} />
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold tracking-widest uppercase">
                Select an Item
              </h2>
              <p className="text-sm mt-2">
                Click on a course, module, or video from the sidebar to edit it.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                  {selectedItem.type.replace("_", " ")} Settings
                </span>
                <h1 className="text-xl lg:text-2xl font-black text-white">
                  {selectedItem.data
                    ? selectedItem.data.title
                    : `Create New ${selectedItem.type.split("_")[1]}`}
                </h1>
              </div>
              {selectedItem.data && canModify("dropshipping") && (
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      show: true,
                      type: selectedItem.type,
                      id: selectedItem.data._id,
                    })
                  }
                  className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {(selectedItem.type === "course" ||
              selectedItem.type === "new_course") && (
              <CourseForm
                courseType={courseType}
                setCourseType={setCourseType}
                courseFormData={courseFormData}
                setCourseFormData={setCourseFormData}
                onSubmit={handleCourseSubmit}
                actionLoading={actionLoading}
              />
            )}

            {(selectedItem.type === "module" ||
              selectedItem.type === "new_module") && (
              <ModuleForm
                moduleFormData={moduleFormData}
                setModuleFormData={setModuleFormData}
                courses={courses}
                onSubmit={handleModuleSubmit}
                actionLoading={actionLoading}
              />
            )}

            {(selectedItem.type === "video" ||
              selectedItem.type === "new_video") && (
              <VideoForm
                videoFormData={videoFormData}
                setVideoFormData={setVideoFormData}
                previewUrl={previewUrl}
                modules={modules}
                courses={courses}
                onSubmit={handleVideoSubmit}
                actionLoading={actionLoading}
              />
            )}
          </div>
        )}
      </div>

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-md w-full p-6 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={28} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Delete {deleteConfirm.type}?
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Are you sure you want to permanently delete this{" "}
                {deleteConfirm.type}? This action is irreversible and will
                remove all associated content.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirm({ show: false, type: "", id: "" })
                }
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
    </section>
  );
};

export default VideoManagement;
