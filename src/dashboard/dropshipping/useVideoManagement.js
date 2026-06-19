"use client";

import { UrlBackend } from "@/src/confic/urlExport";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getYoutubeEmbedUrl,
  STANDALONE_VIDEO_TYPES,
  isModuleFree,
  resolveVideoTypeForModule,
} from "./videoManagementHelpers";

export default function useVideoManagement() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedCourses, setExpandedCourses] = useState({});
  const [expandedModules, setExpandedModules] = useState({});

  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [courseType, setCourseType] = useState("free");
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    price: 0,
    discountPrice: 0,
    referralBonus: 0,
    isActive: true,
  });
  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: "",
    price: 0,
    courseId: "",
    isActive: true,
  });
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    description: "",
    url: "",
    moduleId: "",
    videoType: "standard",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    type: "",
    id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, modsRes, vidsRes] = await Promise.all([
        axios.get(`${UrlBackend}/video-course/admin/all`, {
          withCredentials: true,
        }),
        axios.get(`${UrlBackend}/video-module/admin/all`, {
          withCredentials: true,
        }),
        axios.get(`${UrlBackend}/video-content/admin/all`, {
          withCredentials: true,
        }),
      ]);
      if (coursesRes.data.success) {
        const sorted = [...coursesRes.data.data].sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(a.createdAt) - new Date(b.createdAt);
          return (a._id || "").localeCompare(b._id || "");
        });
        setCourses(sorted);
      }
      if (modsRes.data.success) {
        const sorted = [...modsRes.data.data].sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(a.createdAt) - new Date(b.createdAt);
          return (a._id || "").localeCompare(b._id || "");
        });
        setModules(sorted);
      }
      if (vidsRes.data.success) {
        const sorted = [...vidsRes.data.data].sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(a.createdAt) - new Date(b.createdAt);
          return (a._id || "").localeCompare(b._id || "");
        });
        setVideos(sorted);
      }
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

  const toggleCourse = (id) =>
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleModule = (id) =>
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectItem = (type, data, parentId = null) => {
    setSelectedItem({ type, data, parentId });
    if (type === "course") {
      setCourseFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || 0,
        referralBonus: data.referralBonus || 0,
        isActive: data.isActive,
      });
      setCourseType(data.price > 0 ? "paid" : "free");
    } else if (type === "new_course") {
      setCourseFormData({
        title: "",
        description: "",
        price: 0,
        discountPrice: 0,
        referralBonus: 0,
        isActive: true,
      });
      setCourseType("free");
    } else if (type === "module") {
      setModuleFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        courseId: data.courseId,
        isActive: data.isActive,
      });
    } else if (type === "new_module") {
      setModuleFormData({
        title: "",
        description: "",
        price: 0,
        courseId: parentId || "",
        isActive: true,
      });
    } else if (type === "video") {
      const initialModId = data.moduleId || "";
      const normalizedVideoType = resolveVideoTypeForModule(
        data.videoType || "standard",
        initialModId,
        modules,
        courses,
      );
      setVideoFormData({
        title: data.title,
        description: data.description,
        url: data.url,
        moduleId: initialModId,
        videoType: normalizedVideoType,
      });
    } else if (type === "new_video") {
      const initialModId = parentId || "";
      const initialVideoType = resolveVideoTypeForModule(
        "standard",
        initialModId,
        modules,
        courses,
      );
      setVideoFormData({
        title: "",
        description: "",
        url: "",
        moduleId: initialModId,
        videoType: initialVideoType,
      });
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (selectedItem.type === "course") {
        await axios.put(
          `${UrlBackend}/video-course/admin/${selectedItem.data._id}`,
          courseFormData,
          { withCredentials: true },
        );
        toast.success("Course updated");
      } else {
        await axios.post(
          `${UrlBackend}/video-course/admin/create`,
          courseFormData,
          { withCredentials: true },
        );
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
      if (selectedItem.type === "module") {
        await axios.put(
          `${UrlBackend}/video-module/admin/${selectedItem.data._id}`,
          moduleFormData,
          { withCredentials: true },
        );
        toast.success("Module updated");
      } else {
        await axios.post(
          `${UrlBackend}/video-module/admin/create`,
          moduleFormData,
          { withCredentials: true },
        );
        toast.success("Module created");
        setExpandedCourses((prev) => ({
          ...prev,
          [moduleFormData.courseId]: true,
        }));
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
      if (!payload.moduleId) {
        if (!STANDALONE_VIDEO_TYPES.has(payload.videoType)) {
          toast.error("Standalone videos must be 'standard' or 'demo'.");
          setActionLoading(false);
          return;
        }
        delete payload.moduleId;
      } else {
        const freeModule = isModuleFree(payload.moduleId, modules, courses);
        if (freeModule && payload.videoType !== "free") {
          toast.error("Free course modules can only hold 'free' videos.");
          setActionLoading(false);
          return;
        }
        if (!freeModule && payload.videoType !== "premium") {
          toast.error("Premium course modules can only hold 'premium' videos.");
          setActionLoading(false);
          return;
        }
      }
      if (selectedItem.type === "video") {
        await axios.patch(
          `${UrlBackend}/video-content/update/${selectedItem.data._id}`,
          payload,
          { withCredentials: true },
        );
        toast.success("Video updated");
      } else {
        await axios.post(`${UrlBackend}/video-content/create`, payload, {
          withCredentials: true,
        });
        toast.success("Video added");
        if (payload.moduleId) {
          setExpandedModules((prev) => ({ ...prev, [payload.moduleId]: true }));
        }
      }
      await fetchData();
      setSelectedItem(null);
    } catch (error) {
      const message = error?.response?.data?.message || "Operation failed";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAction = async (type, id) => {
    try {
      if (type === "course")
        await axios.delete(`${UrlBackend}/video-course/admin/${id}`, {
          withCredentials: true,
        });
      else if (type === "module")
        await axios.delete(`${UrlBackend}/video-module/admin/${id}`, {
          withCredentials: true,
        });
      else if (type === "video")
        await axios.delete(`${UrlBackend}/video-content/delete/${id}`, {
          withCredentials: true,
        });

      toast.success(`${type} deleted`);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return {
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
  };
}
