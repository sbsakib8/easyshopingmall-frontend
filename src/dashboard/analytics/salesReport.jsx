"use client"
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, XCircle, Calendar, Filter, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAllOrders } from '@/src/utlis/useGetAllOrders';
import DashboardLoader from '@/src/helper/loading/DashboardLoader';
import { useGetEmail } from '@/src/utlis/content/useEmail';

const SalesReportDashboard = () => {
  const [chartType, setChartType] = useState('line');

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 11, 1)); // December 2025
  const [currentPage, setCurrentPage] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState()
  const { allOrders, loading } = useGetAllOrders()
  const { email, loading: emailLoading } = useGetEmail();
  const [dateRange, setDateRange] = useState({ start: '2025-11-02', end:  '2026-02-10' });
  const skip = 30

const getFormattedDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const pastDate = getFormattedDate(30);
const today = getFormattedDate(0);
console.log("pastDate--->:", pastDate,"today--->",today);


  // Filter data
  const filteredData = useMemo(() => {
    return allOrders?.filter(item => {
      const itemDate = new Date(item.updatedAt);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const dateMatch = itemDate >= startDate && itemDate <= endDate;
      const statusMatch = filterStatus === 'all' || item.order_status === filterStatus;
      return dateMatch && statusMatch;
    });
  }, [ dateRange, filterStatus, searchTerm, allOrders]);
  let totalPage = Math.ceil(filteredData?.length / skip)

  // Search data
  const searchData = useMemo(() => {
    return allOrders?.filter(item => {
      const matchesSearch =
        item?.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.address?.mobile==searchTerm 
      return matchesSearch;
    });
  }, [searchTerm, allOrders]);

  // sorting by order status 
  const orderPriority = ["pending", "completed", "cancelled"];
  const sortedData = searchData?.sort((a, b) => {
    return (
      orderPriority.indexOf(a.order_status) -
      orderPriority.indexOf(b.order_status)
    );
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = filteredData?.filter(item => item.order_status === 'completed');
    const cancelled = filteredData?.filter(item => item?.order_status === 'cancelled');
    const pending = filteredData?.filter(item => item?.order_status === 'pending');
    if (pending?.length > 0 && filterStatus !== "all") {
      const revenue = pending?.reduce((sum, item) => sum + item?.totalAmt, 0);
      setTotalRevenue(revenue)

    } else if (cancelled?.length > 0 && filterStatus !== "all") {
      const revenue = cancelled?.reduce((sum, item) => sum + item?.totalAmt, 0);
      setTotalRevenue(revenue)

    } else if (completed?.length > 0 || filterStatus == "all") {
      const revenue = completed?.reduce((sum, item) => sum + item?.totalAmt, 0);
      setTotalRevenue(revenue)
    } else {
      setTotalRevenue(0)
    }


    const totalOrders = filteredData?.length;
    const conversionRate = totalOrders > 0 ? (completed.length / totalOrders) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      conversionRate: conversionRate.toFixed(2),
      cancelledOrders: cancelled?.length
    };
  }, [filteredData, allOrders, totalRevenue, filterStatus]);

  // Daily analytics data for charts
  const dailyData = useMemo(() => {
    const dailyMap = {};
    filteredData?.forEach(item => {
      const madeDate = new Date(item.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      const day = madeDate;
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, sales: 0, orders: 0, cancelled: 0,pending:0 };
      }
      if (item.order_status === 'completed') {
        dailyMap[day].sales += item.totalAmt;
        dailyMap[day].orders += 1;
      } else if (item.order_status === 'cancelled') {
        dailyMap[day].cancelled += 1;
      }else if (item.order_status === 'pending') {
        dailyMap[day].pending += 1;
      }
    });
    return Object.values(dailyMap);
  }, [filteredData]);

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateInRange = (day) => {
    if (!day) return false;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return date >= start && date <= end;
  };

  const handleDateClick = (day) => {

    if (!day) return;
    const clickedDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);

    const dateStr = clickedDate.toISOString().split('T')[0];

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dateStr, end: '' });

    } else {

      if (new Date(dateStr) < new Date(dateRange.start)) {
        setDateRange({ start: dateStr, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: dateStr });
      }
      setShowCalendar(false);
    }
  };

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return 'Select Date Range';
  };

  const changeMonth = (direction) => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1));
  };
  // console.log("dailyData ---->", dailyData)
  if (loading || emailLoading) return <DashboardLoader />
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 overflow-hidden ml-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              E-Commerce Dashboard
            </h1>
            <p className="text-gray-400">Track your sales, orders, and performance in real-time</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${chartType === 'line'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
            >
              <TrendingUp size={18} />
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${chartType === 'bar'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
            >
              <BarChart size={18} />
              Bar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-100 text-sm">Total Revenue</p>
                <div className="bg-white/20 p-2 rounded-lg">
                  <DollarSign className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">৳{totalRevenue}</h3>
              <p className="text-green-200 text-sm">↑ +10.5% from last month</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-300 text-sm">Total Orders</p>
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <ShoppingCart className="text-cyan-400" size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{filteredData?.length}</h3>
              <p className="text-green-400 text-sm">↑ +8.2% from last month</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-100 text-sm">Conversion Rate</p>
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{email.length}%</h3>
              <p className="text-green-200 text-sm">↑ +2.1% from last month</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-300 text-sm">Cancelled Orders</p>
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <XCircle className="text-cyan-400" size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stats.cancelledOrders}</h3>
              <p className="text-red-400 text-sm">↓ -4.3% from last month</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50 ">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Filter size={20} />
              <span className="font-semibold">Filters:</span>
            </div>

            <div className="relative z-[9999]">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                <Calendar size={18} />
                <span>{formatDateRange()}</span>
              </button>

              {showCalendar && (
                <div className="relative top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl z-50 lg:min-w-[600px]">
                  <div className="flex flex-col md:flex-row gap-8 ">
                    {/* December 2025 */}
                    <div className="flex-1 ">
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-700 rounded">
                          <ChevronLeft size={20} className="text-gray-400" />
                        </button>
                        <h3 className="text-white font-semibold">
                          {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-700 rounded">
                          <ChevronRight size={20} className="text-gray-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-xs text-gray-500 font-semibold">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {getDaysInMonth(calendarMonth).map((day, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDateClick(day)}
                            disabled={!day}
                            className={`p-2 text-sm rounded-lg transition-colors ${!day ? 'invisible' :
                              isDateInRange(day) ? 'bg-cyan-500 text-white' :
                                'bg-slate-700 text-gray-300 hover:bg-slate-600'
                              }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* January 2026 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-6"></div>
                        <h3 className="text-white font-semibold">
                          {new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="w-6"></div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-xs text-gray-500 font-semibold">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {getDaysInMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)).map((day, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (day) {
                                const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, day);
                                const dateStr = nextMonth.toISOString().split('T')[0];
                                if (!dateRange.start || (dateRange.start && dateRange.end)) {
                                  setDateRange({ start: dateStr, end: '' });
                                } else {
                                  if (new Date(dateStr) < new Date(dateRange.start)) {
                                    setDateRange({ start: dateStr, end: dateRange.start });
                                  } else {
                                    setDateRange({ start: dateRange.start, end: dateStr });
                                  }
                                  setShowCalendar(false);
                                }
                              }
                            }}
                            disabled={!day}
                            className={`p-2 text-sm rounded-lg transition-colors ${!day ? 'invisible' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                              }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Sales Analytics Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Sales Analytics</h2>
            <p className="text-gray-400">Track your daily performance</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'line' ? (
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} name="Sales" />
                <Line type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} name="Orders" />
                <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Cancelled" />
                <Line type="monotone" dataKey="pending" stroke="#E67E22" strokeWidth={2} dot={{ fill: '#E67E22', r: 4 }} name="Pending" />
              </LineChart>
            ) : (
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
           
                <Bar dataKey="orders" fill="#a855f7" radius={[4, 4, 0, 0]} name="Orders" />
                <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
                <Bar dataKey="pending" fill="#E67E22" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex flex-col md:flex-row space-y-4 items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Recent Orders</h2>
              <p className="text-gray-400">Manage and track all orders</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Order ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Product</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Quantity</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedData?.slice((skip * currentPage), skip * (currentPage + 1)).map((order) => (
                  <tr key={order?.orderId} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 text-cyan-400 font-medium">{order?.orderId}</td>
                    <td className="py-4 px-4 text-gray-300">{new Date(order?.updatedAt).toDateString()}</td>
                    <td className="py-4 px-4 text-white">{order?.userId?.name}</td>
                    <td className="py-4 px-4 text-white">{order?.products[0]?.productId?.productName}</td>
                    <td className="py-4 px-4 text-gray-300">{order?.products[0]?.quantity}</td>
                    <td className="py-4 px-4 text-white font-semibold">${order?.totalAmt}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.order_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.order_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* pagination buttons */}
        <div className='flex justify-center flex-wrap mt-5 gap-y-3' >
          {[...Array(totalPage)].map((page, i) => <button onClick={() => setCurrentPage(i)} className={`px-4 py-1 rounded-sm mx-1 ${currentPage == i ? 'bg-[#00D3F2] ' : 'bg-white'}`}>{i}</button>)}
        </div>
      </div>
    </div>
  );
};

export default SalesReportDashboard;

