"use client"
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders"
import { useMemo, useState } from "react"

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
//     orderDate: "2024-01-15T10:30:00Z",
//     shippingAddress: "123 Main St, New York, NY 10001",
//     paymentMethod: "Credit Card",
//     status: "pending",
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
//     orderDate: "2024-01-15T14:20:00Z",
//     shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
//     paymentMethod: "PayPal",
//     status: "pending",
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
//     orderDate: "2024-01-16T09:15:00Z",
//     shippingAddress: "789 Pine St, Chicago, IL 60601",
//     paymentMethod: "Credit Card",
//     status: "pending",
//   },
// ]

 const PendingOrdersPage=() =>{
  const [orders, setOrders] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterBy, setFilterBy] = useState("all")
    const { allOrders, loading: ordersLoading, refetch } = useGetAllOrders()
    // console.log("allorders---->",allOrders)

  // Filter orders based on search term and filter
  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.email.toLowerCase().includes(searchTerm.toLowerCase())

  //   if (filterBy === "all") return matchesSearch
  //   return matchesSearch && order.paymentMethod.toLowerCase() === filterBy.toLowerCase()
  // })
  const filteredOrders = useMemo(() => {
  
      const filtered = allOrders?.filter((order) => {
        const customerName = order?.userId?.name || "user"
        const customerEmail = order?.userId?.email || "user@damy.com"
        const matchesSearch =
          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order?.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = order?.order_status === "processing"
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
    }, [searchTerm,allOrders])
  

  // Handle order actions
  const handleApproveOrder = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order)))
  }

  const handleRejectOrder = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "rejected" } : order)))
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

if(ordersLoading)return <p>Loading...</p>
// console.log("allorders---->",allOrders)
console.log("filterorders---->",filteredOrders)
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
            {/* <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Payment Methods</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select> */}

            <div className="px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 font-medium backdrop-blur-sm">
              {filteredOrders.length} Orders
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{order.id}</h3>
                  <p className="text-gray-400 text-sm">{formatDate(order.orderDate)}</p>
                </div>
                <div className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-medium">
                  Pending
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
                <div className="space-y-1">
                  {order?.products.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-gray-400">${item.price}</span>
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
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-green-400 font-bold text-lg">${order.total}</span>
                </div>
                <p className="text-gray-400 text-sm">Payment: {order.paymentMethod}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="flex-1 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors duration-200 text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApproveOrder(order.id)}
                  className="flex-1 px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors duration-200 text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectOrder(order.id)}
                  className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors duration-200 text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

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
          <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Order ID:</span> {selectedOrder.id}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Date:</span> {formatDate(selectedOrder.orderDate)}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="text-yellow-400 capitalize">{selectedOrder.status}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Payment:</span> {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Name:</span> {selectedOrder.customer}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Email:</span> {selectedOrder.email}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Phone:</span> {selectedOrder.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
              <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-green-400 font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-green-400">${selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleApproveOrder(selectedOrder.id)
                  setShowModal(false)
                }}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Approve Order
              </button>
              <button
                onClick={() => {
                  handleRejectOrder(selectedOrder.id)
                  setShowModal(false)
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