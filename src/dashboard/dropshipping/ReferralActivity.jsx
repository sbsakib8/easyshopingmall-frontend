"use client";

import useAdminTeamSystem from "@/src/hook/useAdminTeamSystem";
import { cn } from "@/src/utlis/utils";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Globe,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
  Video,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const translations = {
  bn: {
    title: "রেফারেল অ্যাক্টিভিটি",
    totalReferrals: "মোট রেফারেল",
    orderBonus: "অর্ডার রেফারেল বোনাস",
    courseBonus: "কোর্স রেফারেল বোনাস",
    totalBonus: "সর্বমোট রেফারেল বোনাস",
    totalOrders: "মোট অর্ডার",
    members: "রেফারেল সদস্য",
    searchPlaceholder: "সদস্যের নাম বা ইমেইল দিয়ে খুঁজুন...",
    noMembers: "কোনো সদস্য পাওয়া যায়নি",
    referral: "রেফারেল",
    bonus: "বোনাস",
    copyEmail: "ইমেইল কপি করুন",
    joined: "যোগদান",
    referrer: "রেফারার",
    orderBonusLabel: "অর্ডার বোনাস",
    courseBonusLabel: "কোর্স বোনাস",
    totalOrderLabel: "মোট অর্ডার",
    totalCourseLabel: "মোট কোর্স",
    prev: "আগের",
    next: "পরের",
    page: "পৃষ্ঠা",
    loading: "লোড হচ্ছে...",
    error: "তথ্য লোড হতে সমস্যা হয়েছে! দয়া করে পুনরায় চেষ্টা করুন!",
  },
  en: {
    title: "Referral Activity",
    totalReferrals: "Total Referrals",
    orderBonus: "Order Referral Bonus",
    courseBonus: "Course Referral Bonus",
    totalBonus: "Total Referral Bonus",
    totalOrders: "Total Orders",
    members: "Referred Members",
    searchPlaceholder: "Search by name or email...",
    noMembers: "No members found",
    referral: "Referral",
    bonus: "Bonus",
    copyEmail: "Copy email",
    joined: "Joined",
    referrer: "Referrer",
    orderBonusLabel: "Order Bonus",
    courseBonusLabel: "Course Bonus",
    totalOrderLabel: "Total Orders",
    totalCourseLabel: "Total Courses",
    prev: "Previous",
    next: "Next",
    page: "Page",
    loading: "Loading...",
    error: "Failed to load data! Please try again.",
  },
};

const formatBDT = (amount) => {
  if (amount == null) return "৳ 0";
  return (
    "৳ " +
    new Intl.NumberFormat("bn-BD", {
      minimumFractionDigits: 0,
    }).format(amount)
  );
};

const formatDateTime = (iso, lang) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
};

const LanguageToggle = ({ lang, setLang }) => (
  <button
    onClick={() => setLang(lang === "bn" ? "en" : "bn")}
    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all text-sm"
  >
    <Globe size={14} className="text-gray-400" />
    <span className={cn("font-medium", lang === "bn" ? "text-emerald-400" : "text-gray-400")}>বাং</span>
    <span className="text-gray-600">|</span>
    <span className={cn("font-medium", lang === "en" ? "text-emerald-400" : "text-gray-400")}>EN</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-5 flex flex-col gap-2 border border-gray-700">
    <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center", accent)}>
      <Icon size={18} className="text-white" />
    </div>
    <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase">{label}</p>
    <p className="text-xl sm:text-2xl font-bold text-white leading-none">{value}</p>
    <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10 bg-emerald-500" />
  </div>
);

