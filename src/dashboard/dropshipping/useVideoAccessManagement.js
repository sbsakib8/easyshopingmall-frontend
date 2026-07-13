import apiClient from "@/src/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export const statusColors = {
  pending:
    "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25",
  approved:
    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25",
  completed:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
  rejected:
    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
};

export const customRequestTypeLabels = {
  facebook_ad: "Facebook Ad Creative",
  tiktok_video: "TikTok Ad Video",
  youtube_short: "YouTube Short/Reel",
  unboxing: "Unboxing / UGC Video",
  other: "Custom / Special Video",
};

export const tabs = [
  {
    id: "premium_access",
    label: "Paid Video Payments",
    icon: "CreditCard",
  },
  {
    id: "custom_requests",
    label: "Custom Video Orders",
    icon: "Film",
  },
];

const useVideoAccessManagement = () => {
  const [activeTab, setActiveTab] = useState("premium_access");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const [customRequests, setCustomRequests] = useState([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [customSearchTerm, setCustomSearchTerm] = useState("");
  const [customFilterStatus, setCustomFilterStatus] = useState("all");
  const [deliveredUrlInput, setDeliveredUrlInput] = useState({});
  const [adminNoteInput, setAdminNoteInput] = useState({});

  const [actionConfirm, setActionConfirm] = useState({
    show: false,
    requestId: null,
    status: "",
    type: "access",
    message: "",
    deliveredVideoUrl: "",
    adminNote: "",
  });

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/video-access/all`);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to load video access requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCustomRequests = async () => {
    setLoadingCustom(true);
    try {
      const res = await apiClient.get(`/video-request/all`);
      if (res.data.success) {
        setCustomRequests(res.data.data);
        const delivered = {};
        const notes = {};
        res.data.data.forEach((req) => {
          delivered[req._id] = req.deliveredVideoUrl || "";
          notes[req._id] = req.adminNote || "";
        });
        setDeliveredUrlInput(delivered);
        setAdminNoteInput(notes);
      }
    } catch (error) {
      console.error("Failed to fetch custom video requests", error);
      toast.error("Failed to load custom video requests");
    } finally {
      setLoadingCustom(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    fetchAllCustomRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.senderNumber?.includes(searchTerm) ||
        req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, filterStatus]);

  const filteredCustomRequests = useMemo(() => {
    return customRequests.filter((req) => {
      const matchesSearch =
        req.userId?.name
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase()) ||
        req.userId?.email
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase()) ||
        req.productId?.productName
          ?.toLowerCase()
          .includes(customSearchTerm.toLowerCase());

      const matchesStatus =
        customFilterStatus === "all" || req.status === customFilterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customRequests, customSearchTerm, customFilterStatus]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const revenue = requests
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { total, pending, approved, revenue };
  }, [requests]);

  const customStats = useMemo(() => {
    const total = customRequests.length;
    const pending = customRequests.filter((r) => r.status === "pending").length;
    const completed = customRequests.filter(
      (r) => r.status === "completed",
    ).length;

    return { total, pending, completed };
  }, [customRequests]);

  const triggerUpdateStatus = (requestId, status) => {
    const message =
      status === "approved"
        ? "Approve this payment and grant video access?"
        : "Reject this payment request?";

    setActionConfirm({
      show: true,
      requestId,
      status,
      type: "access",
      message,
      deliveredVideoUrl: "",
      adminNote: adminNote,
    });
  };

  const executeUpdateStatus = async () => {
    const { requestId, status, adminNote: note } = actionConfirm;
    setActionConfirm((prev) => ({ ...prev, show: false }));
    setActionLoading(true);
    try {
      const res = await apiClient.patch(
        `/video-access/update/${requestId}`,
        { status, adminNote: note || adminNote },
      );

      if (res.data.success) {
        toast.success(`Request ${status} successfully`);
        setAdminNote("");
        fetchAllRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setActionLoading(false);
    }
  };

  const triggerUpdateCustomRequest = (requestId, status) => {
    const note = adminNoteInput[requestId] || "";
    const deliveredUrl = deliveredUrlInput[requestId] || "";

    if (status === "completed" && !deliveredUrl) {
      toast.error("Delivered Video URL is required when marking completed!");
      return;
    }

    const message = `Are you sure you want to mark this custom video request as ${status}?`;
    setActionConfirm({
      show: true,
      requestId,
      status,
      type: "custom",
      message,
      deliveredVideoUrl: deliveredUrl,
      adminNote: note,
    });
  };

  const executeUpdateCustomRequest = async () => {
    const {
      requestId,
      status,
      adminNote: note,
      deliveredVideoUrl: deliveredUrl,
    } = actionConfirm;
    setActionConfirm((prev) => ({ ...prev, show: false }));
    setActionLoading(true);
    try {
      const res = await apiClient.patch(
        `/video-request/update/${requestId}`,
        {
          status,
          adminNote: note,
          deliveredVideoUrl: deliveredUrl,
        },
      );

      if (res.data.success) {
        toast.success(`Custom video request ${status}! ✅`);
        fetchAllCustomRequests();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update custom video request",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = () => {
    if (actionConfirm.type === "access") {
      executeUpdateStatus();
    } else {
      executeUpdateCustomRequest();
    }
  };

  return {
    activeTab,
    setActiveTab,
    requests,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    actionLoading,
    adminNote,
    setAdminNote,
    customRequests,
    loadingCustom,
    customSearchTerm,
    setCustomSearchTerm,
    customFilterStatus,
    setCustomFilterStatus,
    deliveredUrlInput,
    setDeliveredUrlInput,
    adminNoteInput,
    setAdminNoteInput,
    actionConfirm,
    setActionConfirm,
    filteredRequests,
    filteredCustomRequests,
    stats,
    customStats,
    triggerUpdateStatus,
    triggerUpdateCustomRequest,
    handleConfirm,
    fetchAllCustomRequests,
  };
};

export default useVideoAccessManagement;
