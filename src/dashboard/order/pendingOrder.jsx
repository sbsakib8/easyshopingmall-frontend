"use client"
import DashboardLoader from "@/src/helper/loading/DashboardLoader"
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders"
import { OrderUpdate } from "@/src/utlis/useOrder"
import { ChevronLeft, ChevronRight, CircleCheckBig, CircleX, Cross, ShoppingCart, Trash2, Truck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const statusColors = {
  pending: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/25",
  processing: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
  submitted: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
  shipped: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
  completed: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
  paid: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
  cancelled: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
}
const PendingOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState('')
  const [animateCards, setAnimateCards] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(false)
  const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders()
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
      const matchesStatus = order?.order_status === "processing"
      return matchesSearch && matchesStatus
    })
    return filtered
  }, [searchTerm, allOrders])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allOrders?.length
    const cancelled = allOrders?.filter((o) => o?.order_status === "cancelled")?.length
    const shipped = allOrders?.filter((o) => o?.order_status === "shipped")?.length

    return { total, shipped, cancelled }
  }, [allOrders])

  // Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders?.slice(startIndex, startIndex + itemsPerPage)
  // Handle order actions
 
  const handleStatusChange = async () => {
    const res = await OrderUpdate(selectedOrder?._id, status)
    // console.log(res)
    if (res.success) {
      setConfirmationModal(false)
      setShowModal(false)
      refetch()

    }
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

  if (ordersLoading) return <DashboardLoader/>
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
                    Pending  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Order</span>!
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
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-200 ${animateCards ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} mb-8`}
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
                <p className="text-3xl font-bold text-white">{stats?.cancelled}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <Truck className="h-8 w-8 mb-3 text-orange-400" />
                <p className="text-gray-400 text-sm">Shipped</p>
                <p className="text-3xl font-bold text-white">{stats?.shipped}</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search orders, customers, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
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

            <div className="flex gap-3">
              <div className="px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 font-medium backdrop-blur-sm">
                {filteredOrders?.length} Orders
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedOrders?.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 relative"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white mb-1">{order?.orderId}</h3>
                    <p className="text-gray-400 text-sm">{formatDate(order?.updatedAt)}</p>
                  </div>
                  <div className={`px-3 py-1 text-sm ${statusColors[order?.order_status]} rounded-full text-yellow-300 font-medium`}>
                    {order?.order_status}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">{order.customer}</h4>
                  <p className="text-gray-400 text-sm mb-1">{order.email}</p>
                  <p className="text-gray-400 text-sm">{order.phone}</p>
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

                {/* Total and Payment */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Delivery Charge:</span>
                    <span className="text-green-400 font-bold text-lg">৳{order?.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-green-400 font-bold text-lg">৳{order?.totalAmt}</span>
                  </div>

                  <p className="text-white font-bold text-sm flex justify-between">Payment Method: <span className="text-gray-400 font-semibold">{order?.payment_method}</span> </p>
                </div>

                {/* Action Buttons */}
                <div className="py-6 ">
                  <div className="flex gap-2 absolute bottom-3 left-2 right-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setStatus("shipped")
                      setSelectedOrder(order)
                      setConfirmationModal(true)
                    }}
                    className="flex-1 px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setStatus("cancelled")
                      setSelectedOrder(order)
                      setConfirmationModal(true)
                    }}
                    className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
              <p className="text-gray-400">No pending orders match your search criteria.</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ">
              {/* Modal Header */}
               <div className="flex justify-end  items-center sticky -top-2 right-0">
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer bg-red-500/40 rounded-2xl p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                      <span className="text-gray-500">Phone:</span> {selectedOrder?.address?.mobile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">{selectedOrder?.address?.upazila_thana}, {selectedOrder?.address?.district}</p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder?.products.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex gap-2">
                        <img className="w-15 h-15 rounded-sm object-cover" src={item?.image[0]} alt="" />
                        <div>
                          <p className="text-white font-medium">{item?.name}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item?.quantity}</p>
                          <p className="text-gray-400 text-sm">Color: {item?.color ||"none"}</p>
                          <p className="text-gray-400 text-sm">Size: {item?.size || "none"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                                <p className="text-lg font-bold text-green-400">৳{item?.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">each</p>
                              </div>
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

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                   {
                      setStatus("shipped")
                      setConfirmationModal(true)
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Approve Order
                </button>
                <button
                  onClick={() => {
                      setStatus("cancelled")
                      setConfirmationModal(true)
                    }}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* confirmation modal  */}
      {confirmationModal &&
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-full">
              {status === "shipped" ? <CircleCheckBig className="w-8 h-8 text-green-500" /> : <Trash2 className="w-8 h-8 text-pink-500" />}      
              </div>
              <h2 className="text-2xl font-bold text-white"> {status === "shipped" ? "Approve" : "Reject"} Product</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange()}
                className={`flex-1 px-6 py-3 ${status === "shipped" ? "bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600" : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"}  text-white font-semibold rounded-lg transition-all transform hover:scale-105`}
              >
                {status === "shipped" ? "Approve" : "Reject"}
              </button>
              <button
                onClick={() => {
                  setStatus("")
                  setSelectedOrder(null)
                  setConfirmationModal(false)
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
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
export default PendingOrdersPage