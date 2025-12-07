function OrderDetailsModal({ order, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 animate-[fadeIn_0.3s_ease-out]">

                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-semibold">Order Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Order Info */}
                {/* Order Info */}
                <div className="mt-4 space-y-3 text-gray-700">
                    <p><span className="font-medium">Order ID:</span> {order._id}</p>
                    <p><span className="font-medium">Payment Method:</span> {order.payment_method}</p>
                    <p><span className="font-medium">Payment Status:</span> {order.payment_status}</p>
                    <p><span className="font-medium">Order Status:</span> {order.order_status}</p>
                    <p><span className="font-medium">Delivery Address:</span> {order.delivery_address}</p>
                    <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                </div>


                {/* Products */}
                <div className="mt-6">
                    <h3 className="font-medium text-lg mb-3">Products</h3>
                    <div className="space-y-4">

                        {order.products.map((p, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between border rounded-xl p-4 hover:shadow-sm transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={p.image?.[0]}
                                        alt=""
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold">{p.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {p.quantity}
                                        </p>
                                    </div>
                                </div>

                                <p className="font-bold text-gray-900">
                                    ৳{p.totalPrice}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Total */}
                <div className="mt-6 pt-4 border-t flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">৳{order.totalAmt}</span>
                </div>
            </div>
        </div>
    );
}
export default OrderDetailsModal;