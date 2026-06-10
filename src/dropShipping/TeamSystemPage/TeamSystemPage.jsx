"use client";
import Container from "@/src/compronent/shared/Container";
import useTeamSystemData from "@/src/hook/useTeamSystemData";
import { cn } from "@/src/utlis/utils";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Gift,
  Package,
  RotateCcw,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBDT = (amount) =>
  new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);

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

const STATUS_MAP = {
  completed: {
    label: "সম্পন্ন",
    icon: CheckCircle,
    cls: "bg-[oklch(70%_0.14_182.503)/15] text-[oklch(27%_0.046_192.524)] border border-[oklch(70%_0.14_182.503)/40]",
  },
  pending: {
    label: "অপেক্ষমাণ",
    icon: Clock,
    cls: "bg-[oklch(85%_0.199_91.936)/15] text-[oklch(28%_0.066_53.813)] border border-[oklch(85%_0.199_91.936)/40]",
  },
  return: {
    label: "রিটার্ন",
    icon: RotateCcw,
    cls: "bg-[oklch(50%_0.213_27.518)/12] text-[oklch(50%_0.213_27.518)] border border-[oklch(50%_0.213_27.518)/30]",
  },
  paid: {
    label: "পেইড",
    icon: CheckCircle,
    cls: "bg-[oklch(69%_0.17_162.48)/15] text-[oklch(26%_0.051_172.552)] border border-[oklch(69%_0.17_162.48)/40]",
  },
  unpaid: {
    label: "আনপেইড",
    icon: XCircle,
    cls: "bg-[oklch(50%_0.213_27.518)/12] text-[oklch(50%_0.213_27.518)] border border-[oklch(50%_0.213_27.518)/30]",
  },
  cod: {
    label: "COD",
    icon: Package,
    cls: "bg-[#ffc900]/15 text-[#855a00] border border-[#ffc900]/40",
  },
};

const getStatus = (key) =>
  STATUS_MAP[key] || {
    label: key,
    icon: Package,
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
  };

// ─── Reusable Components ───────────────────────────────────────────────────────

const Badge = ({ statusKey }) => {
  const s = getStatus(statusKey);
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap",
        s.cls,
      )}
    >
      <Icon size={11} />
      {s.label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col gap-2",
      "bg-white border border-[#cadcae]/60 shadow-sm",
      "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
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

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full text-xs sm:text-sm">{children}</table>
  </div>
);

const Th = ({ children, className }) => (
  <th
    className={cn(
      "px-3 sm:px-4 py-2.5 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider",
      "text-[oklch(20%_0.042_265.755)/60] bg-[#fffde1]/80 whitespace-nowrap",
      className,
    )}
  >
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td
    className={cn(
      "px-3 sm:px-4 py-2.5 text-[oklch(20%_0.042_265.755)] align-middle border-b border-[#cadcae]/30",
      className,
    )}
  >
    {children}
  </td>
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
            {user.name?.[0]?.toUpperCase() || "U"}
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
      value: data.directReferralsCount,
      sub: `মোট ডাউনলাইন: ${data.totalDownlineCount}`,
      accent: "bg-[oklch(70%_0.14_182.503)/15]",
    },
    {
      icon: ShoppingBag,
      label: "মোট টিম অর্ডার",
      value: data.totalTeamOrders,
      sub: `গত ৭ দিন: ${data.last7DaysOrders} অর্ডার`,
      accent: "bg-[#ffc900]/15",
    },
    {
      icon: TrendingUp,
      label: "মোট রেভিনিউ",
      value: formatBDT(data.totalRevenue),
      sub: "মোট আয়",
      accent: "bg-[oklch(69%_0.17_162.48)/15]",
    },
    {
      icon: Wallet,
      label: "বর্তমান ব্যালেন্স",
      value: formatBDT(data.currentUser.balance),
      sub: `ডেলিভারি: ${data.currentUser.deliveredItemsCount} আইটেম`,
      accent: "bg-[oklch(76%_0.188_70.08)/15]",
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};

const OrderProductsRow = ({ products }) => (
  <div className="flex flex-col gap-1.5">
    {products.map((p) => (
      <div key={p._id} className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] sm:text-xs font-medium text-[oklch(20%_0.042_265.755)]">
          {p.name}
        </span>
        <span className="text-[10px] sm:text-[11px] text-[oklch(20%_0.042_265.755)/50]">
          ×{p.quantity}
        </span>
        <span className="text-[10px] sm:text-[11px] text-[oklch(27%_0.046_192.524)] font-semibold">
          {formatBDT(p.totalPrice)}
        </span>
      </div>
    ))}
  </div>
);

