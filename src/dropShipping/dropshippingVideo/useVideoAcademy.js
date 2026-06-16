"use client";

import { UrlBackend } from "@/src/confic/urlExport";
import { WebsiteinfoAllGet } from "@/src/hook/content/useWebsiteInfo";
import { ProductAllGet } from "@/src/hook/useProduct";
import { useGetUser } from "@/src/utlis/useGetuser";
import axios from "axios";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export const useVideoAcademy = () => {
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
  const [newRequestData, setNewRequestData] = useState({
    productId: "",
    productName: "",
    productImage: "",
    videoType: "facebook_ad",
    notes: "",
  });
  const [premiumVideoPrice, setPremiumVideoPrice] = useState(500);
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "Bkash",
    transactionId: "",
    senderNumber: "",
    amount: 500,
  });

  const activeCourse = useMemo(
    () => courses.find((c) => c._id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const activeCourseModules = useMemo(
    () => modules.filter((m) => m.courseId === selectedCourseId),
    [modules, selectedCourseId],
  );

  const premiumStatus = useMemo(() => {
    if (!selectedCourseId) return "none";
    const courseReqs = accessRequests.filter(
      (req) => req.courseId === selectedCourseId,
    );
    if (courseReqs.length === 0) return "none";
    if (courseReqs.some((r) => r.status === "approved")) return "approved";
    if (courseReqs.some((r) => r.status === "pending")) return "pending";
    if (courseReqs.some((r) => r.status === "rejected")) return "rejected";
    return courseReqs[0].status || "none";
  }, [accessRequests, selectedCourseId]);

  const isCoursePremium = activeCourse?.price > 0;
  const isCourseLocked = isCoursePremium && premiumStatus !== "approved";
  const isVideoLocked =
    isCourseLocked &&
    activeVideo &&
    (activeVideo.videoType === "premium" ||
      activeVideo.videoType === "standard" ||
      !activeVideo.videoType);

  const currentCoursePrice = useMemo(() => {
    if (!activeCourse) return premiumVideoPrice;
    return activeCourse.discountPrice > 0
      ? activeCourse.discountPrice
      : activeCourse.price;
  }, [activeCourse, premiumVideoPrice]);

  const demoVideo = useMemo(
    () => videos.find((v) => v.videoType === "demo" && !v.moduleId),
    [videos],
  );

  const freeVideos = useMemo(
    () => videos.filter((v) => !v.moduleId),
    [videos],
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 10);
    return products
      .filter((p) =>
        p.productName?.toLowerCase().includes(productSearch.toLowerCase()),
      )
      .slice(0, 10);
  }, [products, productSearch]);

  const customRequestTypeLabels = useMemo(
    () => ({
      facebook_ad: "Facebook Ad Creative",
      tiktok_video: "TikTok Ad Video",
      youtube_short: "YouTube Short/Reel",
      unboxing: "Unboxing / UGC Video",
      other: "Custom / Special Video",
    }),
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        accessResult,
        videosResult,
        coursesResult,
        modulesResult,
        websiteInfoResult,
      ] = await Promise.allSettled([
        axios.get(`${UrlBackend}/video-access/my-access`, {
          withCredentials: true,
        }),
        axios.get(`${UrlBackend}/video-content/all`, { withCredentials: true }),
        axios.get(`${UrlBackend}/video-course/all`, { withCredentials: true }),
        axios.get(`${UrlBackend}/video-module/all`, { withCredentials: true }),
        WebsiteinfoAllGet(),
      ]);
      if (
        accessResult.status === "fulfilled" &&
        accessResult.value.data.success
      )
        setAccessRequests(accessResult.value.data.data);
      if (
        videosResult.status === "fulfilled" &&
        videosResult.value.data.success
      ) {
        const sorted = [...videosResult.value.data.data].sort((a, b) => {
          if (a.createdAt && b.createdAt)
            return new Date(a.createdAt) - new Date(b.createdAt);
          return (a._id || "").localeCompare(b._id || "");
        });
        setVideos(sorted);
      }
      if (
        coursesResult.status === "fulfilled" &&
        coursesResult.value.data.success
      ) {
        const sortedCourses = [...coursesResult.value.data.data].sort(
          (a, b) => {
            if (a.createdAt && b.createdAt)
              return new Date(a.createdAt) - new Date(b.createdAt);
            return (a._id || "").localeCompare(b._id || "");
          },
        );
        setCourses(sortedCourses);
      }
      if (
        modulesResult.status === "fulfilled" &&
        modulesResult.value.data.success
      )
        setModules(
          [...modulesResult.value.data.data].sort((a, b) => {
            if (a.createdAt && b.createdAt)
              return new Date(a.createdAt) - new Date(b.createdAt);
            return (a._id || "").localeCompare(b._id || "");
          }),
        );
      if (websiteInfoResult.status === "fulfilled") {
        const info =
          websiteInfoResult.value.websiteinfo?.[0] ||
          websiteInfoResult.value.data?.[0];
        if (info && info.premiumVideoPrice) {
          setPremiumVideoPrice(info.premiumVideoPrice);
          setPaymentData((prev) => ({
            ...prev,
            amount: info.premiumVideoPrice,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await axios.get(`${UrlBackend}/video-request/my-requests`, {
        withCredentials: true,
      });
      if (res.data.success) setMyRequests(res.data.data);
    } catch (error) {
      console.error("Failed to fetch video requests", error);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await ProductAllGet({ limit: 150 });
      if (res.success) setProducts(res.data || res.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchRequests();
    fetchProducts();
  }, [fetchData, fetchRequests, fetchProducts]);

  const handleCourseSelect = useCallback(
    (courseId) => {
      setSelectedCourseId(courseId);
      const courseModules = modules.filter((m) => m.courseId === courseId);
      if (courseModules.length > 0) {
        setExpandedModules({ [courseModules[0]._id]: true });
        const firstModVideos = videos.filter(
          (v) =>
            v.moduleId?._id === courseModules[0]._id ||
            v.moduleId === courseModules[0]._id,
        );
        setActiveVideo(firstModVideos.length > 0 ? firstModVideos[0] : null);
      } else {
        setActiveVideo(null);
      }
    },
    [modules, videos],
  );

  const toggleModule = useCallback(
    (mod) =>
      setExpandedModules((prev) => ({ ...prev, [mod]: !prev[mod] })),
    [],
  );

  const handleSubmitPayment = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const res = await axios.post(
          `${UrlBackend}/video-access/create`,
          {
            ...paymentData,
            amount: currentCoursePrice,
            videoType: "premium_training",
            courseId: selectedCourseId,
          },
          { withCredentials: true },
        );
        if (res.data.success) {
          toast.success("Payment submitted! Waiting for admin approval.");
          fetchData();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to submit payment",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [paymentData, currentCoursePrice, selectedCourseId, fetchData],
  );

  const handleSubmitCustomRequest = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newRequestData.productId) {
        toast.error("Please select a product from the list");
        return;
      }
      setRequestSubmitLoading(true);
      try {
        const res = await axios.post(
          `${UrlBackend}/video-request/create`,
          {
            productId: newRequestData.productId,
            videoType: newRequestData.videoType,
            notes: newRequestData.notes,
          },
          { withCredentials: true },
        );
        if (res.data.success) {
          toast.success("Ad creative request submitted!");
          setNewRequestData({
            productId: "",
            productName: "",
            productImage: "",
            videoType: "facebook_ad",
            notes: "",
          });
          setProductSearch("");
          fetchRequests();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to submit request",
        );
      } finally {
        setRequestSubmitLoading(false);
      }
    },
    [newRequestData, fetchRequests],
  );

  return {
    user,
    activeTab,
    setActiveTab,
    accessRequests,
    videos,
    courses,
    modules,
    selectedCourseId,
    setSelectedCourseId,
    loading,
    submitting,
    myRequests,
    products,
    loadingRequests,
    requestSubmitLoading,
    productSearch,
    setProductSearch,
    showProductDropdown,
    setShowProductDropdown,
    newRequestData,
    setNewRequestData,
    premiumVideoPrice,
    activeVideo,
    setActiveVideo,
    expandedModules,
    paymentData,
    setPaymentData,
    activeCourse,
    activeCourseModules,
    premiumStatus,
    isCoursePremium,
    isCourseLocked,
    isVideoLocked,
    currentCoursePrice,
    demoVideo,
    freeVideos,
    filteredProducts,
    customRequestTypeLabels,
    handleCourseSelect,
    toggleModule,
    handleSubmitPayment,
    handleSubmitCustomRequest,
    fetchData,
    fetchRequests,
  };
};