const StatsGrid = ({ data, t }) => {
  const stats = [
    { icon: Users, label: t.totalReferrals, value: data.last30DaysSummary?.totalReferrals || 0, accent: "bg-emerald-500/10" },
    { icon: ShoppingBag, label: t.orderBonus, value: formatBDT(data.last30DaysSummary?.totalReferralBonus?.fromOrders || 0), accent: "bg-amber-500/10" },
    { icon: Video, label: t.courseBonus, value: formatBDT(data.last30DaysSummary?.totalReferralBonus?.fromCourses || 0), accent: "bg-purple-500/10" },
    { icon: TrendingUp, label: t.totalBonus, value: formatBDT(data.last30DaysSummary?.totalReferralBonus?.total || 0), accent: "bg-blue-500/10" },
    { icon: Wallet, label: t.totalOrders, value: data.last30DaysSummary?.totalOrder || 0, accent: "bg-cyan-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};

const MemberRow = ({ member, t, lang }) => {
  const [open, setOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(member.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all",
        open ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10" : "border-gray-700/50"
      )}
    >
      <div
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-900/70 hover:bg-white/[0.02] transition-colors duration-200 text-left cursor-pointer"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {member.name?.[0]?.toUpperCase() || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-white capitalize truncate">{member.name}</span>
            {member.referrerName && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30">
                {t.referral}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] sm:text-xs text-gray-500 truncate">{member.email}</p>
            <button
              onClick={(e) => { e.stopPropagation(); copyEmail(); }}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
              title={t.copyEmail}
            >
              {emailCopied ? (
                <CheckCircle size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-center text-right">
          <p className="text-xs font-bold text-emerald-400">{formatBDT(member.referralBonuses?.total || 0)}</p>
          <p className="text-[10px] text-gray-500">{t.bonus}</p>
        </div>

        <div className="ml-1 flex-shrink-0">
          {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-700/50">
          <div className="px-4 sm:px-5 py-4 bg-gray-800/50 flex flex-wrap gap-3">
            {[
              { label: t.joined, value: formatDateTime(member.joinedAt, lang) },
              { label: t.referrer, value: member.referrerName || "System" },
              { label: t.orderBonusLabel, value: formatBDT(member.referralBonuses?.fromOrders || 0) },
              { label: t.courseBonusLabel, value: formatBDT(member.referralBonuses?.fromCourses || 0) },
              { label: t.totalOrderLabel, value: `${member.totalOrder || 0}` },
              { label: t.totalCourseLabel, value: `${member.totalCourse || 0}` },
            ].map((chip, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 bg-gray-900/70 rounded-xl px-3.5 py-2.5 border border-gray-700/50 shadow-sm min-w-[110px]">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">{chip.label}</span>
                <span className="text-[11px] sm:text-xs font-bold text-white">{chip.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MembersSkeleton = () => (
  <div className="space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-24 rounded-2xl bg-gray-700/40 animate-pulse" />
    ))}
  </div>
);

const MembersSection = ({ t, lang }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [page, setPage] = useState(1);

  const [isLoading, data] = useAdminTeamSystem({ page, search: searchTerm });

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (data?.pagination?.totalPages || 1)) return;
    setPage(newPage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const pagination = data?.pagination;
  const members = data?.members || [];

  return (
    <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/50 bg-gray-800/50">
        <h2 className="text-sm sm:text-base font-bold text-white">
          {t.members} ({pagination?.totalItems || 0})
        </h2>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-gray-700/30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-black/20 border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white text-sm placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <MembersSkeleton />
        ) : members.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center border border-gray-700/50">
              <Users size={32} className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">{t.noMembers}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <MemberRow key={m._id} member={m} t={t} lang={lang} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-700/50 px-4 sm:px-6 py-4 bg-gray-800/20">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-sm font-medium text-white border border-gray-700"
          >
            <ChevronLeft size={16} /> {t.prev}
          </button>

          <div className="text-sm text-gray-400">
            {t.page} <span className="text-white font-semibold">{pagination.currentPage}</span> / {pagination.totalPages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-sm font-medium text-white border border-gray-700"
          >
            {t.next} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const LoadingState = ({ t }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
    <div className="max-w-7xl mx-auto py-6 sm:py-10 flex flex-col gap-5 sm:gap-6">
      <div className="h-8 w-48 bg-gray-700/40 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 sm:h-32 rounded-2xl bg-gray-700/40 animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-gray-700/40 animate-pulse" />
    </div>
  </div>
);

const ErrorState = ({ t }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
    <div className="max-w-7xl mx-auto py-20 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <XCircle size={28} className="text-red-400" />
      </div>
      <p className="text-sm text-red-400 font-medium">{t.error}</p>
    </div>
  </div>
);

export default function ReferralActivity() {
  const [lang, setLang] = useState("bn");
  const t = translations[lang];
  const [isLoading, data, error] = useAdminTeamSystem();

  if (isLoading) return <LoadingState t={t} />;
  if (error) return <ErrorState t={t} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.title}</h1>
              </div>
            </div>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid data={data} t={t} />

        {/* Members Section */}
        <div className="mt-8">
          <MembersSection t={t} lang={lang} />
        </div>
      </div>
    </div>
  );
}
