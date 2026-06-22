"use client";

import apiClient from "@/src/lib/axios";
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
        apiClient.get(`/video-course/admin/all`),
        apiClient.get(`/video-module/admin/all`),
        apiClient.get(`/video-content/admin/all`),
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
        await apiClient.put(
          `/video-course/admin/${selectedItem.data._id}`,
          courseFormData,
        );
        toast.success("Course updated");
      } else {
        await apiClient.post(
          `/video-course/admin/create`,
          courseFormData,
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
        await apiClient.put(
          `/video-module/admin/${selectedItem.data._id}`,
          moduleFormData,
        );
        toast.success("Module updated");
      } else {
        await apiClient.post(
          `/video-module/admin/create`,
          moduleFormData,
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
        await apiClient.patch(
          `/video-content/update/${selectedItem.data._id}`,
          payload,
        );
        toast.success("Video updated");
      } else {
        await apiClient.post(`/video-content/create`, payload);
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
        await apiClient.delete(`/video-course/admin/${id}`);
      else if (type === "module")
        await apiClient.delete(`/video-module/admin/${id}`);
      else if (type === "video")
        await apiClient.delete(`/video-content/delete/${id}`);

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
