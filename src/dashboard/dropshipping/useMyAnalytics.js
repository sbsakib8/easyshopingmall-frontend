import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getMyDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";

const useMyAnalytics = () => {
  const data = useSelector((state) => state.user.data);
  const [dsAnalytics, setDsAnalytics] = useState(null);
  const [dsLoading, setDsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [referralTab, setReferralTab] = useState("partners");

  const fetchDSAnalytics = async () => {
    setDsLoading(true);
    try {
      let startDate, endDate;
      if (timeRange === "custom") {
        startDate = customDates.start
          ? new Date(customDates.start).toISOString()
          : null;
        endDate = customDates.end
          ? new Date(customDates.end).toISOString()
          : null;
      } else if (timeRange !== "all") {
        endDate = new Date().toISOString();
        const start = new Date();
        start.setDate(start.getDate() - (timeRange === "7d" ? 7 : 30));
        startDate = start.toISOString();
      }

      const res = await getMyDropshippingAnalytics(startDate, endDate);
      if (res.success) {
        setDsAnalytics(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch DS analytics", error);
    } finally {
      setDsLoading(false);
    }
  };

  useEffect(() => {
    if (
      data?._id &&
      (data?.role === "DROPSHIPPING" || data?.roles?.includes("DROPSHIPPING"))
    ) {
      if (timeRange !== "custom" || (customDates.start && customDates.end)) {
        fetchDSAnalytics();
      }
    }
  }, [data?._id, timeRange, customDates]);

  const videoBonusStats = useMemo(() => {
    if (!dsAnalytics?.videoReferrals) return { approved: 0, pending: 0 };
    return dsAnalytics.videoReferrals.reduce(
      (acc, ref) => {
        if (ref.status === "approved") acc.approved += ref.bonusAmount || 0;
        else if (ref.status === "pending") acc.pending += ref.bonusAmount || 0;
        return acc;
      },
      { approved: 0, pending: 0 },
    );
  }, [dsAnalytics?.videoReferrals]);

  const trendData = useMemo(() => {
    const transactions = dsAnalytics?.transactions || [];
    const videoReferrals = dsAnalytics?.videoReferrals || [];

    const groups = transactions.reduce((acc, tx) => {
      const date = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = 0;
      acc[date] += tx.amount;
      return acc;
    }, {});

    videoReferrals.forEach((ref) => {
      if (ref.status === "approved") {
        const date = new Date(ref.createdAt || ref.date).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        );
        if (!groups[date]) groups[date] = 0;
        groups[date] += ref.bonusAmount || 0;
      }
    });

    return Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value,
        rawDate: new Date(name + ", " + new Date().getFullYear()),
      }))
      .sort((a, b) => a.rawDate - b.rawDate)
      .map(({ name, value }) => ({ name, value }));
  }, [dsAnalytics?.transactions, dsAnalytics?.videoReferrals]);

  const pipelineData = useMemo(() => {
    if (!dsAnalytics?.orderPipeline) return [];
    return Object.entries(dsAnalytics.orderPipeline)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [dsAnalytics?.orderPipeline]);

  return {
    data,
    dsAnalytics,
    dsLoading,
    timeRange,
    setTimeRange,
    customDates,
    setCustomDates,
    referralTab,
    setReferralTab,
    videoBonusStats,
    trendData,
    pipelineData,
  };
};

export default useMyAnalytics;
