"use client"
import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Star,
  Download,
  RefreshCw,
  BarChart3,
  Bell,
  Settings,
  CheckSquare,
  Square,
  ArrowUpDown,
  FilterIcon,
} from "lucide-react"
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders"
import { OrderUpdate } from "@/src/utlis/useOrder"
import DashboardLoader from "@/src/compronent/loading/DashboardLoader"

const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1 234 567 8900",
    orderDate: "2024-01-15",
    status: "completed",
    total: 299.99,
    priority: "high",
    rating: 5,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 199.99 },
      { name: "Phone Case", quantity: 2, price: 50.0 },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-20",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+1 234 567 8901",
    orderDate: "2024-01-14",
    status: "pending",
    total: 149.99,
    priority: "medium",
    rating: null,
    items: [{ name: "Bluetooth Speaker", quantity: 1, price: 149.99 }],
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingNumber: null,
    estimatedDelivery: "2024-01-22",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    customerPhone: "+1 234 567 8902",
    orderDate: "2024-01-13",
    status: "shipped",
    total: 599.99,
    priority: "high",
    rating: 4,
    items: [
      { name: "Laptop Stand", quantity: 1, price: 99.99 },
      { name: "Wireless Mouse", quantity: 1, price: 79.99 },
      { name: "Keyboard", quantity: 1, price: 420.01 },
    ],
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-18",
  },
  {
    id: "ORD-004",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    customerPhone: "+1 234 567 8903",
    orderDate: "2024-01-12",
    status: "cancelled",
    total: 89.99,
    priority: "low",
    rating: 2,
    items: [{ name: "USB Cable", quantity: 3, price: 29.99 }],
    shippingAddress: "321 Elm St, Miami, FL 33101",
    trackingNumber: null,
    estimatedDelivery: null,
  },
  {
    id: "ORD-005",
    customerName: "David Brown",
    customerEmail: "david@example.com",
    customerPhone: "+1 234 567 8904",
    orderDate: "2024-01-11",
    status: "processing",
    total: 1299.99,
    priority: "high",
    rating: null,
    items: [
      { name: "Gaming Monitor", quantity: 1, price: 899.99 },
      { name: "HDMI Cable", quantity: 2, price: 200.0 },
    ],
    shippingAddress: "654 Maple Dr, Seattle, WA 98101",
    trackingNumber: "TRK456789123",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "ORD-006",
    customerName: "Emily Chen",
    customerEmail: "emily@example.com",
    customerPhone: "+1 234 567 8905",
    orderDate: "2024-01-10",
    status: "completed",
    total: 749.99,
    priority: "medium",
    rating: 5,
    items: [
      { name: "Smartwatch", quantity: 1, price: 399.99 },
      { name: "Watch Band", quantity: 1, price: 49.99 },
      { name: "Wireless Charger", quantity: 1, price: 299.99 },
    ],
    shippingAddress: "987 Cedar Ln, Austin, TX 78701",
    trackingNumber: "TRK789123456",
    estimatedDelivery: "2024-01-16",
  },
]

const statusColors = {
  pending: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/25",
  processing: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
  shipped: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
  completed: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
  cancelled: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
}

const priorityColors = {
  high: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
  medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
  low: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
}

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  shipped: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
}

