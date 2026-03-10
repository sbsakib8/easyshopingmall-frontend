"use client"
import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Package, Calendar, User, Phone, DollarSign, TrendingUp, Filter } from 'lucide-react';

const FAKE_ORDERS = [
  {
    id: "ORD001",
    date: "2024-03-10",
    customerName: "Md. Akib Khan",
    customerNumber: "01712345678",
    status: "pending",
    productImage: "/images/product1.jpg",
    productName: "Premium Wireless Headphones",
    productPrice: 1500,
    sellPrice: 2000,
    profit: 500
  },
  {
    id: "ORD002",
    date: "2024-03-09",
    customerName: "Sarah Ahmed",
    customerNumber: "01887654321",
    status: "processing",
    productImage: "/images/product2.jpg",
    productName: "Smart Watch Series 7",
    productPrice: 3200,
    sellPrice: 4500,
    profit: 1300
  },
  {
    id: "ORD003",
    date: "2024-03-08",
    customerName: "Tanvir Hasan",
    customerNumber: "01911223344",
    status: "delivered",
    productImage: "/images/product3.jpg",
    productName: "Gaming Mouse RGB",
    productPrice: 800,
    sellPrice: 1200,
    profit: 400
  },
  {
    id: "ORD004",
    date: "2024-03-07",
    customerName: "Laila Karim",
    customerNumber: "01556677889",
    status: "canceled",
    productImage: "/images/product4.jpg",
    productName: "Mechanical Keyboard",
    productPrice: 2500,
    sellPrice: 3500,
    profit: 1000
  },
  {
    id: "ORD005",
    date: "2024-03-06",
    customerName: "Rahat Chowdhury",
    customerNumber: "01334455667",
    status: "processing",
    productImage: "/images/product5.jpg",
    productName: "USB-C Fast Charger",
    productPrice: 450,
    sellPrice: 750,
    profit: 300
  }
];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    canceled: "bg-rose-100 text-rose-700 border-rose-200"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const OrderList = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;

  const filteredOrders = useMemo(() => {
    return FAKE_ORDERS.filter(order => {
      const matchesFilter = filter === "all" || order.status === filter;
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerNumber.includes(searchQuery) ||
        order.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const filterOptions = ["all", "pending", "processing", "delivered", "canceled"];

  return (
    <div className="min-h-screen bg-bg p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-primary-color" />
            My Orders
          </h1>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize border ${filter === option
                  ? "bg-secondary text-accent border-secondary shadow-md shadow-secondary/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-secondary hover:text-secondary"
                  }`}
              >
                {option.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-color transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name, order ID, or product..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-color/20 focus:border-primary-color transition-all shadow-sm"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {currentOrders.length > 0 ? (
            currentOrders.map(order => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-primary-color group">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

                  {/* Left: Product Image & Basic Info */}
                  <div className="flex items-center gap-4 w-full lg:w-1/3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50 shadow-inner">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-400 font-mono">{order.id}</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 truncate mb-1">{order.productName}</h3>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="font-medium truncate">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span>{order.customerNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Details Button */}
                  <div className="hidden lg:flex flex-1 justify-center">
                    <button className="flex items-center gap-1 px-5 py-2 rounded-full border border-btn-color/20 bg-btn-color/5 text-btn-color text-sm font-bold hover:bg-btn-color hover:text-white transition-all duration-300 transform hover:scale-105">
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Pricing & Profit */}
                  <div className="w-full lg:w-1/3 flex justify-between lg:justify-end items-center gap-8 lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 mt-2 lg:mt-0">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Product Price</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center lg:justify-end gap-1">
                        <DollarSign className="w-3 h-3" /> {order.productPrice}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sell Price</p>
                      <p className="text-sm font-bold text-slate-900 flex items-center lg:justify-end gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" /> {order.sellPrice}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-primary-color opacity-70 font-bold">Profit</p>
                      <div className="bg-primary-color/10 px-3 py-1 rounded-lg border border-primary-color/20 inline-flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                        <TrendingUp className="w-4 h-4 text-primary-color" />
                        <span className="text-base font-black text-accent">Tk {order.profit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Details Button */}
                  <button className="lg:hidden w-full py-3 rounded-xl bg-slate-50 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mt-2">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No orders found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any orders matching your current filters or search query.</p>
              <button
                onClick={() => { setFilter("all"); setSearchQuery(""); setCurrentPage(1); }}
                className="mt-6 text-primary-color font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8 pb-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-all ${currentPage === 1
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white text-slate-600 border-slate-200 hover:border-secondary hover:text-secondary"
                }`}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${currentPage === num
                    ? "bg-secondary text-accent border-secondary shadow-lg shadow-secondary/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-scondary hover:bg-scondary/5"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-all ${currentPage === totalPages
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white text-slate-600 border-slate-200 hover:border-scondary hover:text-scondary"
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderList;