"use client"

import { useState, useEffect } from "react"

const TrafficAnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    revenue: 0,
  })

  const [chartData, setChartData] = useState([])
  const [topPages, setTopPages] = useState([])
  const [trafficSources, setTrafficSources] = useState([])
  const [deviceStats, setDeviceStats] = useState([])

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyticsData({
        totalVisitors: 24567,
        pageViews: 89432,
        bounceRate: 34.2,
        avgSessionDuration: 245,
        conversionRate: 3.8,
        revenue: 45678,
      })

      setChartData([
        { date: "2024-01-01", visitors: 1200, pageViews: 3400, revenue: 2400 },
        { date: "2024-01-02", visitors: 1800, pageViews: 4200, revenue: 3200 },
        { date: "2024-01-03", visitors: 2200, pageViews: 5100, revenue: 4100 },
        { date: "2024-01-04", visitors: 1900, pageViews: 4800, revenue: 3800 },
        { date: "2024-01-05", visitors: 2400, pageViews: 5600, revenue: 4500 },
        { date: "2024-01-06", visitors: 2800, pageViews: 6200, revenue: 5200 },
        { date: "2024-01-07", visitors: 3200, pageViews: 7100, revenue: 5800 },
      ])

      setTopPages([
        { page: "/products", views: 15420, percentage: 32.4 },
        { page: "/home", views: 12340, percentage: 26.1 },
        { page: "/categories", views: 8760, percentage: 18.5 },
        { page: "/checkout", views: 5430, percentage: 11.4 },
        { page: "/about", views: 3210, percentage: 6.8 },
      ])

      setTrafficSources([
        { source: "Organic Search", visitors: 12340, percentage: 45.2 },
        { source: "Direct", visitors: 8760, percentage: 32.1 },
        { source: "Social Media", visitors: 4320, percentage: 15.8 },
        { source: "Email", visitors: 1890, percentage: 6.9 },
      ])

      setDeviceStats([
        { device: "Desktop", users: 14567, percentage: 59.3 },
        { device: "Mobile", users: 8901, percentage: 36.2 },
        { device: "Tablet", users: 1099, percentage: 4.5 },
      ])

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [selectedTimeRange])

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Loading component
  const LoadingCard = () => (
    <div className="glass-effect rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-muted rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-muted rounded w-1/2"></div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden ">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-pink-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9 space-y-6">
          <div className="animate-fade-in-up">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient-x">
                    Traffic Analytics
                  </h1>
                  <p className="text-gray-300 text-lg">Monitor your ecommerce performance and visitor insights</p>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  {["24h", "7d", "30d", "90d"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedTimeRange(range)}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                        selectedTimeRange === range
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 animate-pulse-glow scale-105"
                          : "backdrop-blur-sm bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105 border border-white/20"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-slide-up-stagger">
            {isLoading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="h-8 bg-white/10 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))
            ) : (
              <>
                <EnhancedMetricCard
                  title="Total Visitors"
                  value={formatNumber(analyticsData.totalVisitors)}
                  change="+12.5%"
                  positive={true}
                  icon="👥"
                  gradient="from-blue-500 to-cyan-500"
                />
                <EnhancedMetricCard
                  title="Page Views"
                  value={formatNumber(analyticsData.pageViews)}
                  change="+8.3%"
                  positive={true}
                  icon="📄"
                  gradient="from-purple-500 to-pink-500"
                />
                <EnhancedMetricCard
                  title="Bounce Rate"
                  value={`${analyticsData.bounceRate}%`}
                  change="-2.1%"
                  positive={true}
                  icon="⚡"
                  gradient="from-green-500 to-emerald-500"
                />
                <EnhancedMetricCard
                  title="Avg. Session"
                  value={formatDuration(analyticsData.avgSessionDuration)}
                  change="+15.2%"
                  positive={true}
                  icon="⏱️"
                  gradient="from-orange-500 to-red-500"
                />
                <EnhancedMetricCard
                  title="Conversion Rate"
                  value={`${analyticsData.conversionRate}%`}
                  change="+0.5%"
                  positive={true}
                  icon="🎯"
                  gradient="from-indigo-500 to-purple-500"
                />
                <EnhancedMetricCard
                  title="Revenue"
                  value={`$${formatNumber(analyticsData.revenue)}`}
                  change="+23.1%"
                  positive={true}
                  icon="💰"
                  gradient="from-yellow-500 to-orange-500"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            {/* Enhanced Visitors Chart */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Visitors Trend</h3>
              {isLoading ? (
                <div className="h-64 bg-white/5 rounded animate-pulse"></div>
              ) : (
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="visitorsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Enhanced chart lines with glow effect */}
                    <polyline
                      fill="none"
                      stroke="url(#visitorsGradient)"
                      strokeWidth="4"
                      points="50,150 100,120 150,100 200,110 250,80 300,60 350,40"
                      className="animate-draw-line"
                      filter="url(#glow)"
                    />

                    {/* Enhanced fill area */}
                    <polygon
                      fill="url(#visitorsGradient)"
                      points="50,150 100,120 150,100 200,110 250,80 300,60 350,40 350,180 50,180"
                      className="animate-fill-area"
                    />

                    {/* Enhanced data points with hover effects */}
                    {chartData.map((point, index) => (
                      <circle
                        key={index}
                        cx={50 + index * 50}
                        cy={150 - point.visitors / 50}
                        r="6"
                        fill="rgb(59, 130, 246)"
                        className="animate-pop-in hover:r-8 transition-all cursor-pointer drop-shadow-lg"
                        style={{ animationDelay: `${index * 0.1 + 1}s` }}
                        filter="url(#glow)"
                      />
                    ))}
                  </svg>
                </div>
              )}
            </div>

            {/* Enhanced Revenue Chart */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Revenue Trend</h3>
              {isLoading ? (
                <div className="h-64 bg-white/5 rounded animate-pulse"></div>
              ) : (
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    {/* Enhanced revenue bars with gradient and glow */}
                    {chartData.map((point, index) => (
                      <rect
                        key={index}
                        x={40 + index * 45}
                        y={180 - point.revenue / 50}
                        width="30"
                        height={point.revenue / 50}
                        fill="url(#revenueGradient)"
                        className="animate-grow-bar hover:opacity-80 transition-all cursor-pointer drop-shadow-lg"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        rx="4"
                      />
                    ))}
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Enhanced Top Pages */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Top Pages</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-12 bg-white/5 rounded animate-pulse"></div>
                    ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105"
                    >
                      <div>
                        <p className="font-medium text-white">{page.page}</p>
                        <p className="text-sm text-gray-300">{formatNumber(page.views)} views</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {page.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Traffic Sources */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Traffic Sources</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-12 bg-white/5 rounded animate-pulse"></div>
                    ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {trafficSources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105"
                    >
                      <div>
                        <p className="font-medium text-white">{source.source}</p>
                        <p className="text-sm text-gray-300">{formatNumber(source.visitors)} visitors</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                          {source.percentage}%
                        </p>
                        <div className="w-16 h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-1000 animate-progress-fill"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Device Stats */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
              <h3 className="text-xl font-semibold mb-4 text-white">Device Breakdown</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-12 bg-white/5 rounded animate-pulse"></div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {deviceStats.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{device.device}</span>
                        <span className="text-sm text-gray-300">{device.percentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 animate-progress-fill ${
                            index === 0
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : index === 1
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "bg-gradient-to-r from-pink-500 to-red-500"
                          }`}
                          style={{
                            width: `${device.percentage}%`,
                            animationDelay: `${index * 0.2}s`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-300">{formatNumber(device.users)} users</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Real-time Activity</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-sm text-gray-300">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  127
                </p>
                <p className="text-sm text-gray-300">Active Users</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  43
                </p>
                <p className="text-sm text-gray-300">Page Views/min</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  8
                </p>
                <p className="text-sm text-gray-300">Conversions/hr</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  $2,340
                </p>
                <p className="text-sm text-gray-300">Revenue Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedMetricCard({ title, value, change, positive, icon, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
      ></div>
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-500 cursor-pointer hover:scale-105 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl filter drop-shadow-lg">{icon}</span>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm ${
              positive
                ? "text-green-300 bg-green-500/20 border border-green-500/30"
                : "text-red-300 bg-red-500/20 border border-red-500/30"
            }`}
          >
            {change}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
        <p
          className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export default TrafficAnalyticsDashboard
