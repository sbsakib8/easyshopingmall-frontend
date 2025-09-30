"use client"

import { useState, useEffect } from "react"

// Mock data for the dashboard
const mockSalesData = {
  totalRevenue: 125000,
  totalOrders: 1250,
  averageOrderValue: 100,
  conversionRate: 3.2,
  monthlyData: [
    { month: "Jan", revenue: 15000, orders: 150 },
    { month: "Feb", revenue: 18000, orders: 180 },
    { month: "Mar", revenue: 22000, orders: 220 },
    { month: "Apr", revenue: 19000, orders: 190 },
    { month: "May", revenue: 25000, orders: 250 },
    { month: "Jun", revenue: 26000, orders: 260 },
  ],
  topProducts: [
    { name: "Wireless Headphones", sales: 450, revenue: 22500 },
    { name: "Smart Watch", sales: 320, revenue: 19200 },
    { name: "Laptop Stand", sales: 280, revenue: 14000 },
    { name: "USB-C Cable", sales: 200, revenue: 4000 },
  ],
  recentOrders: [
    { id: "#12345", customer: "John Doe", amount: 150, status: "Completed" },
    { id: "#12346", customer: "Jane Smith", amount: 89, status: "Processing" },
    { id: "#12347", customer: "Mike Johnson", amount: 220, status: "Shipped" },
    { id: "#12348", customer: "Sarah Wilson", amount: 75, status: "Pending" },
  ],
}

const SalesReportDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [animationDelay, setAnimationDelay] = useState(0)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const StatCard = ({ title, value, change, icon, delay = 0 }) => (
    <div
      className={`group relative p-6 md:p-8 bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-blue-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 hover:-translate-y-2 hover:scale-105 animate-slide-in-up overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className=" text-xs md:text-sm font-semibold tracking-widest uppercase mb-3 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {title}
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black  mb-3 tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
            {value}
          </p>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-3 py-2 rounded-full border border-emerald-400/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-emerald-300 text-xs md:text-sm font-bold">
              {change}
            </p>
          </div>
        </div>
        <div className="text-4xl md:text-5xl opacity-60 group-hover:opacity-90 transition-all duration-500 group-hover:scale-125 transform group-hover:rotate-12 filter drop-shadow-lg">
          {icon}
        </div>
      </div>

      {/* Bottom glow bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full" />
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-3xl" />
    </div>
  )

  const ChartBar = ({ height, label, value, delay = 0 }) => (
    <div className="flex flex-col items-center space-y-3 group cursor-pointer">
      <div
        className="relative w-8 md:w-12 bg-gradient-to-b from-slate-800/50 to-slate-900/80 rounded-t-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm"
        style={{ height: "120px" }}
      >
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 via-blue-500 to-cyan-400 rounded-t-2xl transition-all duration-1500 ease-out group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-yellow-400 shadow-lg animate-slide-up"
          style={{
            height: `${height}%`,
            animationDelay: `${delay}ms`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-blue-500/20 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      </div>
      
      <span className="text-xs md:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors duration-300">
        {label}
      </span>
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 group-hover:border-purple-400/50 transition-all duration-300">
        <span className="text-xs font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </span>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 animate-pulse" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-cyan-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-slate-600/50 border-t-purple-400 border-r-cyan-400 rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-purple-500/20"></div>
          <p className=" animate-pulse text-lg md:text-xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Loading Sales Report...
          </p>
          <div className="mt-4 flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0  bg-gradient-to-r from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-purple-900/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
                Sales Dashboard
              </h1>
              <p className="text-slate-300/80 mt-2 text-sm md:text-lg font-medium">
                Track your ecommerce performance with precision
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-in">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-white/20 text-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-semibold hover:border-cyan-400/50"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 border border-white/20 backdrop-blur-sm">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        {/* Key Performance Metrics */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-8 md:mb-12 animate-fade-in">
            Key Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(mockSalesData.totalRevenue)}
              change="+12.5% from last month"
              icon="💰"
              delay={100}
            />
            <StatCard
              title="Total Orders"
              value={mockSalesData.totalOrders.toLocaleString()}
              change="+8.2% from last month"
              icon="📦"
              delay={200}
            />
            <StatCard
              title="Average Order Value"
              value={formatCurrency(mockSalesData.averageOrderValue)}
              change="+3.1% from last month"
              icon="💳"
              delay={300}
            />
            <StatCard
              title="Conversion Rate"
              value={`${mockSalesData.conversionRate}%`}
              change="+0.5% from last month"
              icon="📈"
              delay={400}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12 md:mb-20 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Revenue Chart */}
            <div
              className="p-6 md:p-10 bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 hover:-translate-y-1 animate-slide-in-up relative overflow-scroll"
              style={{ animationDelay: "500ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-10 flex items-center relative z-10">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mr-4 animate-pulse"></div>
                Monthly Revenue Trends
              </h3>
              
              <div className="flex items-end justify-between space-x-2 md:space-x-4 h-48 px-2 md:px-6 relative z-10">
                {mockSalesData.monthlyData.map((data, index) => (
                  <ChartBar
                    key={data.month}
                    height={(data.revenue / 26000) * 100}
                    label={data.month}
                    value={data.revenue}
                    delay={600 + index * 100}
                  />
                ))}
              </div>
            </div>

            {/* Orders Chart */}
            <div
              className="p-6 md:p-10 bg-gradient-to-br from-slate-900/95 via-blue-900/20 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 hover:-translate-y-1 animate-slide-in-up relative overflow-scroll"
              style={{ animationDelay: "600ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-10 flex items-center relative z-10">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                Monthly Order Volume
              </h3>
              
              <div className="flex items-end justify-between space-x-2 md:space-x-4 h-48 px-2 md:px-6 relative z-10">
                {mockSalesData.monthlyData.map((data, index) => (
                  <ChartBar
                    key={data.month}
                    height={(data.orders / 260) * 100}
                    label={data.month}
                    value={data.orders}
                    delay={700 + index * 100}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products and Orders Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
          {/* Top Products */}
          <div
            className="p-6 md:p-10 bg-gradient-to-br from-slate-900/95 via-emerald-900/20 to-cyan-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-700 hover:-translate-y-1 animate-slide-in-up relative overflow-hidden"
            style={{ animationDelay: "800ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-10 flex items-center relative z-10">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mr-4 animate-pulse"></div>
              Top Performing Products
            </h3>
            
            <div className="space-y-4 md:space-y-6 relative z-10">
              {mockSalesData.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-2xl hover:from-emerald-800/30 hover:via-slate-700/60 hover:to-cyan-800/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl border border-white/10 hover:border-emerald-400/30 backdrop-blur-sm space-y-2 sm:space-y-0"
                  style={{ animationDelay: `${900 + index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-bold text-white text-sm md:text-base">{product.name}</p>
                      <p className="text-xs md:text-sm text-slate-300/80">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right ml-auto">
                    <p className="font-black text-lg md:text-xl bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div
            className="p-6 md:p-10 bg-gradient-to-br from-slate-900/95 via-blue-900/20 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 hover:-translate-y-1 animate-slide-in-up relative overflow-hidden"
            style={{ animationDelay: "900ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-10 flex items-center relative z-10">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              Recent Order Activity
            </h3>
            
            <div className="space-y-4 md:space-y-6 relative z-10">
              {mockSalesData.recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-2xl hover:from-blue-800/30 hover:via-slate-700/60 hover:to-purple-800/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl border border-white/10 hover:border-blue-400/30 backdrop-blur-sm space-y-3 sm:space-y-0"
                  style={{ animationDelay: `${1000 + index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-bold text-white text-sm md:text-base">{order.id}</p>
                      <p className="text-xs md:text-sm text-slate-300/80">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col lg:flex-row items-start sm:items-end lg:items-center space-x-4 sm:space-x-0 lg:space-x-4 sm:space-y-2 lg:space-y-0">
                    <p className="font-black text-lg md:text-xl bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      {formatCurrency(order.amount)}
                    </p>
                    <span
                      className={`text-xs px-3 py-2 rounded-full font-bold border backdrop-blur-sm whitespace-nowrap ${
                        order.status === "Completed"
                          ? "bg-emerald-900/40 text-emerald-300 border-emerald-400/50"
                          : order.status === "Processing"
                            ? "bg-amber-900/40 text-amber-300 border-amber-400/50"
                            : order.status === "Shipped"
                              ? "bg-blue-900/40 text-blue-300 border-blue-400/50"
                              : "bg-slate-800/60 text-slate-300 border-slate-400/50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Insights */}
        <section className="mb-12 md:mb-20">
          <div
            className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-blue-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 hover:-translate-y-1 animate-slide-in-up relative overflow-hidden"
            style={{ animationDelay: "1000ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-center mb-12 md:mb-16 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent relative z-10">
              Performance Insights & Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative z-10">
              <div className="text-center p-6 md:p-10 bg-gradient-to-br from-slate-800/60 via-purple-800/20 to-slate-800/60 rounded-3xl hover:from-purple-800/40 hover:via-slate-700/60 hover:to-blue-800/40 transition-all duration-700 hover:scale-110 hover:shadow-2xl border border-white/10 hover:border-purple-400/30 backdrop-blur-sm transform hover:-rotate-1">
                <div className="text-5xl md:text-6xl mb-6 filter drop-shadow-lg animate-bounce">🚀</div>
                <h4 className="font-black  mb-4 text-lg md:text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Growth Momentum
                </h4>
                <p className="text-slate-300/90 text-sm md:text-base leading-relaxed">
                  Revenue is up 12.5% compared to last month, showing strong growth momentum across all categories.
                </p>
              </div>
              
              <div className="text-center p-6 md:p-10 bg-gradient-to-br from-slate-800/60 via-emerald-800/20 to-slate-800/60 rounded-3xl hover:from-emerald-800/40 hover:via-slate-700/60 hover:to-cyan-800/40 transition-all duration-700 hover:scale-110 hover:shadow-2xl border border-white/10 hover:border-emerald-400/30 backdrop-blur-sm transform hover:rotate-1">
                <div className="text-5xl md:text-6xl mb-6 filter drop-shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🎯</div>
                <h4 className="font-black  mb-4 text-lg md:text-xl bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Top Performer
                </h4>
                <p className="text-slate-300/90 text-sm md:text-base leading-relaxed">
                  Wireless Headphones are your best-selling product this month with exceptional conversion rates.
                </p>
              </div>
              
              <div className="text-center p-6 md:p-10 bg-gradient-to-br from-slate-800/60 via-blue-800/20 to-slate-800/60 rounded-3xl hover:from-blue-800/40 hover:via-slate-700/60 hover:to-purple-800/40 transition-all duration-700 hover:scale-110 hover:shadow-2xl border border-white/10 hover:border-blue-400/30 backdrop-blur-sm transform hover:-rotate-1">
                <div className="text-5xl md:text-6xl mb-6 filter drop-shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>💡</div>
                <h4 className="font-black  mb-4 text-lg md:text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Strategic Recommendation
                </h4>
                <p className="text-slate-300/90 text-sm md:text-base leading-relaxed">
                  Consider increasing inventory for high-performing products to capitalize on current demand trends.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            height: 0%;
          }
          to {
            height: var(--target-height);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 1.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6, #06b6d4);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7c3aed, #0891b2);
        }
        
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 rgba(51, 65, 85, 0.3);
        }
      `}</style>
    </div>
  )
}

export default SalesReportDashboard