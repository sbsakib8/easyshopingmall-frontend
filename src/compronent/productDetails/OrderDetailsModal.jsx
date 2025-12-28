function getStatusColor(status) {
  if (!status) return "bg-gray-100 text-gray-800";

  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "unpaid":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-5 py-4 border-b rounded-t-2xl">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl
                       transition-all duration-500 ease-in-out transform
                       hover:rotate-[270deg] hover:scale-125"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {/* Order Info */}
          <div className="space-y-3 text-gray-700 text-sm md:text-base">
            <p><span className="font-medium">Order ID:</span> {order._id}</p>
            <p><span className="font-medium">Payment Method:</span> {order.payment_method}</p>

            {/* Dynamic Status */}
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">Payment Status:</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(order.payment_status)}`}>
                {order.payment_status}
              </span>

              <span className="font-medium ml-2">Order Status:</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(order.order_status)}`}>
                {order.order_status}
              </span>
            </div>

            <p><span className="font-medium">Delivery Address:</span> {order.delivery_address}</p>
            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* Products */}
          <div className="mt-6">
            <h3 className="font-medium text-base md:text-lg mb-3">Products</h3>
            <div className="space-y-3">
              {order.products.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 border rounded-xl p-3 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image?.[0] || "/banner/img/placeholder.png"}
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {p.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 whitespace-nowrap">৳{p.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center text-base md:text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-green-600">৳{order.totalAmt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
