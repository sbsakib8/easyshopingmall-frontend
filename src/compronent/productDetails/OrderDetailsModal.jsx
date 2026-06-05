import { useSelector } from "react-redux";

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
    case "submitted":
      return "bg-green-100 text-green-800";
    case "unpaid":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  // Get customer data from the order itself (especially for referred orders)
  const customer = order.userId || {};
  const customerEmail = customer.email || "N/A";
  const customerImage = customer.image || "";
  const customerName = customer.name || "User";

  // Extract address details from the API response
  const address = order.address || {};
  const addressLine = address.address_line || "";
  const district = address.district || "";
  const division = address.division || "";
  const upazila = address.upazila_thana || "";
  const pincode = address.pincode || "";
  const mobile = address.mobile || "";
  const country = address.country || "";

  // Format full address
  const fullAddress = [addressLine, upazila, district, division, pincode, country]
    .filter(Boolean)
    .join(", ");

  // Extract payment details
  const paymentDetails = order.payment_details || {};
  const manualPayment = paymentDetails.manual || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4
                        bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl">
          <h2 className="text-accent-content text-lg font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-accent-content text-xl hover:rotate-90 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Order ID & User Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-purple-700 break-all text-sm">
                {order._id || "N/A"}
              </p>
            </div>

            <div className="bg-blue-50 border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Customer Information</p>
              <div className="flex items-center gap-3">
                {customerImage ? (
                  <img
                    src={customerImage}
                    alt={customerName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center border-2 border-blue-300">
                    <span className="text-blue-700 font-bold text-sm">
                      {customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue-700 text-sm truncate">{customerName}</p>
                  <p className="text-xs text-gray-600 truncate">{customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dropshipping Rewards (Conditional) */}
          {(order.profitAmount > 0 || order.referralBonusAmount > 0) && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <span className="text-xl">💰</span>
                  </div>
                  Dropshipping Rewards
                </h3>
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Verified Earning
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.profitAmount > 0 && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 group hover:bg-white/20 transition-all">
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-wider mb-1 opacity-80">Order Sales Profit</p>
                    <p className="text-3xl font-black tracking-tighter">৳{order.profitAmount.toLocaleString()}</p>
                  </div>
                )}
                {order.referralBonusAmount > 0 && (
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 group hover:bg-white/20 transition-all">
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-wider mb-1 opacity-80">
                      {order.referralPercentage || (order.subTotalAmt > 0 ? Math.round((order.referralBonusAmount / order.subTotalAmt) * 100) : 0)}% Referral Bonus
                    </p>
                    <p className="text-3xl font-black tracking-tighter">৳{order.referralBonusAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-[10px] text-emerald-100 font-bold italic opacity-60 flex items-center gap-1">
                <span>✨</span> Rewards are automatically credited to your balance once the order status is 'Delivered' or 'Completed'.
              </p>
            </div>
          )}

          {/* Status & Date */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Order Status</p>
              <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold capitalize ${getStatusColor(order.order_status)}`}>
                {order.order_status || "N/A"}
              </span>
            </div>

            <div className="bg-green-50 border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Payment Status</p>
              <span className={`inline-block px-3 py-1 text-xs rounded-full font-bold capitalize ${getStatusColor(order.payment_status)}`}>
                {order.payment_status === "paid" ? "পরিশোধিত (Paid)" : order.payment_status === "submitted" ? "পেমেন্ট জমা হয়েছে (Submitted)" : "অপরিশোধিত (Unpaid)"}
              </span>
            </div>

            <div className="bg-orange-50 border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-orange-700 text-sm">
                {order.createdAt ? new Date(order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : "N/A"}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-teal-500 rounded"></span>
              Payment Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Payment Method</p>
                <p className="font-medium text-gray-800 capitalize">{order.payment_method || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Payment Type</p>
                <p className="font-medium text-gray-800 capitalize">{order.payment_type || "N/A"}</p>
              </div>

              {manualPayment && (
                <>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Provider</p>
                    <p className="font-medium text-gray-800 uppercase">{manualPayment.provider || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Sender Number</p>
                    <p className="font-medium text-gray-800">{manualPayment.senderNumber || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-xs mb-1">Transaction ID</p>
                    <p className="font-medium text-gray-800 break-all">{manualPayment.transactionId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Paid For</p>
                    <p className="font-medium text-gray-800 capitalize">{manualPayment.paidFor || "N/A"}</p>
                  </div>
                </>
              )}

              {order.paymentId && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Payment ID</p>
                  <p className="font-medium text-gray-800 break-all">{order.paymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded"></span>
              Ordered Products
            </h3>
            <div className="space-y-3">
              {order.products && order.products.length > 0 ? (
                order.products.map((item, idx) => {
                  const resolvedProduct = item.productId || item;
                  const name = item.name || resolvedProduct.productName || "N/A";
                  const imgData = (item.image?.length > 0 ? item.image : null) || (item.images?.length > 0 ? item.images : null) || (resolvedProduct.images?.length > 0 ? resolvedProduct.images : null) || (resolvedProduct.image?.length > 0 ? resolvedProduct.image : null);
                  const productImage = (Array.isArray(imgData) ? imgData[0] : (typeof imgData === 'string' ? imgData : null)) || "/banner/img/placeholder.png";

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                    >
                      <img
                        src={productImage}
                        alt={name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 mb-1">{name}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                          <span>Qty: <span className="font-medium text-gray-900">{item.quantity || 0}</span></span>
                          <span>Price: <span className="font-medium text-gray-900">৳{item.price || 0}</span></span>
                          {item.size && <span>Size: <span className="font-medium text-gray-900">{item.size}</span></span>}
                          {item.color && <span>Color: <span className="font-medium text-gray-900">{item.color}</span></span>}
                          {item.weight && <span>Weight: <span className="font-medium text-gray-900">{item.weight}</span></span>}
                        </div>
                      </div>
                      <p className="font-bold text-emerald-600 text-lg flex-shrink-0">
                        ৳{item.totalPrice || 0}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No products found</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded"></span>
              Delivery Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Full Address</p>
                <p className="text-gray-800 font-medium">{fullAddress || "N/A"}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {division && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Division</p>
                    <p className="text-gray-800 font-medium">{division}</p>
                  </div>
                )}
                {district && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">District</p>
                    <p className="text-gray-800 font-medium">{district}</p>
                  </div>
                )}
                {upazila && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Upazila/Thana</p>
                    <p className="text-gray-800 font-medium">{upazila}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-emerald-200">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Contact Number</p>
                  <p className="text-gray-800 font-medium">{mobile || "N/A"}</p>
                </div>
                {pincode && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Pincode</p>
                    <p className="text-gray-800 font-medium">{pincode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-500 rounded"></span>
              Payment Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">৳{order.subTotalAmt || order.subtotal || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-semibold text-gray-800">৳{order.deliveryCharge || 0}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-medium">
                  <span>Coupon Applied {order.appliedCoupon ? `(${order.appliedCoupon})` : ""}</span>
                  <span className="font-semibold">-৳{order.couponDiscount}</span>
                </div>
              )}

              <div className="border-t border-cyan-200 pt-3 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600 font-medium">Amount Paid</span>
                  <span className="font-bold text-green-600">৳{order.amount_paid || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-medium">Amount Due</span>
                  <span className="font-bold text-red-600">৳{order.amount_due || 0}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mt-4 border-2 border-teal-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold text-base">Total Amount</span>
                  <span className="text-teal-600 font-bold text-xl">৳{order.totalAmt || 0}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
