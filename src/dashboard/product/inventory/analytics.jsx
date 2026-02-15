"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, UserPlus, MoreHorizontal } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 25 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 25 },
    { month: 'Jul', value: 35 },
    { month: 'Aug', value: 20 },
    { month: 'Sep', value: 30 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 35, color: '#3B82F6' },
    { name: 'Tablet', value: 48, color: '#F59E0B' },
    { name: 'Mobile', value: 27, color: '#10B981' }
  ];

  const clicksData = [
    { day: '1', clicks: 20 },
    { day: '2', clicks: 35 },
    { day: '3', clicks: 45 },
    { day: '4', clicks: 30 },
    { day: '5', clicks: 55 },
    { day: '6', clicks: 40 },
    { day: '7', clicks: 60 }
  ];

  const viewsData = [
    { day: '1', views: 30 },
    { day: '2', views: 45 },
    { day: '3', views: 35 },
    { day: '4', views: 55 },
    { day: '5', views: 40 },
    { day: '6', views: 35 },
    { day: '7', views: 50 }
  ];

  const accountsData = [
    { month: 'Jan', accounts: 10 },
    { month: 'Feb', accounts: 20 },
    { month: 'Mar', accounts: 30 },
    { month: 'Apr', accounts: 25 },
    { month: 'May', accounts: 40 },
    { month: 'Jun', accounts: 50 },
    { month: 'Jul', accounts: 60 },
    { month: 'Aug', accounts: 45 },
    { month: 'Sep', accounts: 55 }
  ];

  const socialLeads = [
    { platform: 'Facebook', percentage: 55, color: '#1877F2' },
    { platform: 'LinkedIn', percentage: 67, color: '#0A66C2' }
  ];

  const campaigns = [
    { name: 'Campaigns', count: 54, growth: 28, isPositive: true }
  ];

  return (
    <div className={`min-h-screen  p-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-accent-content font-bold text-lg">JA</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Welcome back</p>
              <h1 className="text-accent-content text-xl font-bold">Jhon Anderson!</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-accent-content text-lg font-bold">42.5K</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-accent-content text-lg font-bold">97.4K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Today's Sales</p>
              <h3 className="text-accent-content text-2xl font-bold">$65.4K</h3>
            </div>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Growth Rate</p>
              <h3 className="text-accent-content text-2xl font-bold">78.4%</h3>
            </div>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-red-400 to-red-500 h-1 rounded-full w-4/5"></div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-accent-content text-3xl font-bold">78%</h3>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <p className="text-gray-400 text-sm mb-4">24K users increased from last month</p>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="78, 100"
                className="animate-pulse"
              />
            </svg>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </div>
        </div>

        {/* Growth Chart Mini */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">Growth</p>
            <span className="text-green-400 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              12.5%
            </span>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  className="animate-pulse"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-accent-content text-lg font-semibold">Monthly Revenue</h3>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis hide />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Average monthly sale for every author</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-accent-content text-2xl font-bold">68.9%</span>
              <span className="text-green-400 text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                34.5%
              </span>
            </div>
          </div>
        </div>

        {/* Device Type Pie Chart */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-accent-content text-lg font-semibold">Device Type</h3>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="relative">
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    className="hover:opacity-80 transition-opacity duration-300"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-accent-content text-2xl font-bold">68%</p>
                <p className="text-gray-400 text-sm">Total Views</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: device.color }}></div>
                  <span className="text-gray-300 text-sm">{device.name}</span>
                </div>
                <span className="text-accent-content font-medium">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Stats */}
        <div className="space-y-6">
          {/* Total Clicks */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <h3 className="text-accent-content text-2xl font-bold">82.7K</h3>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="h-16 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clicksData}>
                  <Bar
                    dataKey="clicks"
                    fill="url(#clicksGradient)"
                    radius={[2, 2, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#BE185D" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-green-400 text-sm font-medium">+12.5% from last month</p>
          </div>

          {/* Total Views */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <h3 className="text-accent-content text-2xl font-bold">68.4K</h3>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="h-16 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-green-400 text-sm font-medium">+39K users increased from last month</p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Campaign Stats */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-accent-content text-lg font-semibold">Campaign Stats</h3>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          {campaigns.map((campaign, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-accent-content" />
                </div>
                <span className="text-accent-content font-medium">{campaign.name}</span>
              </div>
              <div className="text-right">
                <p className="text-accent-content text-lg font-bold">{campaign.count}</p>
                <p className="text-green-400 text-sm font-medium">+{campaign.growth}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <div className="h-32 flex items-center justify-center mb-4">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl"></div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={false}
                    className="drop-shadow-lg"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Total Accounts */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Accounts</p>
              <h3 className="text-accent-content text-2xl font-bold">85,247</h3>
              <p className="text-green-400 text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +23.7%
              </p>
            </div>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accountsData}>
                <Line
                  type="monotone"
                  dataKey="accounts"
                  stroke="url(#accountsGradient)"
                  strokeWidth={3}
                  dot={false}
                  fill="url(#accountsAreaGradient)"
                />
                <defs>
                  <linearGradient id="accountsGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="accountsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(245, 158, 11, 0.3)" />
                    <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Social Leads Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-accent-content text-lg font-semibold">Social Leads</h3>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLeads.map((lead, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: lead.color }}>
                      {lead.platform === 'Facebook' ? (
                        <span className="text-accent-content text-sm font-bold">f</span>
                      ) : (
                        <span className="text-accent-content text-sm font-bold">in</span>
                      )}
                    </div>
                    <span className="text-accent-content font-medium">{lead.platform}</span>
                  </div>
                  <span className="text-accent-content text-lg font-bold">{lead.percentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${lead.percentage}%`,
                      background: `linear-gradient(90deg, ${lead.color}, ${lead.color}aa)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;