const OrderManagement = () => {

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  // const [priorityFilter, setPriorityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState(new Set())
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [sortBy, setSortBy] = useState("orderDate")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)
  const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders()
  // console.log("allorders---->",allOrders)

  // const newmockOrders = allOrders?.map(order => (
  //   {
  //     id: order?.orderId,
  //     customerName: order?.userId?.name,
  //     customerEmail: order?.userId?.email,
  //     orderDate: order?.products[0]?.productId?.createdAt,
  //     status: order?.order_status,
  //     total: order?.totalAmt,
  //     priority: "high",
  //     rating: order?.products[0]?.productId?.ratings,
  //     items: order?.products[0]?.quantity,
  //     trackingNumber: "TRK123456789",
  //   }
  // ))
  // console.log(mockOrders)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received from John Doe", type: "info", time: "2 min ago" },
    { id: 2, message: "Order ORD-003 has been shipped", type: "success", time: "5 min ago" },
    { id: 3, message: "Payment failed for order ORD-007", type: "error", time: "10 min ago" },
  ])
  const itemsPerPage = 12

  useEffect(() => {
    setAnimateCards(true)
  }, [])

  const filteredOrders = useMemo(() => {

    const filtered = allOrders?.filter((order) => {
      const customerName = order?.userId?.name || "user"
      const customerEmail = order?.userId?.email || "user@damy.com"
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = order?.order_status === "pending"
      // const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
      return matchesSearch && matchesStatus
    })
    // Sort orders
    filtered?.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "orderDate") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (sortBy === "total") {
        aValue = Number.parseFloat(aValue)
        bValue = Number.parseFloat(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    return filtered
  }, [searchTerm, statusFilter, sortBy, sortOrder, allOrders])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allOrders?.length
    const completed = allOrders?.filter((o) => o?.order_status === "completed")?.length
    const pending = allOrders?.filter((o) => o?.order_status === "pending")?.length
    const processing = allOrders?.filter((o) => o?.order_status === "processing")?.length
    const revenue = allOrders?.filter((o) => o?.order_status === "completed")?.reduce((sum, o) => sum + o.totalAmt, 0)
    const avgOrderValue = revenue / completed || 0
    return { total, completed, pending, processing, revenue, avgOrderValue }
  }, [allOrders])

  // Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders?.slice(startIndex, startIndex + itemsPerPage)

  const handleBulkAction = async (action) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Bulk ${action} for orders:`, Array.from(selectedOrders))
    setSelectedOrders(new Set())
    setIsLoading(false)
  }

  const handleSelectAll = () => {
    if (selectedOrders?.size === paginatedOrders?.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(paginatedOrders.map((order) => order?.orderId)))
    }
  }

  const handleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setIsLoading(true)
    const res = await OrderUpdate(orderId, newStatus)

    if (res.success) {
      setShowModal(false)
      refetch()
    }
    setIsLoading(false)
  }

  const handleDeleteOrder = async (orderId, newStatus) => {
    setIsLoading(true)
    const res = await OrderUpdate(orderId, newStatus)

    if (res.success) {
      setShowModal(false)
      refetch()
    }
    setIsLoading(false)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }
  if (ordersLoading) return <DashboardLoader />
  // console.log("all orders ----->",allOrders)
  // console.log("filtered---->",filteredOrders)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 overflow-hidden">
      <div className="transition-all duration-500 lg:ml-15 py-5 px-2 lg:px-9 mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Order List & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add</span>!
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>

            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 transform transition-all duration-1000 delay-200 ${animateCards ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            <div className="relative">
              <ShoppingCart className="h-8 w-8 mb-3 text-blue-400" />
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <CheckCircle className="h-8 w-8 mb-3 text-green-400" />
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white">{stats.completed}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <Clock className="h-8 w-8 mb-3 text-orange-400" />
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <DollarSign className="h-8 w-8 mb-3 text-purple-400" />
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-white">৳{stats?.revenue?.toFixed(0)}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <TrendingUp className="h-8 w-8 mb-3 text-indigo-400" />
              <p className="text-gray-400 text-sm">Avg Order</p>
              <p className="text-3xl font-bold text-white">৳{stats.avgOrderValue.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div
          className={`transform transition-all duration-1000 delay-400 ${animateCards ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 p-6">
            <div className="flex flex-col space-y-6">
              {/* Top row - Search and main controls */}
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders by customer, ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>
                  {/* status filter  */}
                  {/* <div className="flex gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white"
                    >
                      <option className="bg-[#1A2533]" value="all">All Status</option>
                      <option className="bg-[#1A2533]" value="pending">Pending</option>
                      <option className="bg-[#1A2533]" value="processing">Processing</option>
                      <option className="bg-[#1A2533]" value="shipped">Shipped</option>
                      <option className="bg-[#1A2533]" value="completed">Completed</option>
                      <option className="bg-[#1A2533]" value="cancelled">Cancelled</option>
                    </select>

                    <select
                      value={"priorityFilter"}
                      onChange={(e) => "setPriorityFilter(e.target.value)"}
                      className="px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white"
                    >
                      <option className="bg-[#1A2533]" value="all">All Priority</option>
                      <option className="bg-[#1A2533]" value="high">High Priority</option>
                      <option className="bg-[#1A2533]" value="medium">Medium Priority</option>
                      <option className="bg-[#1A2533]" value="low">Low Priority</option>
                    </select>
                  </div> */}
                </div>

                <div className="flex gap-3">
                  {/* <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                  >
                    <FilterIcon className="h-4 w-4" />
                    Filters
                  </button> */}
                  {/* <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105">
                    <Download className="h-4 w-4" />
                    Export
                  </button> */}
                  {/* <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105">
                    <Plus className="h-4 w-4" />
                    New Order
                  </button> */}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {selectedOrders.size > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
                      <span className="text-blue-300 text-sm font-medium">{selectedOrders.size} selected</span>
                      <button
                        onClick={() => handleBulkAction("delete")}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition-all duration-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleBulkAction("export")}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition-all duration-300"
                      >
                        Export
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {/* <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="p-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:border-gray-500 transition-all duration-300"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button> */}
                    {/* <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-xl text-white text-sm"
                    >
                      <option className="bg-[#1A2533]" value="orderDate">Date</option>
                      <option className="bg-[#1A2533]" value="total">Amount</option>
                      <option className="bg-[#1A2533]" value="customerName">Customer</option>
                      <option className="bg-[#1A2533]" value="status">Status</option>
                    </select> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transform transition-all duration-1000 delay-600 ${animateCards ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Orders ({allOrders?.length})</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="p-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:border-gray-500 transition-all duration-300"
                  >
                    {selectedOrders?.size === paginatedOrders?.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
                {paginatedOrders?.map((order, index) => {
                  const StatusIcon = statusIcons[order.status]
                  const isSelected = selectedOrders.has(order?.orderId)
                  return (
                    <div
                      key={order.orderId}
                      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border ${isSelected ? "border-blue-500 shadow-lg shadow-blue-500/25" : "border-gray-700 hover:border-gray-600"} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer transform ${animateCards ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      onClick={() => handleViewOrder(order)}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                      <div className="px-3 py-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectOrder(order.orderId)
                              }}
                              className="p-1 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-5 w-5 text-blue-400" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-400" />
                              )}
                            </button>

                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                              <Package className="h-6 w-6" />
                            </div>

                            <div>
                              <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                                {order.orderId}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-gray-300 font-medium">{order?.userId?.name}</span>
                                {/* <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[order.priority]}`}
                                >
                                  {order.priority.toUpperCase()}
                                </span> */}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewOrder(order)
                              }}
                              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                            >
                              <Edit className="h-4 w-4" />
                            </button> */}

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteOrder(order?._id, "cancelled")
                              }}
                              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                              <Calendar className="h-4 w-4" />
                              Date
                            </div>
                            <div className="text-white font-semibold">
                              {new Date(order?.products[0]?.productId?.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="text-center p-3 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl">
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
                              <DollarSign className="h-4 w-4" />
                              Total
                            </div>
                            <div className="text-2xl font-bold text-green-400">৳{order?.totalAmt.toFixed(2)}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {StatusIcon && <StatusIcon className="h-5 w-5 text-white" />}
                            <span
                              className={`px-4 py-2 rounded-2xl text-sm font-semibold ${statusColors[order?.order_status]} hover:scale-105 transition-transform duration-200`}
                            >
                              {order?.order_status.charAt(0).toUpperCase() + order?.order_status.slice(1)}
                            </span>
                          </div>

                          {order?.products[0]?.productId?.ratings && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < order?.products[0]?.productId?.ratings ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {order.customerEmail}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {order?.products.length} item{order?.products.length > 1 ? "s" : ""}
                            </div>
                            {/* {order.trackingNumber && (
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                {order.trackingNumber}
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl transition-all duration-300 hover:scale-105 ${currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:border-gray-500"
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && <DashboardLoader />}

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4 min-h-screen">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-blue-200">{selectedOrder?.orderId}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 cursor-pointer hover:text-red-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-white">{selectedOrder?.userId?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{selectedOrder?.userId?.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{selectedOrder?.userId?.mobile}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                          <span className="text-gray-300">{selectedOrder?.delivery_address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Date:</span>
                          <span className="font-medium text-white">
                            {new Date(selectedOrder.orderDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Items:</span>
                          <span className="font-medium text-white">{selectedOrder.products.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Status:</span>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const StatusIcon = statusIcons[selectedOrder.status]
                              return StatusIcon ? <StatusIcon className="h-4 w-4 text-white" /> : null
                            })()}
                            <span
                              className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[selectedOrder?.order_status]}`}
                            >
                              {selectedOrder?.order_status.charAt(0).toUpperCase() + selectedOrder?.order_status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tracking:</span>
                            <span className="font-medium text-white">{selectedOrder.trackingNumber}</span>
                          </div>
                        )}
                        {selectedOrder.rating && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < selectedOrder.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-3 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-400" />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder?.products?.map((item, index) => (
                          console.log("item--->", item.image[0]),
                          <div
                            key={index}
                            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-2 shadow-sm border border-gray-700 hover:border-gray-600 transition-colors duration-300"
                          >
                            <div className="flex justify-between items-center">
                              <img className="w-12 h-12 object-cover object-top rounded-sm" src={item.image[0]} alt="product photo" />
                              <div>
                                <h4 className=" text-sm text-white">{item.name}</h4>
                                <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-400">৳{item.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">each</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t-2 border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-white">Total Amount:</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ৳{selectedOrder?.totalAmt.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleStatusChange(selectedOrder?._id, "processing")}
                          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                        >
                          Mark Processing
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedOrder._id, "shipped")}
                          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedOrder._id, "completed")}
                          className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedOrder?._id, "cancelled")}
                          className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPriorityFilter("all")
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <button className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center group border border-blue-500/30">
            <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }

        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default OrderManagement
