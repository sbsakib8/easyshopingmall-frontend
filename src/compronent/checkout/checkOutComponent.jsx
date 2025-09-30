"use client"

import { useState } from "react"
import { ShoppingCart, MapPin, CreditCard, Check, Star, Shield, Truck } from "lucide-react"

// Sample cart items for demonstration
const cartItems = [
  { id: 1, name: "Samsung Galaxy A54", price: 45000, quantity: 1, image: "/modern-smartphone.png", rating: 4.5 },
  { id: 2, name: "Nike Air Max Shoes", price: 8500, quantity: 2, image: "/diverse-sneaker-collection.png", rating: 4.8 },
  { id: 3, name: "Wireless Headphones", price: 3200, quantity: 1, image: "/diverse-people-listening-headphones.png", rating: 4.6 },
]

const paymentMethods = [
  { id: "bkash", name: "bKash", logo: "💳", color: "from-pink-500 to-pink-600", textColor: "text-pink-600" },
  { id: "nagad", name: "Nagad", logo: "🏦", color: "from-orange-500 to-orange-600", textColor: "text-orange-600" },
  { id: "rocket", name: "Rocket", logo: "🚀", color: "from-purple-500 to-purple-600", textColor: "text-purple-600" },
  { id: "upay", name: "Upay", logo: "💰", color: "from-blue-500 to-blue-600", textColor: "text-blue-600" },
]

const CheckoutComponent = () => {
  const [selectedPayment, setSelectedPayment] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    area: "",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    phoneNumber: "",
    transactionId: "",
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCharge = 60
  const total = subtotal + deliveryCharge

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleProceedToPayment = () => {
    if (!selectedPayment) {
      alert("অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন")
      return
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন")
      return
    }

    console.log("Order Details:", {
      customer: customerInfo,
      payment: { method: selectedPayment, ...paymentInfo },
      items: cartItems,
      total: total,
    })

    alert(`অর্ডার সফল হয়েছে! ${selectedPayment} এর মাধ্যমে ৳${total} টাকা পেমেন্ট করুন।`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600bg-clip-text text-transparent">
                  EasyShoppingMall
                </h1>
                <p className="text-gray-600 text-sm">নিরাপদ ও দ্রুত অনলাইন শপিং</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">কার্ট</span>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">চেকআউট</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">সম্পূর্ণ</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">গ্রাহকের তথ্য</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      পূর্ণ নাম *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">ডেলিভারি ঠিকানা</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      সম্পূর্ণ ঠিকানা *
                    </label>
                    <textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                        শহর
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="ঢাকা, চট্টগ্রাম, সিলেট..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                        এলাকা
                      </label>
                      <input
                        id="area"
                        type="text"
                        value={customerInfo.area}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                        placeholder="থানা/উপজেলা"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">পেমেন্ট মেথড</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedPayment === method.id
                          ? "border-purple-500 bg-purple-50 shadow-lg"
                          : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      {selectedPayment === method.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-center">
                        <div className={`w-16 h-10 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl`}>
                          {method.logo}
                        </div>
                        <span className={`text-sm font-semibold ${selectedPayment === method.id ? method.textColor : 'text-gray-700'}`}>
                          {method.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPayment && (
                  <div className="border-t border-gray-200 pt-6 space-y-4 animate-in slide-in-from-top duration-300">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>{paymentMethods.find((m) => m.id === selectedPayment)?.name} পেমেন্ট তথ্য</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="paymentPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                          {selectedPayment} নম্বর
                        </label>
                        <input
                          id="paymentPhone"
                          type="tel"
                          value={paymentInfo.phoneNumber}
                          onChange={(e) => handlePaymentInfoChange("phoneNumber", e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="transactionId" className="block text-sm font-semibold text-gray-700 mb-2">
                          ট্রানজেকশন আইডি
                        </label>
                        <input
                          id="transactionId"
                          type="text"
                          value={paymentInfo.transactionId}
                          onChange={(e) => handlePaymentInfoChange("transactionId", e.target.value)}
                          placeholder="TXN123456789"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">অর্ডার সামারি</h2>
                </div>
              </div>
              
              <div className="p-6">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">৳{item.price.toLocaleString()} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between text-gray-700">
                    <span>সাবটোটাল</span>
                    <span className="font-medium">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span>ডেলিভারি চার্জ</span>
                    </span>
                    <span className="font-medium">৳{deliveryCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>মোট</span>
                      <span className="text-blue-600">৳{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-green-50 rounded-xl">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">১০০% নিরাপদ পেমেন্ট</span>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:to-teal-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  অর্ডার কনফার্ম করুন
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের 
                    <span className="text-blue-600 font-medium"> শর্তাবলী</span> মেনে নিচ্ছেন
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutComponent