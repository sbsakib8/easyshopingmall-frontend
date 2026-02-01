"use client"
import { useGetAllOrders } from '@/src/utlis/useGetAllOrders';
import { useGetProduct } from '@/src/utlis/userProduct';
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const ProductAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { allOrders, loading: ordersLoading } = useGetAllOrders()
  const [page, setPage] = useState(1);
    const formData = useMemo(
      () => ({
        page,
        limit: 5000,
        search: "",
      }),
      [page]
    );
 const { product,totalCount,refetch } = useGetProduct(formData);
  // Sample data - in real app, this would come from API
  const salesData = [
    { date: '2024-08-26', sales: 4500, orders: 45, revenue: 67500 },
    { date: '2024-08-27', sales: 5200, orders: 52, revenue: 78000 },
    { date: '2024-08-28', sales: 4800, orders: 48, revenue: 72000 },
    { date: '2024-08-29', sales: 6100, orders: 61, revenue: 91500 },
    { date: '2024-08-30', sales: 5500, orders: 55, revenue: 82500 },
    { date: '2024-08-31', sales: 7200, orders: 72, revenue: 108000 },
    { date: '2024-09-01', sales: 6800, orders: 68, revenue: 102000 }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 245, revenue: 36750, growth: 12.5 },
    { name: 'Smart Watch', sales: 189, revenue: 47250, growth: 8.3 },
    { name: 'Phone Case', sales: 156, revenue: 4680, growth: -2.1 },
    { name: 'Bluetooth Speaker', sales: 134, revenue: 20100, growth: 15.7 },
    { name: 'Power Bank', sales: 98, revenue: 9800, growth: 5.4 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, sales: 15420 },
    { name: 'Accessories', value: 28, sales: 12340 },
    { name: 'Clothing', value: 20, sales: 8900 },
    { name: 'Books', value: 10, sales: 4200 },
    { name: 'Home & Garden', value: 7, sales: 3100 }
  ];

  const conversionData = [
    { day: 'Mon', visitors: 2400, conversions: 240, rate: 10 },
    { day: 'Tue', visitors: 3200, conversions: 352, rate: 11 },
    { day: 'Wed', visitors: 2800, conversions: 308, rate: 11 },
    { day: 'Thu', visitors: 3500, conversions: 385, rate: 11 },
    { day: 'Fri', visitors: 4200, conversions: 504, rate: 12 },
    { day: 'Sat', visitors: 3800, conversions: 456, rate: 12 },
    { day: 'Sun', visitors: 3100, conversions: 341, rate: 11 }
  ];

  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const StatCard = ({ title, value, change, icon, isPositive }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400 text-sm font-medium">{title}</div>
        <div className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-2 group-hover:text-purple-100 transition-colors duration-300">
        {isLoading ? (
          <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
        ) : (
          value
        )}
      </div>
      <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isLoading ? (
          <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
        ) : (
          `${change} from last period`
        )}
      </div>
    </div>
  );

  const ProductRow = ({ product, index }) => (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-102 hover:shadow-lg group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold group-hover:from-purple-400 group-hover:to-purple-600 transition-all duration-300">
          {index + 1}
        </div>
        <div>
          <div className="text-white font-medium group-hover:text-purple-100 transition-colors duration-300">{product.name}</div>
          <div className="text-gray-400 text-sm">{product.sales} units sold</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white font-bold">${product.revenue.toLocaleString()}</div>
        <div className={`text-sm font-medium ${product.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {product.growth > 0 ? '+' : ''}{product.growth}%
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-800 rounded-xl"></div>
              <div className="h-96 bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-4 md:p-6 overflow-hidden">
      <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold  mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Product Analytics
            </h1>
            <p className="text-gray-400">Track your product performance and sales metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Products" 
            value={totalCount}
            change="+12.5%" 
            isPositive={true}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path></svg>}
          />
          <StatCard 
            title="Total Orders" 
            value={allOrders?.length} 
            change="+8.2%" 
            isPositive={true}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" clipRule="evenodd"></path></svg>}
          />
          {/* <StatCard 
            title="Conversion Rate" 
            value="11.2%" 
            change="+2.1%" 
            isPositive={true}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>}
          /> */}
          <StatCard 
            title="Avg Order Value" 
            value="$439" 
            change="-1.8%" 
            isPositive={false}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:scale-102 hover:shadow-2xl animate-slide-in-left overflow-scroll">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Sales Trend</h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #6B7280',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fill="url(#salesGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 transform hover:scale-102 hover:shadow-2xl animate-slide-in-right overflow-scroll">
            <h3 className="text-xl font-bold text-white mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #6B7280',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-300 text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products and Conversion Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Top Products</h3>
              <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-400 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <ProductRow key={product.name} product={product} index={index} />
              ))}
            </div>
          </div>

          {/* Conversion Rate Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-fade-in ">
            <h3 className="text-xl font-bold text-white mb-6">Conversion Rate</h3>
            <ResponsiveContainer className="overflow-scroll" width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #6B7280',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Performance and Real-time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Performance */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-slide-in-up">
            <h3 className="text-xl font-bold text-white mb-6">Weekly Performance</h3>
            <ResponsiveContainer className="overflow-scroll" width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #6B7280',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Real-time Metrics */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-slide-in-up">
            <h3 className="text-xl font-bold text-white mb-6">Live Metrics</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2 animate-pulse">24</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">$2,340</div>
                <div className="text-gray-400 text-sm">Today's Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">156</div>
                <div className="text-gray-400 text-sm">Page Views</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Product Performance Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-xl font-bold text-white mb-4 md:mb-0">Product Performance</h3>
            <div className="flex space-x-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105">
                Export Data
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
                Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-gray-300 font-medium pb-3">Product</th>
                  <th className="text-gray-300 font-medium pb-3">Sales</th>
                  <th className="text-gray-300 font-medium pb-3">Revenue</th>
                  <th className="text-gray-300 font-medium pb-3">Growth</th>
                  <th className="text-gray-300 font-medium pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <td className="py-4 text-white font-medium">{product.name}</td>
                    <td className="py-4 text-gray-300">{product.sales}</td>
                    <td className="py-4 text-white">${product.revenue.toLocaleString()}</td>
                    <td className={`py-4 font-medium ${product.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.growth > 10 ? 'bg-green-800 text-green-200' :
                        product.growth > 0 ? 'bg-yellow-800 text-yellow-200' :
                        'bg-red-800 text-red-200'
                      }`}>
                        {product.growth > 10 ? 'Trending' : product.growth > 0 ? 'Stable' : 'Declining'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-6 rounded-xl border border-purple-600 hover:border-purple-400 transition-all duration-500 transform hover:scale-105 animate-fade-in">
            <h4 className="text-lg font-bold text-white mb-4">Customer Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Returning Customers</span>
                <span className="text-white font-bold">67%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">New Customers</span>
                <span className="text-white font-bold">33%</span>
              </div>
              <div className="w-full bg-purple-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl border border-blue-600 hover:border-blue-400 transition-all duration-500 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-bold text-white mb-4">Inventory Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">In Stock</span>
                <span className="text-white font-bold">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Low Stock</span>
                <span className="text-yellow-400 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Out of Stock</span>
                <span className="text-red-400 font-bold">12</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-600 hover:border-green-400 transition-all duration-500 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-bold text-white mb-4">Performance Score</h4>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">8.7</div>
              <div className="text-green-200 text-sm">Overall Rating</div>
              <div className="flex justify-center mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= 4 ? 'text-green-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .grid {
            gap: 1rem;
          }
          
          .p-6 {
            padding: 1rem;
          }
          
          .text-3xl {
            font-size: 1.5rem;
          }
          
          .text-4xl {
            font-size: 2rem;
          }
        }
        
        /* Smooth scrolling for better mobile experience */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1F2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #8B5CF6;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #A78BFA;
        }
      `}</style>
    </div>
  )
}

export default ProductAnalytics;