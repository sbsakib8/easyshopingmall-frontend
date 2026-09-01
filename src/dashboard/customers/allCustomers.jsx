"use client";

import { getCustomers } from "@/src/hook/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomerDetailsModal from "./CustomerDetailsModal";

const AllCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const fetchCustomers = async (page = 1, search = "", status = "") => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        search,
        status: status === "all" ? "" : status,
      };

      const response = await getCustomers(params);
      const customersData = response?.customers || [];

      const formattedCustomers = customersData.map((user) => ({
        id: user._id,
        name: user.name || "No Name",
        email: user.email || "No Email",
        phone: user.mobile || "N/A",
        address: user.address_details?.[0] || "No address",
        joinDate: user.createdAt || null,
        totalOrders: user.orderStats?.orderCount || 0,
        totalSpent: user.orderStats?.totalSpent || 0,
        lastOrder: user.orderStats?.lastOrderDate || null,
        status: user.status === "Active" ? "active" : "inactive",
        avatar: user.image || "/placeholder.svg",
        rating: 5,
      }));

      setCustomers(formattedCustomers);
      setPagination(response?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: itemsPerPage,
      });
    } catch (err) {
      console.error("Fetch customer error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchCustomers(1, value, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(1);
    fetchCustomers(1, searchTerm, value);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id));
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const totalPages = pagination.totalPages;
  const totalCount = pagination.totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className={`py-5 px-2 lg:px-9`}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-300 mb-2">
                  All Customers
                </h1>
                <p className="text-gray-400">
                  Manage and view all your customers
                </p>
              </div>
            </div>
          </div>
        </div>

          {/* Stats Cards */}
          <div className="w-full mt-3 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: "Total Customers",
                  value: totalCount,
                  icon: "👥",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Active Customers",
                  value: customers.filter((c) => c.status === "active").length,
                  icon: "✅",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 w-full flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}
                >
                  {stat.icon}
                </div>
                <h3 className="text-gray-400 text-sm font-medium">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-slate-300 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Search (Left / Top in mobile) */}
              <div className="flex-1 relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full sm:w-[500px] pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter (Right / Bottom in mobile) */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="w-full sm:w-[200px] px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCustomers.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">
                  {selectedCustomers.length} customer
                  {selectedCustomers.length > 1 ? "s" : ""}
                  {""}
                  selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCustomers([])}
                    className="px-4 py-2 bg-gray-600 text-slate-300 rounded-lg hover:bg-gray-700"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Table */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={
                    selectedCustomers.length === customers.length &&
                    customers.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300 font-medium">
                  Customer Information
                </span>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-700/50">
              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">Loading...</div>
                </div>
              ) : customers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">
                    No customers found
                  </div>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="px-6 py-4 hover:bg-gray-700/30"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />

                      {/* Customer Info */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Avatar and Basic Info */}
                        <div className="lg:col-span-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center bg-gray-800 text-slate-300 font-bold text-lg overflow-hidden">
                            {customer?.avatar?.trim() ? (
                              <img
                                src={customer?.avatar}
                                alt={
                                  customer?.name?.charAt(0).toUpperCase() || "U"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full border-2 border-yellow-500 bg-gray-600 flex items-center justify-center text-slate-300 font-bold text-lg">
                                {customer?.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <h3 className="text-slate-300 font-semibold">
                              {customer.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Mail className="w-3 h-3" />
                              <span>{customer.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {customer?.address?.address_line || "none"}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                            <ShoppingBag className="w-3 h-3" />
                            {customer?.totalOrders} orders
                          </div>
                          <div className="text-xs text-gray-500">
                            ৳{customer?.totalSpent?.toLocaleString() || 0} spent
                          </div>
                        </div>

                        {/* Status */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                customer.status === "active"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {customer.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 flex items-center justify-end">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewCustomer(customer)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg"
                              title="View Customer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-gray-400 text-sm">
                Showing {pagination.limit * (pagination.currentPage - 1) + 1} to{" "}
                {Math.min(pagination.limit * pagination.currentPage, totalCount)} of{" "}
                {totalCount} customers
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-slate-300 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-slate-300"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-slate-300 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Customer Detail Modal */}
        <CustomerDetailsModal
          isOpen={showCustomerModal && selectedCustomer}
          onClose={() => setShowCustomerModal(false)}
          customer={selectedCustomer ?? {}}
        />
      </div>
    </div>
  );
};
export default AllCustomersPage;
