"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
} from "lucide-react"

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2023-01-15",
    totalOrders: 24,
    totalSpent: 2450.0,
    status: "active",
    avatar: "/thoughtful-man.png",
    lastOrder: "2024-01-20",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 234 567 8901",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    joinDate: "2023-03-22",
    totalOrders: 18,
    totalSpent: 1890.5,
    status: "active",
    avatar: "/diverse-woman-portrait.png",
    lastOrder: "2024-01-18",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 234 567 8902",
    address: "789 Pine St, Chicago, IL 60601",
    joinDate: "2023-05-10",
    totalOrders: 12,
    totalSpent: 980.25,
    status: "inactive",
    avatar: "/diverse-businessman.png",
    lastOrder: "2023-12-15",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 234 567 8903",
    address: "321 Elm St, Miami, FL 33101",
    joinDate: "2023-07-08",
    totalOrders: 31,
    totalSpent: 3250.75,
    status: "active",
    avatar: "/professional-woman.png",
    lastOrder: "2024-01-22",
    rating: 5.0,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 234 567 8904",
    address: "654 Maple Dr, Seattle, WA 98101",
    joinDate: "2023-09-14",
    totalOrders: 8,
    totalSpent: 650.0,
    status: "active",
    avatar: "/young-man.png",
    lastOrder: "2024-01-10",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 234 567 8905",
    address: "987 Cedar Ln, Boston, MA 02101",
    joinDate: "2023-11-03",
    totalOrders: 15,
    totalSpent: 1420.3,
    status: "active",
    avatar: "/young-woman.png",
    lastOrder: "2024-01-19",
    rating: 4.7,
  },
]

 const AllCustomersPage=()=> {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy ]
      let bValue = b[sortBy ]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage)

  // Handle customer selection
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(paginatedCustomers.map((customer) => customer.id))
    }
  }

  // Handle customer actions
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleEditCustomer = (customer) => {
    console.log("Edit customer:", customer)
    // Add edit functionality here
  }

  const handleDeleteCustomer = (customerId) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      setCustomers((prev) => prev.filter((customer) => !selectedCustomers.includes(customer.id)))
      setSelectedCustomers([])
    }
  }

  const handleExportCustomers = () => {
    setIsLoading(true)
    setTimeout(() => {
      console.log("Exporting customers...")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      <div className={`transition-all   duration-500 lg:ml-15 py-5 px-2 lg:px-9`}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
      {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
        <div className="w-full mx-auto ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">All Customers</h1>
              <p className="text-gray-400">Manage and view all your customers</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCustomers}
                disabled={isLoading}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isLoading ? "Exporting..." : "Export"}
              </button>
              <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="  w-full mt-3 px-5 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Customers", value: customers.length, icon: "👥", color: "from-blue-500 to-cyan-500" },
            {
              title: "Active Customers",
              value: customers.filter((c) => c.status === "active").length,
              icon: "✅",
              color: "from-green-500 to-emerald-500",
            },
            {
              title: "Total Revenue",
              value: `$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`,
              icon: "💰",
              color: "from-yellow-500 to-orange-500",
            },
            {
              title: "Avg. Order Value",
              value: `$${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)}`,
              icon: "📊",
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}
              >
                {stat.icon}
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="joinDate">Sort by Join Date</option>
                <option value="totalSpent">Sort by Total Spent</option>
                <option value="totalOrders">Sort by Total Orders</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition-all duration-300"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedCustomers([])}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
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
                checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300 font-medium">Customer Information</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/50">
            {paginatedCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="px-6 py-4 hover:bg-gray-700/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
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
                      <img
                        src={customer.avatar || "/placeholder.svg"}
                        alt={customer.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{customer.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-3 h-3" />
                          {customer.email}
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
                        {customer.address.split(",")[0]}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                        <ShoppingBag className="w-3 h-3" />
                        {customer.totalOrders} orders
                      </div>
                      <div className="text-sm font-semibold text-green-400">
                        ${customer.totalSpent.toLocaleString()}
                      </div>
                    </div>

                    {/* Status and Rating */}
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
                      <div className="flex items-center gap-1 text-sm text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        {customer.rating}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 flex items-center justify-end">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                          title="View Customer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-300"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedCustomers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No customers found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-gray-400 text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedCustomers.length)} of{" "}
              {filteredAndSortedCustomers.length} customers
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Customer Details</h2>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedCustomer.avatar || "/placeholder.svg"}
                  alt={selectedCustomer.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-600"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedCustomer.name}</h3>
                  <p className="text-gray-400">{selectedCustomer.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCustomer.status === "active"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      {selectedCustomer.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedCustomer.phone}
                      </div>
                      <div className="flex items-start gap-3 text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        {selectedCustomer.address}
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Joined {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Order Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Orders:</span>
                        <span className="text-white font-semibold">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Spent:</span>
                        <span className="text-green-400 font-semibold">
                          ${selectedCustomer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Average Order:</span>
                        <span className="text-white font-semibold">
                          ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Last Order:</span>
                        <span className="text-white font-semibold">
                          {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => handleEditCustomer(selectedCustomer)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  Edit Customer
                </button>
                <button
                  onClick={() => {
                    handleDeleteCustomer(selectedCustomer.id)
                    setShowCustomerModal(false)
                  }}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
export default AllCustomersPage