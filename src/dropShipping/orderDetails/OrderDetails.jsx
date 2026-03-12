'use client'

const OrderDetails = () => {
     // Fake data matching the design in the image
    const orderData = {
        orderId: "20260310827468",
        mobile: "01332099316",
        name: "মোঃ শাহিদ মাহমুদ",
        address: "Natore > Naldanga > গ্রাম: সোনা পাতিল স্থান: সোনা পাতিল মহিলা কলেজের সামনে।",
        codTk: "870",
        products: [
            {
                image: "/images/product-example.jpg", // Using a placeholder for the example
                code: "112304",
                size: "42",
                qty: "1 X 750",
                price: "750"
            }
        ],
        footerMessage: "Dear মোঃ শাহিদ মাহমুদ thanks for confirm the order."
    };
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-0">
            <div className="max-w-2xl mx-auto bg-bg shadow-sm rounded-lg overflow-hidden border border-slate-100 animate-fade-up">

                {/* Header section */}
                <div className="text-center py-8">
                    <h2 className="text-slate-500 uppercase tracking-widest text-sm font-semibold mb-6">INVOICE</h2>

                    {/* Brand Logo - Orange E */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="text-white text-4xl font-black italic">E</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-1">EasyShoppingMall</h1>
                    <p className="text-slate-500 text-sm">Mohammadpur, Dhaka, Bangladesh</p>
                </div>

                <hr className="border-t border-slate-100 mx-8" />

                {/* Customer & Order Info Section */}
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
                        <span className="text-slate-600 font-medium">Order ID</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-950 font-black tracking-tight">{orderData?.orderId}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
                        <span className="text-slate-600 font-medium">Mobile</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-800">{orderData?.mobile}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
                        <span className="text-slate-600 font-medium">Name</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-800 font-medium">{orderData?.name}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
                        <span className="text-slate-600 font-medium">Address</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">:</span>
                            <span className="text-slate-600 leading-relaxed max-w-[400px]">
                                {orderData?.address}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
                        <span className="text-slate-600 font-medium uppercase text-sm">COD TK</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">:</span>
                            <span className="text-[#E91E63] font-black text-lg"> {orderData?.codTk}</span>
                        </div>
                    </div>
                </div>

                {/* Product Table Section */}
                <div className="px-8 pb-10">
                    <div className="border border-slate-200 rounded-md overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-slate-700 font-bold text-sm">Image</th>
                                    <th className="px-4 py-3 text-slate-700 font-bold text-sm border-x border-slate-200">Product_Info</th>
                                    <th className="px-4 py-3 text-slate-700 font-bold text-sm">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData?.products.map((product, index) => (
                                    <tr key={index} className="border-b border-slate-100 last:border-b-0">
                                        <td className="px-4 py-4 align-top w-28">
                                            <div className="w-20 h-24 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/50">
                                                <img
                                                    src={'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'}
                                                    alt="product"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop";
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top border-x border-slate-200">
                                            <div className="space-y-1">
                                                <p className="text-slate-600 text-sm flex items-center gap-1">
                                                    Code: <span className="text-slate-800 font-medium">{product.code}</span>
                                                </p>
                                                <p className="text-slate-600 text-sm flex items-center gap-1">
                                                    Size: <span className="text-slate-800 font-medium">{product.size}</span>
                                                </p>
                                                <p className="text-slate-600 text-sm flex items-center gap-1">
                                                    Qty: <span className="text-slate-800 font-medium">{product.qty}</span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle text-center md:text-left">
                                            <span className="text-[#E91E63] font-bold text-lg">{product.price}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer section */}
                <div className="px-8 pb-12">
                    <p className="text-slate-700 font-medium">
                        {orderData?.footerMessage}
                    </p>
                </div>
            </div>
        </div>
  )
}

export default OrderDetails