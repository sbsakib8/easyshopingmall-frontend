"use client";

import Container from "@/src/compronent/shared/Container";
import useTeamSystemData from "@/src/hook/useTeamSystemData";
import { cn } from "@/src/utlis/utils";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
  Video,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBDT = (amount) => {
  if (amount == null) return "৳ 0";
  return (
    "৳ " +
    new Intl.NumberFormat("bn-BD", {
      minimumFractionDigits: 0,
    }).format(amount)
  );
};

const formatBDDateTime = (iso) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
};

// ─── Reusable Components ───────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col gap-2",
      "bg-white border border-[#cadcae]/60 shadow-sm",
    )}
  >
    <div
      className={cn(
        "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center",
        accent || "bg-[oklch(70%_0.14_182.503)/15]",
      )}
    >
      <Icon size={18} className="text-[oklch(27%_0.046_192.524)]" />
    </div>
    <p className="text-[11px] sm:text-xs text-[oklch(20%_0.042_265.755)/60] font-medium tracking-wide uppercase">
      {label}
    </p>
    <p className="text-xl sm:text-2xl font-bold text-[oklch(20%_0.042_265.755)] leading-none">
      {value}
    </p>
    {sub && (
      <p className="text-[10px] sm:text-xs text-[oklch(20%_0.042_265.755)/50]">
        {sub}
      </p>
    )}
    {/* decorative blob */}
    <div
      className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10"
      style={{ background: "oklch(70% 0.14 182.503)" }}
    />
  </div>
);

const SectionCard = ({ title, children, className }) => (
  <div
    className={cn(
      "rounded-2xl bg-white border border-[#cadcae]/60 shadow-sm overflow-hidden",
      className,
    )}
  >
    {title && (
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#cadcae]/40 bg-[#fffde1]/60">
        <h2 className="text-sm sm:text-base font-bold text-[oklch(20%_0.042_265.755)]">
          {title}
        </h2>
      </div>
    )}
    {children}
  </div>
);

