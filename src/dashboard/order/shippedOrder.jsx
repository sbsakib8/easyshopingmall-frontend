"use client"

import { useGetAllOrders } from "@/src/utlis/useGetAllOrders"
import { CheckCircle, ChevronLeft, ChevronRight, CircleX, ShoppingCart, Truck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

// const mockOrders = [
//   {
//     id: "ORD-001",
//     customer: "John Doe",
//     email: "john@example.com",
//     phone: "+1234567890",
//     items: [
//       { name: "Wireless Headphones", quantity: 2, price: 99.99 },
//       { name: "Phone Case", quantity: 1, price: 19.99 },
//     ],
//     total: 219.97,
//     orderDate: "2024-01-10T10:30:00Z",
//     shippedDate: "2024-01-12T14:20:00Z",
//     estimatedDelivery: "2024-01-18T18:00:00Z",
//     shippingAddress: "123 Main St, New York, NY 10001",
//     paymentMethod: "Credit Card",
//     status: "shipped",
//     trackingNumber: "TRK123456789",
//     carrier: "FedEx",
//     shippingMethod: "Express Delivery",
//   },
//   {
//     id: "ORD-002",
//     customer: "Jane Smith",
//     email: "jane@example.com",
//     phone: "+1987654321",
//     items: [
//       { name: "Laptop Stand", quantity: 1, price: 79.99 },
//       { name: "USB Cable", quantity: 3, price: 12.99 },
//     ],
//     total: 118.96,
//     orderDate: "2024-01-11T14:20:00Z",
//     shippedDate: "2024-01-13T09:15:00Z",
//     estimatedDelivery: "2024-01-19T17:30:00Z",
//     shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
//     paymentMethod: "PayPal",
//     status: "shipped",
//     trackingNumber: "TRK987654321",
//     carrier: "UPS",
//     shippingMethod: "Standard Shipping",
//   },
//   {
//     id: "ORD-003",
//     customer: "Mike Johnson",
//     email: "mike@example.com",
//     phone: "+1122334455",
//     items: [
//       { name: "Gaming Mouse", quantity: 1, price: 59.99 },
//       { name: "Mousepad", quantity: 1, price: 24.99 },
//     ],
//     total: 84.98,
//     orderDate: "2024-01-12T09:15:00Z",
//     shippedDate: "2024-01-14T11:45:00Z",
//     estimatedDelivery: "2024-01-20T16:00:00Z",
//     shippingAddress: "789 Pine St, Chicago, IL 60601",
//     paymentMethod: "Credit Card",
//     status: "shipped",
//     trackingNumber: "TRK456789123",
//     carrier: "DHL",
//     shippingMethod: "Express Delivery",
//   },
//   {
//     id: "ORD-004",
//     customer: "Sarah Wilson",
//     email: "sarah@example.com",
//     phone: "+1555666777",
//     items: [
//       { name: "Bluetooth Speaker", quantity: 1, price: 129.99 },
//       { name: "Power Bank", quantity: 2, price: 39.99 },
//     ],
//     total: 209.97,
//     orderDate: "2024-01-13T16:30:00Z",
//     shippedDate: "2024-01-15T08:20:00Z",
//     estimatedDelivery: "2024-01-21T14:30:00Z",
//     shippingAddress: "321 Elm St, Miami, FL 33101",
//     paymentMethod: "Credit Card",
//     status: "delivered",
//     trackingNumber: "TRK789123456",
//     carrier: "FedEx",
//     shippingMethod: "Standard Shipping",
//   },
// ]
const statusColors = {
  pending: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/25",
  processing: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
  submitted: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
  shipped: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
  completed: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
  paid: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
  cancelled: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
}
const ShippedOrdersPage = () => {
  const [orders, setOrders] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [filterBy, setFilterBy] = useState("all")
  const [animateCards, setAnimateCards] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const itemsPerPage = 2
  const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders()

  useEffect(() => {
    setAnimateCards(true)
  }, [])
  // Filter orders based on search term and filters
  const filteredOrders = useMemo(() => {

    const filtered = allOrders?.filter((order) => {
      const customerName = order?.userId?.name || "user"
      const customerEmail = order?.userId?.email || "user@damy.com"
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = order?.order_status === "shipped"
      // const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
      return matchesSearch && matchesStatus
    })
    // Sort orders
    // filtered?.sort((a, b) => {
    //   let aValue = a[sortBy]
    //   let bValue = b[sortBy]

    //   if (sortBy === "orderDate") {
    //     aValue = new Date(aValue)
    //     bValue = new Date(bValue)
    //   } else if (sortBy === "total") {
    //     aValue = Number.parseFloat(aValue)
    //     bValue = Number.parseFloat(bValue)
    //   }

    //   if (sortOrder === "asc") {
    //     return aValue > bValue ? 1 : -1
    //   } else {
    //     return aValue < bValue ? 1 : -1
    //   }
    // })
    return filtered
  }, [searchTerm, allOrders])
  // Calculate statistics
  const stats = useMemo(() => {
    const total = allOrders?.length
     const completed = allOrders?.filter((o) => o?.order_status === "completed")?.length
    const cancelled = allOrders?.filter((o) => o?.order_status === "cancelled")?.length
    const shipped = allOrders?.filter((o) => o?.order_status === "shipped")?.length

    return { total, shipped, cancelled }
  }, [allOrders])

  // Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders?.slice(startIndex, startIndex + itemsPerPage)

  const handleMarkAsDelivered = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "delivered" } : order)))
  }

  const handleTrackOrder = (trackingNumber, carrier) => {
    // Simulate opening tracking page
    alert(`Tracking order with ${carrier}: ${trackingNumber}`)
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilDelivery = (deliveryDate) => {
    const today = new Date()
    const delivery = new Date(deliveryDate)
    const diffTime = delivery - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  if (ordersLoading) return <p>Loading...</p>
  // console.log("allorders---->",allOrders)
  console.log("filterorders---->", filteredOrders)
  // console.log("status---->", status)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/3 to-blue-600/3 rounded-full blur-3xl animate-bounce-slow"></div>
      </div>
      {/* main section */}
      <div className={`transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9`}>
        <div className="relative z-10 p-4 md:p-6 lg:p-8">
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
                    Shipped <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Order</span>!
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    EasyShoppingMall Admin Dashboard
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* over view section  */}
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-6 transform transition-all duration-1000 delay-200 ${animateCards ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} mb-8`}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
              <div className="relative">
                <ShoppingCart className="h-8 w-8 mb-3 text-blue-400" />
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats?.total}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <CircleX className="h-8 w-8 mb-3 text-red-400" />
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-3xl font-bold text-white">{stats?.cancelled || 0}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <Truck className="h-8 w-8 mb-3 text-orange-400" />
                <p className="text-gray-400 text-sm">Shipped</p>
                <p className="text-3xl font-bold text-white">{stats?.shipped || 0}</p>
              </div>
            </div>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <CheckCircle className="h-8 w-8 mb-3 text-green-400" />
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white">{stats?.completed || 0}</p>
            </div>
          </div>
          </div>
          <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search orders, customers, or tracking numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm"
            >
              <option value="all">All Payment Methods</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select> */}

              {/* <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select> */}

              <div className="px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 font-medium backdrop-blur-sm">
                {filteredOrders.length} Orders
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedOrders?.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{order?.orderId}</h3>
                    <p className="text-gray-400 text-sm">Shipped: {formatDate(order?.updatedAt)}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${order?.order_status === "shipped"
                      ? "bg-orange-600/20 border border-orange-500/30 text-orange-300"
                      : "bg-blue-600/20 border border-blue-500/30 text-blue-300"
                      }`}
                  >
                    {order?.order_status === "shipped" ? "Shipped" : "In Transit"}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">{order?.userId?.name || "none"}</h4>
                  <p className="text-gray-400 text-sm mb-1">{order?.userId?.email || "demo@gmail.com"}</p>
                  <p className="text-gray-400 text-sm">{order?.address?.mobile || "018XXXXXXXX"}</p>
                </div>

                {/* Tracking Info */}
                <div className="mb-4 bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm font-medium">Tracking:</span>
                    <span className="text-blue-400 text-sm font-mono">{order.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Carrier:</span>
                    <span className="text-gray-400 text-sm">{order.carrier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Est. Delivery:</span>
                    <span className="text-green-400 text-sm">
                      {order.status === "delivered"
                        ? "Delivered"
                        : `${getDaysUntilDelivery(order.estimatedDelivery)} days`}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Items ({order?.products.length})</h5>
                  <div className="space-y-1 ">
                    {order?.products.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-gray-400">৳{item?.price}</span>
                      </div>
                    ))}
                    {order?.products.length > 2 && (
                      <p className="text-gray-500 text-xs">+{order?.products.length - 2} more items</p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Delivery Charge:</span>
                    <span className="text-green-400 font-bold text-lg">৳{order?.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-green-400 font-bold text-lg">৳{order.totalAmt}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors duration-200 text-sm font-medium"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleTrackOrder(order.trackingNumber, order.carrier)}
                    className="flex-1 px-3 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-purple-600/30 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  {order.order_status === "shipped" && (
                    <button
                      onClick={() => handleMarkAsDelivered(order.id)}
                      className="flex-1 px-3 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors duration-200 text-sm font-medium"
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700">
              {/* <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </div> */}
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

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Shipped Orders Found</h3>
              <p className="text-gray-400">No shipped orders match your search criteria.</p>
            </div>
          )}
        </div>

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Shipped Order Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid md:grid-cols-1 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-500">Order ID:</span> {selectedOrder?.orderId}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Date:</span> {formatDate(selectedOrder?.updatedAt)}
                    </p>
                    <div className="text-gray-300 flex gap-3">
                      <span className="text-gray-500">Order Status:</span>{" "}
                      <p className={`px-3 py-1 text-sm ${statusColors[selectedOrder?.order_status]} rounded-full text-yellow-300 font-medium`}>
                        {selectedOrder?.order_status}
                      </p>
                    </div>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Payment:</span> {selectedOrder?.payment_method}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Provider Name:</span> {selectedOrder?.payment_details?.manual?.provider}
                    </p>
                  </div>
                </div>

                
              </div>

                  {/* Customer Info */}
                  <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-500">Name:</span> {selectedOrder?.userId?.email}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Email:</span> {selectedOrder?.userId?.name}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Phone:</span> {selectedOrder?.payment_method === "manual" ? selectedOrder?.payment_details?.manual?.senderNumber : selectedOrder?.address?.mobile}
                    </p>
                  </div>
                </div>

                  {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">{selectedOrder?.address?.upazila_thana}, {selectedOrder?.address?.district}</p>
              </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Tracking Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Tracking Information</h3>
                    <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tracking Number:</span>
                        <span className="text-blue-400 font-mono">{selectedOrder.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Carrier:</span>
                        <span className="text-gray-300">{selectedOrder.carrier}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Shipping Method:</span>
                        <span className="text-gray-300">{selectedOrder.shippingMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Est. Delivery:</span>
                        <span className="text-green-400">
                          {selectedOrder.status === "delivered"
                            ? "Delivered"
                            : formatDate(selectedOrder.estimatedDelivery)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTrackOrder(selectedOrder.trackingNumber, selectedOrder.carrier)}
                        className="w-full mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Track Package
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder?.products?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                          <div className="flex gap-2">
                             <img className="w-12 h-12 rounded-sm" src={item?.image[0]} alt="" />
                           <div>
                          <p className="text-white font-medium">{item?.name}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item?.quantity}</p>
                        </div>
                          </div>
                      <p className="text-green-400 font-semibold">৳{item?.price}</p>
                        </div>
                      ))}
                    </div>
                     <div className="flex justify-between items-center m-2">
                  <span className="text-white font-semibold">Delivery Charge:</span>
                  <span className="text-green-400 font-bold text-lg">৳{selectedOrder?.deliveryCharge}</span>
                </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-white">Total:</span>
                        <span className="text-2xl font-bold text-green-400">৳{selectedOrder?.totalAmt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                {selectedOrder.order_status === "shipped" && (
                  <button
                    onClick={() => {
                      handleMarkAsDelivered(selectedOrder.id)
                      setShowModal(false)
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Mark as Delivered
                  </button>
                )}
                <button
                  onClick={() => handleTrackOrder(selectedOrder.trackingNumber, selectedOrder.carrier)}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Track Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
export default ShippedOrdersPage