const MemberOrdersTable = ({ orders }) => {
  if (!orders?.length)
    return (
      <p className="text-center py-8 text-xs text-[oklch(20%_0.042_265.755)/50]">
        কোনো অর্ডার নেই
      </p>
    );
  return (
    <TableWrapper>
      <thead>
        <tr>
          <Th>অর্ডার তারিখ</Th>
          <Th>পণ্য</Th>
          <Th>অর্ডার স্ট্যাটাস</Th>
          <Th>পেমেন্ট</Th>
          <Th>ধরন</Th>
          <Th className="text-right">মোট</Th>
          <Th className="text-right">বোনাস</Th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o, i) => (
          <tr
            key={o._id}
            className={cn(
              "transition-colors duration-150 hover:bg-[#fffde1]/60",
              i % 2 === 0 ? "bg-white" : "bg-[#fffde1]/30",
            )}
          >
            <Td>
              <span className="text-[10px] sm:text-xs text-[oklch(20%_0.042_265.755)/70] whitespace-nowrap">
                {formatBDDateTime(o.createdAt)}
              </span>
            </Td>
            <Td>
              <OrderProductsRow products={o.products} />
            </Td>
            <Td>
              <Badge statusKey={o.order_status} />
            </Td>
            <Td>
              <Badge statusKey={o.payment_status} />
            </Td>
            <Td>
              <Badge statusKey={o.payment_type} />
            </Td>
            <Td className="text-right font-bold text-[oklch(27%_0.046_192.524)] whitespace-nowrap">
              {formatBDT(o.totalAmt)}
            </Td>
            <Td className="text-right whitespace-nowrap">
              {o.referralBonusGiven ? (
                <span className="inline-flex items-center gap-1 text-[oklch(26%_0.051_172.552)] font-semibold text-[10px] sm:text-xs">
                  <Gift size={11} />
                  {formatBDT(o.referralBonusAmount)}
                </span>
              ) : (
                <span className="text-[oklch(20%_0.042_265.755)/35] text-[10px] sm:text-xs">
                  —
                </span>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  );
};

const MemberRow = ({ member }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-300",
        open
          ? "border-[oklch(70%_0.14_182.503)/60] shadow-md"
          : "border-[#cadcae]/60 shadow-sm",
      )}
    >
      {/* member header row */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white hover:bg-[#fffde1]/50 transition-colors duration-200 text-left"
      >
        {/* avatar */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[oklch(69%_0.17_162.48)/25] flex items-center justify-center flex-shrink-0">
          <span className="text-sm sm:text-base font-bold text-[oklch(26%_0.051_172.552)]">
            {member.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[oklch(20%_0.042_265.755)] capitalize truncate">
              {member.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[oklch(70%_0.14_182.503)/12] text-[oklch(27%_0.046_192.524)] border border-[oklch(70%_0.14_182.503)/30] font-medium">
              {member.role}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[oklch(20%_0.042_265.755)/55] truncate mt-0.5">
            {member.email}
          </p>
        </div>
        {/* mini stats */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <p className="text-[10px] text-[oklch(20%_0.042_265.755)/50] font-medium">
              অর্ডার
            </p>
            <p className="text-sm font-bold text-[oklch(20%_0.042_265.755)]">
              {member.totalOrders}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[oklch(20%_0.042_265.755)/50] font-medium">
              রেভিনিউ
            </p>
            <p className="text-sm font-bold text-[oklch(27%_0.046_192.524)]">
              {formatBDT(member.revenue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[oklch(20%_0.042_265.755)/50] font-medium">
              ব্যালেন্স
            </p>
            <p className="text-sm font-bold text-[#855a00]">
              {formatBDT(member.balance)}
            </p>
          </div>
        </div>
        {/* mobile stats */}
        <div className="flex sm:hidden flex-col items-end gap-0.5 flex-shrink-0">
          <p className="text-xs font-bold text-[oklch(27%_0.046_192.524)]">
            {formatBDT(member.revenue)}
          </p>
          <p className="text-[10px] text-[oklch(20%_0.042_265.755)/50]">
            {member.totalOrders} অর্ডার
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
      </button>

      {/* expanded orders */}
      {open && (
        <div className="border-t border-[#cadcae]/40 animate-in slide-in-from-top-1 duration-200">
          {/* member detail chips */}
          <div className="px-4 sm:px-5 py-3 bg-[#fffde1]/50 flex flex-wrap gap-2 sm:gap-3">
            {[
              { label: "স্ট্যাটাস", value: member.customerstatus },
              { label: "রেফারেল কোড", value: member.referralCode, mono: true },
              { label: "রেফারেল সংখ্যা", value: member.referralCount },
              { label: "গত ৭ দিনের অর্ডার", value: member.last7DaysOrders },
              {
                label: "গত ৭ দিনের রেভিনিউ",
                value: formatBDT(member.last7DaysRevenue),
              },
              {
                label: "যোগ দিয়েছেন",
                value: formatBDDateTime(member.createdAt),
              },
            ].map((chip) => (
              <div
                key={chip.label}
                className="flex flex-col gap-0.5 bg-white rounded-xl px-3 py-2 border border-[#cadcae]/50 shadow-sm"
              >
                <span className="text-[9px] sm:text-[10px] text-[oklch(20%_0.042_265.755)/50] font-medium uppercase tracking-wide">
                  {chip.label}
                </span>
                <span
                  className={cn(
                    "text-[11px] sm:text-xs font-bold text-[oklch(20%_0.042_265.755)]",
                    chip.mono && "font-mono",
                  )}
                >
                  {chip.value}
                </span>
              </div>
            ))}
          </div>
          <MemberOrdersTable orders={member.orders} />
        </div>
      )}
    </div>
  );
};

const MembersSection = ({ members }) => (
  <SectionCard title={`টিম সদস্য (${members.length})`}>
    <div className="p-4 sm:p-5 flex flex-col gap-3">
      {members.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#cadcae]/30 flex items-center justify-center">
            <Users size={24} className="text-[oklch(20%_0.042_265.755)/40]" />
          </div>
          <p className="text-sm text-[oklch(20%_0.042_265.755)/50]">
            এখনো কোনো সদস্য নেই
          </p>
        </div>
      ) : (
        members.map((m) => <MemberRow key={m._id} member={m} />)
      )}
    </div>
  </SectionCard>
);

const TeamSummaryTable = ({ members }) => {
  const rows = members.map((m) => ({
    name: m.name,
    email: m.email,
    orders: m.totalOrders,
    last7: m.last7DaysOrders,
    revenue: m.revenue,
    balance: m.balance,
    status: m.customerstatus,
  }));

  return (
    <SectionCard title="টিম সারসংক্ষেপ">
      <TableWrapper>
        <thead>
          <tr>
            <Th>নাম</Th>
            <Th className="hidden sm:table-cell">ইমেইল</Th>
            <Th>মোট অর্ডার</Th>
            <Th className="hidden md:table-cell">গত ৭ দিন</Th>
            <Th>রেভিনিউ</Th>
            <Th className="hidden sm:table-cell">ব্যালেন্স</Th>
            <Th className="hidden lg:table-cell">স্ট্যাটাস</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={cn(
                "transition-colors hover:bg-[#fffde1]/60",
                i % 2 === 0 ? "bg-white" : "bg-[#fffde1]/30",
              )}
            >
              <Td>
                <span className="font-semibold capitalize text-[oklch(20%_0.042_265.755)]">
                  {r.name}
                </span>
              </Td>
              <Td className="hidden sm:table-cell text-[oklch(20%_0.042_265.755)/60]">
                {r.email}
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={10} className="text-[#ffc900]" />
                  {r.orders}
                </span>
              </Td>
              <Td className="hidden md:table-cell">{r.last7}</Td>
              <Td className="font-bold text-[oklch(27%_0.046_192.524)] whitespace-nowrap">
                {formatBDT(r.revenue)}
              </Td>
              <Td className="hidden sm:table-cell font-semibold text-[#855a00] whitespace-nowrap">
                {formatBDT(r.balance)}
              </Td>
              <Td className="hidden lg:table-cell">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[oklch(70%_0.14_182.503)/12] text-[oklch(27%_0.046_192.524)] border border-[oklch(70%_0.14_182.503)/30] font-medium">
                  {r.status}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonPulse key={i} className="h-28 sm:h-32 rounded-2xl" />
        ))}
      </div>
      <SkeletonPulse className="h-40 rounded-2xl" />
      <SkeletonPulse className="h-64 rounded-2xl" />
    </div>
  </Container>
);

const ErrorState = ({ error }) => (
  <Container>
    <div className="py-20 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[oklch(50%_0.213_27.518)/10] flex items-center justify-center">
        <XCircle size={28} className="text-[oklch(50%_0.213_27.518)]" />
      </div>
      <p className="text-sm text-[oklch(50%_0.213_27.518)] font-medium">
        {error || "কোনো তথ্য পাওয়া যায়নি"}
      </p>
    </div>
  </Container>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TeamSystemPage = () => {
  const [isLoading, data, error] = useTeamSystemData();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <section style={{ background: "var(--color-bg, #fffde1)", minHeight: "100vh" }}>
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

          {/* summary table */}
          {data.members?.length > 0 && (
            <TeamSummaryTable members={data.members} />
          )}

          {/* members with accordion orders */}
          <MembersSection members={data.members || []} />
        </div>
      </Container>
    </section>
  );
};

export default TeamSystemPage;