// ─── Sub-components ────────────────────────────────────────────────────────────
const UserProfileCard = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionCard>
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* avatar */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[oklch(70%_0.14_182.503)] flex items-center justify-center flex-shrink-0 shadow">
          <span className="text-white text-xl sm:text-2xl font-bold">
            {user.name[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[oklch(20%_0.042_265.755)] capitalize truncate">
              {user.name}
            </h1>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#ffc900]/20 text-[#855a00] font-semibold border border-[#ffc900]/40">
              রেফারেল সদস্য
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs text-[oklch(20%_0.042_265.755)/60]">
              রেফারেল কোড:
            </span>
            <button
              onClick={copy}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold",
                "border transition-all duration-200",
                copied
                  ? "bg-[oklch(69%_0.17_162.48)/15] text-[oklch(26%_0.051_172.552)] border-[oklch(69%_0.17_162.48)/40]"
                  : "bg-[oklch(70%_0.14_182.503)/12] text-[oklch(27%_0.046_192.524)] border-[oklch(70%_0.14_182.503)/40] hover:bg-[oklch(70%_0.14_182.503)/20]",
              )}
            >
              {user.referralCode}
              {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        {/* balance chip */}
        <div className="sm:text-right flex sm:flex-col gap-3 sm:gap-1 flex-wrap">
          <div className="text-xs text-[oklch(20%_0.042_265.755)/55] font-medium">
            ব্যালেন্স
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[oklch(27%_0.046_192.524)]">
            {formatBDT(user.balance)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const StatsGrid = ({ data }) => {
  const stats = [
    {
      icon: Users,
      label: "সরাসরি রেফারেল",
      value: data.pagination?.totalItems || 0,
      sub: "আপনার সরাসরি রেফারেল",
      accent: "bg-[oklch(70%_0.14_182.503)/15]",
    },
    {
      icon: ShoppingBag,
      label: "মোট অর্ডার",
      value: data.last30DaysSummary?.totalOrder || 0,
      sub: "সবার যৌথ অর্ডার",
      accent: "bg-[#ffc900]/15",
    },
    {
      icon: Video,
      label: "মোট কোর্স",
      value: data.last30DaysSummary?.totalCourse || 0,
      sub: "সবার ক্রয়কৃত যৌথ কোর্স",
      accent: "bg-[#ffc900]/15",
    },
    {
      icon: TrendingUp,
      label: "রেফারেল বোনাস",
      value: formatBDT(data.last30DaysSummary?.totalReferralBonus?.total || 0),
      sub: "গত ৩০ দিন",
      accent: "bg-[oklch(69%_0.17_162.48)/15]",
    },
    {
      icon: Wallet,
      label: "বর্তমান ব্যালেন্স",
      value: formatBDT(data.currentUser?.balance || 0),
      sub: "আপনার",
      accent: "bg-[oklch(76%_0.188_70.08)/15]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};

const MemberRow = ({ member }) => {
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
        open
          ? "border-[oklch(70%_0.14_182.503)/60] shadow-md"
          : "border-[#cadcae]/60 shadow-sm",
      )}
    >
      {/* member header row */}
      <div
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white hover:bg-[#fffde1]/50 transition-colors duration-200 text-left"
      >
        {/* avatar */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[oklch(69%_0.17_162.48)/25] flex items-center justify-center flex-shrink-0">
          <span className="text-sm sm:text-base font-bold text-[oklch(26%_0.051_172.552)]">
            {member.name?.[0]?.toUpperCase() || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[oklch(20%_0.042_265.755)] capitalize truncate">
              {member.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] sm:text-xs text-[oklch(20%_0.042_265.755)/55] truncate">
              {member.email}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyEmail();
              }}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="ইমেইল কপি করুন"
            >
              {emailCopied ? (
                <CheckCircle size={14} className="text-emerald-600" />
              ) : (
                <Copy
                  size={14}
                  className="text-[oklch(20%_0.042_265.755)/60]"
                />
              )}
            </button>
          </div>
        </div>

        {/* mini stats */}
        <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-center text-right">
          <p className="text-xs font-bold text-[oklch(27%_0.046_192.524)]">
            {formatBDT(member.referralBonuses?.total || 0)}
          </p>
          <p className="text-[10px] text-[oklch(20%_0.042_265.755)/50]">
            বোনাস
          </p>
        </div>

        <div className="ml-1 flex-shrink-0">
          {open ? (
            <ChevronUp
              size={16}
              className="text-[oklch(20%_0.042_265.755)/50]"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-[oklch(20%_0.042_265.755)/50]"
            />
          )}
        </div>
      </div>

      {/* expanded details */}
      {open && (
        <div className="border-t border-[#cadcae]/40">
          <div className="px-4 sm:px-5 py-4 bg-[#fffde1]/50 flex flex-wrap gap-3">
            {[
              { label: "যোগদান", value: formatBDDateTime(member.joinedAt) },
              {
                label: "অর্ডার বোনাস",
                value: formatBDT(member.referralBonuses?.fromOrders || 0),
              },
              {
                label: "কোর্স বোনাস",
                value: formatBDT(member.referralBonuses?.fromCourses || 0),
              },
              {
                label: "মোট অর্ডার",
                value: `${member.totalOrder || 0}`,
              },
              {
                label: "মোট কোর্স",
                value: `${member.totalCourse || 0}`,
              },
            ].map((chip, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-0.5 bg-white rounded-xl px-3.5 py-2.5 border border-[#cadcae]/50 shadow-sm min-w-[110px]"
              >
                <span className="text-[9px] sm:text-[10px] text-[oklch(20%_0.042_265.755)/50] font-medium uppercase tracking-wide">
                  {chip.label}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[oklch(20%_0.042_265.755)]">
                  {chip.value}
                </span>
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
    {[...Array(10)].map((_, i) => (
      <div key={i} className="h-24 rounded-2xl bg-[#cadcae]/30 animate-pulse" />
    ))}
  </div>
);

const MembersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [page, setPage] = useState(1);

  const [isLoading, data] = useTeamSystemData({
    page,
    search: searchTerm,
  });

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (data?.pagination?.totalPages || 1)) return;

    setPage(newPage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
      setPage(1);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [localSearch]);

  const pagination = data?.pagination;
  const members = data?.members || [];

  return (
    <SectionCard title={`টিম সদস্য (${pagination?.totalItems || 0})`}>
      {/* Search */}
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[#cadcae]/30">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[oklch(20%_0.042_265.755)/50]">
            <Search size={18} />
          </div>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="সদস্যের নাম বা ইমেইল দিয়ে খুঁজুন..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#cadcae]/60 rounded-2xl focus:outline-none focus:border-[oklch(70%_0.14_182.503)] text-sm placeholder:text-[oklch(20%_0.042_265.755)/50]"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <MembersSkeleton />
        ) : members.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#cadcae]/30 flex items-center justify-center">
              <Users size={32} className="text-[oklch(20%_0.042_265.755)/40]" />
            </div>
            <p className="text-sm text-[oklch(20%_0.042_265.755)/60]">
              কোনো সদস্য পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <MemberRow key={m._id} member={m} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#cadcae]/40 px-4 sm:px-6 py-4 bg-[#fffde1]/40">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm font-medium border border-transparent hover:border-[#cadcae]/60"
          >
            <ChevronLeft size={16} /> আগের
          </button>

          <div className="text-sm text-[oklch(20%_0.042_265.755)/70]">
            পৃষ্ঠা{" "}
            <span className="font-semibold">{pagination.currentPage}</span> /{" "}
            {pagination.totalPages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm font-medium border border-transparent hover:border-[#cadcae]/60"
          >
            পরের <ChevronRight size={16} />
          </button>
        </div>
      )}
    </SectionCard>
  );
};

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
const SkeletonPulse = ({ className }) => (
  <div className={cn("animate-pulse rounded-lg bg-[#cadcae]/40", className)} />
);

const LoadingState = () => (
  <Container>
    <div className="py-6 sm:py-10 flex flex-col gap-5 sm:gap-6">
      <SkeletonPulse className="h-24 sm:h-28 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonPulse key={i} className="h-28 sm:h-32 rounded-2xl" />
        ))}
      </div>
      <SkeletonPulse className="h-64 rounded-2xl" />
    </div>
  </Container>
);

const ErrorState = () => (
  <Container>
    <div className="py-20 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[oklch(50%_0.213_27.518)/10] flex items-center justify-center">
        <XCircle size={28} className="text-[oklch(50%_0.213_27.518)]" />
      </div>
      <p className="text-sm text-[oklch(50%_0.213_27.518)] font-medium">
        {"তথ্য লোড হতে সমস্যা হয়েছে! দয়া করে পুনরায় চেষ্টা করুন!"}
      </p>
    </div>
  </Container>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const TeamSystemPage = () => {
  const [isLoading, data, error] = useTeamSystemData();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <section
      style={{ background: "var(--color-bg, #fffde1)", minHeight: "100vh" }}
    >
      <Container>
        <div className="py-6 sm:py-10 flex flex-col gap-5 sm:gap-6">
          {/* page title */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-[oklch(70%_0.14_182.503)]" />
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[oklch(20%_0.042_265.755)]">
              টিম সিস্টেম
            </h1>
          </div>

          {/* user profile */}
          <UserProfileCard user={data.currentUser} />

          {/* stats grid */}
          <StatsGrid data={data} />

          {/* members with search + pagination */}
          <MembersSection />
        </div>
      </Container>
    </section>
  );
};

export default TeamSystemPage;
