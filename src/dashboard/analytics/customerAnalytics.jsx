"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line,Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Mock data for customer analytics
const mockCustomerData = {
  totalCustomers: 15420,
  newCustomers: 1250,
  returningCustomers: 8930,
  customerRetentionRate: 68.5,
  averageLifetimeValue: 485,
  averageOrderValue: 125,
  customerGrowthData: [
    { month: "Jan", new: 980, returning: 1200, total: 2180 },
    { month: "Feb", new: 1120, returning: 1350, total: 2470 },
    { month: "Mar", new: 1050, returning: 1480, total: 2530 },
    { month: "Apr", new: 1180, returning: 1520, total: 2700 },
    { month: "May", new: 1250, returning: 1680, total: 2930 },
    { month: "Jun", new: 1320, returning: 1750, total: 3070 },
  ],
  demographics: {
    ageGroups: [
      { range: "18-24", percentage: 15, count: 2313 },
      { range: "25-34", percentage: 35, count: 5397 },
      { range: "35-44", percentage: 28, count: 4318 },
      { range: "45-54", percentage: 15, count: 2313 },
      { range: "55+", percentage: 7, count: 1079 },
    ],
    locations: [
      { country: "United States", percentage: 45, count: 6939 },
      { country: "Canada", percentage: 18, count: 2776 },
      { country: "United Kingdom", percentage: 12, count: 1850 },
      { country: "Germany", percentage: 10, count: 1542 },
      { country: "Others", percentage: 15, count: 2313 },
    ],
  },
  topCustomers: [
    { name: "Sarah Johnson", orders: 45, spent: 2250, status: "VIP" },
    { name: "Michael Chen", orders: 38, spent: 1890, status: "Premium" },
    { name: "Emma Davis", orders: 32, spent: 1680, status: "Premium" },
    { name: "James Wilson", orders: 28, spent: 1420, status: "Regular" },
  ],
  behaviorMetrics: {
    averageSessionDuration: "4m 32s",
    bounceRate: 24.5,
    pagesPerSession: 3.8,
    conversionRate: 3.2,
  },
}

const CustomerAnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const genderVisitors = {
  women: 420,
  men: 610,
  children: 270,
};


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const StatCard = ({
    title,
    value,
    change,
    icon,
    delay = 0,
    trend = "up",
  }) => (
    <div
      className={`group relative p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-2xl hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
      <div
        className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-300 text-sm font-medium tracking-wide">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {value}
          </p>
          <p
            className={`text-sm font-medium ${
              trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-amber-400"
            }`}
          >
            {change}
          </p>
        </div>
        <div className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 group-hover:scale-110 transform">
          {icon}
        </div>
      </div>
    </div>
  )

  const ChartBar = ({
    height,
    label,
    value,
    delay = 0,
    color = "blue",
  }) => (
    <div className="flex flex-col items-center space-y-3 group">
      <div
        className="relative w-10 bg-white/5 rounded-t-xl overflow-hidden backdrop-blur-sm"
        style={{ height: "140px" }}
      >
        <div
          className={`absolute bottom-0 w-full bg-gradient-to-t from-blue-500 via-blue-400 to-cyan-300 rounded-t-xl transition-all duration-1000 ease-out group-hover:from-blue-400 group-hover:via-cyan-400 group-hover:to-cyan-200 shadow-lg shadow-blue-500/30`}
          style={{
            height: `${height}%`,
            animationDelay: `${delay}ms`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
      </div>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xs font-bold text-white">{value.toLocaleString()}</span>
    </div>
  )

  const DemographicBar = ({
    label,
    percentage,
    count,
    delay = 0,
  }) => (
    <div className="space-y-3 animate-slide-in-left group" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-sm text-gray-300 font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
        <div
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide-right" />
        </div>
      </div>
      <div className="text-xs text-gray-400">{count.toLocaleString()} customers</div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-blue-500/30"></div>
          <p className="text-gray-300 animate-pulse text-lg font-medium">Loading Customer Analytics...</p>
          <div className="mt-4 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-float-slow" />

      {/* Header */}
      <header className="sticky top-0  bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Customer Analytics Dashboard
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Understand your customer behavior and demographics</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/20"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 font-medium">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl animate-fade-in backdrop-blur-sm border border-white/10">
            {["overview", "demographics", "behavior", "retention"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 animate-fade-in">Key Customer Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <StatCard
                  title="Total Customers"
                  value={mockCustomerData.totalCustomers.toLocaleString()}
                  change="+8.2% from last month"
                  icon="👥"
                  delay={100}
                />
                <StatCard
                  title="New Customers"
                  value={mockCustomerData.newCustomers.toLocaleString()}
                  change="+12.5% from last month"
                  icon="🆕"
                  delay={200}
                />
                <StatCard
                  title="Returning Customers"
                  value={mockCustomerData.returningCustomers.toLocaleString()}
                  change="+5.8% from last month"
                  icon="🔄"
                  delay={300}
                />
                <StatCard
                  title="Retention Rate"
                  value={`${mockCustomerData.customerRetentionRate}%`}
                  change="+2.1% from last month"
                  icon="📈"
                  delay={400}
                />
                <StatCard
                  title="Avg Lifetime Value"
                  value={formatCurrency(mockCustomerData.averageLifetimeValue)}
                  change="+15.3% from last month"
                  icon="💎"
                  delay={500}
                />
                <StatCard
                  title="Avg Order Value"
                  value={formatCurrency(mockCustomerData.averageOrderValue)}
                  change="+3.7% from last month"
                  icon="🛒"
                  delay={600}
                />
              </div>
            </section>

 <section className="mb-16">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* ================= LINE CHART ================= */}
    <div
      className="lg:col-span-2 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent
      backdrop-blur-sm border border-white/20 rounded-3xl animate-slide-in-up
      shadow-2xl shadow-blue-500/10"
      style={{ animationDelay: "700ms" }}
    >
      <h3 className="text-xl font-bold text-white mb-4">
        Customer Growth Trend
      </h3>

      <div className="h-56 w-full">
        <Line
          data={{
            labels: mockCustomerData.customerGrowthData.map(d => d.month),
            datasets: [
              {
                label: "Total Customers",
                data: mockCustomerData.customerGrowthData.map(d => d.total),
                borderColor: "rgb(59,130,246)",
                backgroundColor: "rgba(59,130,246,0.25)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
              },
              {
                label: "New Customers",
                data: mockCustomerData.customerGrowthData.map(d => d.new),
                borderColor: "rgb(16,185,129)",
                backgroundColor: "rgba(16,185,129,0.25)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1400,
              easing: "easeOutQuart",
            },
            plugins: {
              legend: {
                labels: {
                  color: "#e5e7eb",
                  font: { size: 12 },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#cbd5f5" },
                grid: { color: "rgba(255,255,255,0.08)" },
              },
              y: {
                ticks: { color: "#cbd5f5" },
                grid: { color: "rgba(255,255,255,0.08)" },
              },
            },
          }}
        />
      </div>
    </div>

    {/* ================= PIE CHART ================= */}
    <div
      className="p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent
      backdrop-blur-sm border border-white/20 rounded-3xl animate-slide-in-up
      shadow-2xl shadow-pink-500/10 flex flex-col items-center justify-center"
      style={{ animationDelay: "900ms" }}
    >
      <h3 className="text-lg font-bold text-white mb-4">
        Visitor Demographics
      </h3>

      <div className="w-64 h-64">
        <Pie
          data={{
            labels: ["Women", "Men", "Children"],
            datasets: [
              {
                data: [
                  genderVisitors.women,
                  genderVisitors.men,
                  genderVisitors.children,
                ],
                backgroundColor: [
                  "rgba(236,72,153,0.8)",
                  "rgba(59,130,246,0.8)",
                  "rgba(16,185,129,0.8)",
                ],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            animation: {
              animateRotate: true,
              duration: 1400,
              easing: "easeOutQuart",
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#e5e7eb",
                  boxWidth: 10,
                  font: { size: 11 },
                },
              },
            },
          }}
        />
      </div>
    </div>

  </div>
</section>

            {/* Top Customers */}
            <section>
              <div
                className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-3xl animate-slide-in-up shadow-2xl shadow-purple-500/10"
                style={{ animationDelay: "800ms" }}
              >
                <h3 className="text-2xl font-bold text-white mb-8">Top Customers</h3>
                <div className="space-y-6">
                  {mockCustomerData.topCustomers.map((customer, index) => (
                    <div
                      key={customer.name}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl hover:from-white/10 hover:to-white/20 transition-all duration-300 hover:scale-102 border border-white/10 group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">{customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">{customer.name}</p>
                          <p className="text-gray-300">{customer.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-xl">{formatCurrency(customer.spent)}</p>
                        <span
                          className={`text-sm px-4 py-2 rounded-full font-medium ${
                            customer.status === "VIP"
                              ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                              : customer.status === "Premium"
                                ? "bg-gradient-to-r from-purple-500/20 to-purple-400/20 text-purple-300 border border-purple-400/30"
                                : "bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-300 border border-blue-400/30"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Demographics Tab */}
        {activeTab === "demographics" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Age Demographics */}
            <div className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-3xl animate-slide-in-left shadow-2xl shadow-blue-500/10">
              <h3 className="text-2xl font-bold text-white mb-8">Age Demographics</h3>
              <div className="space-y-6">
                {mockCustomerData.demographics.ageGroups.map((group, index) => (
                  <DemographicBar
                    key={group.range}
                    label={group.range}
                    percentage={group.percentage}
                    count={group.count}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>

            {/* Location Demographics */}
            <div className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-3xl animate-slide-in-right shadow-2xl shadow-purple-500/10">
              <h3 className="text-2xl font-bold text-white mb-8">Geographic Distribution</h3>
              <div className="space-y-6">
                {mockCustomerData.demographics.locations.map((location, index) => (
                  <DemographicBar
                    key={location.country}
                    label={location.country}
                    percentage={location.percentage}
                    count={location.count}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Behavior Tab */}
        {activeTab === "behavior" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <StatCard
              title="Avg Session Duration"
              value={mockCustomerData.behaviorMetrics.averageSessionDuration}
              change="+15.2% from last month"
              icon="⏱️"
              delay={100}
            />
            <StatCard
              title="Bounce Rate"
              value={`${mockCustomerData.behaviorMetrics.bounceRate}%`}
              change="-3.1% from last month"
              icon="📉"
              delay={200}
              trend="down"
            />
            <StatCard
              title="Pages per Session"
              value={mockCustomerData.behaviorMetrics.pagesPerSession.toString()}
              change="+8.7% from last month"
              icon="📄"
              delay={300}
            />
            <StatCard
              title="Conversion Rate"
              value={`${mockCustomerData.behaviorMetrics.conversionRate}%`}
              change="+5.4% from last month"
              icon="🎯"
              delay={400}
            />
          </div>
        )}

        {/* Retention Tab */}
        {activeTab === "retention" && (
          <div className="p-10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-3xl animate-scale-in shadow-2xl shadow-blue-500/10">
            <h3 className="text-3xl font-bold text-white mb-10">Customer Retention Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl hover:from-white/10 hover:to-white/20 transition-all duration-300 hover:scale-105 border border-white/10 group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🔄</div>
                <h4 className="font-bold text-white mb-4 text-xl">Retention Rate</h4>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {mockCustomerData.customerRetentionRate}%
                </p>
                <p className="text-gray-300">
                  {mockCustomerData.returningCustomers.toLocaleString()} customers returned
                </p>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl hover:from-white/10 hover:to-white/20 transition-all duration-300 hover:scale-105 border border-white/10 group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💎</div>
                <h4 className="font-bold text-white mb-4 text-xl">Lifetime Value</h4>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {formatCurrency(mockCustomerData.averageLifetimeValue)}
                </p>
                <p className="text-gray-300">Average customer lifetime value</p>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl hover:from-white/10 hover:to-white/20 transition-all duration-300 hover:scale-105 border border-white/10 group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
                <h4 className="font-bold text-white mb-4 text-xl">Growth Rate</h4>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  +8.2%
                </p>
                <p className="text-gray-300">Monthly customer growth rate</p>
              </div>
            </div>
          </div>
        )}
      </main>

      
    </div>
  )
}

export default CustomerAnalyticsDashboard
