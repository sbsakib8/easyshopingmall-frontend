"use client";
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  Tag, 
  Truck, 
  Shield, 
  ArrowRight,
  X,
  Gift,
  Percent,
  CreditCard,
  MapPin,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const ShoppingCartComponent = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 4500,
      originalPrice: 5500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      color: 'Black',
      size: 'One Size',
      inStock: true,
      rating: 4.5,
      discount: 18
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      price: 12000,
      originalPrice: 15000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      color: 'Silver',
      size: '42mm',
      inStock: true,
      rating: 4.8,
      discount: 20
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 2500,
      originalPrice: 3000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
      color: 'Blue',
      size: 'Medium',
      inStock: false,
      rating: 4.2,
      discount: 17
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save20') {
      setAppliedCoupon({
        code: 'SAVE20',
        discount: 20,
        type: 'percentage'
      });
      setShowCouponInput(false);
      setCouponCode('');
    } else if (couponCode.toLowerCase() === 'flat500') {
      setAppliedCoupon({
        code: 'FLAT500',
        discount: 500,
        type: 'fixed'
      });
      setShowCouponInput(false);
      setCouponCode('');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  
  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount = appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount;
  }

  const total = subtotal - couponDiscount + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen  lg:mt-24 py-5 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-teal-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">{totalItems} items in your cart</p>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center text-green-600">
                <Shield className="w-4 h-4 mr-2" />
                Secure Checkout
              </div>
              <div className="flex items-center text-teal-600">
                <Truck className="w-4 h-4 mr-2" />
                Free Shipping over ৳2000
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started</p>
            <button className="bg-teal-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2  space-y-4">
              {cartItems.map((item, index) => (
                <Link className=' space-y-10' href={`/productdetails/${item.id}`} key={item.id}>
                <div 
                  
                  className="bg-white mt-10 cursor-pointer rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      {item.discount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between flex-wrap items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{item.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">৳{item.price.toLocaleString()}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">৳{item.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button className="p-2  text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300">
                            <Heart className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Status & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          {item.inStock ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              In Stock
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Out of Stock
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                            disabled={!item.inStock}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                            disabled={!item.inStock}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              ))}

              {/* Suggested Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-600" />
                  You might also like
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <img 
                        src={`https://via.placeholder.com/100x100`}
                        alt="Suggested product"
                        className="w-full h-20 object-cover rounded-lg mb-2"
                      />
                      <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-teal-600">
                        Product {i}
                      </h4>
                      <p className="text-sm text-teal-600 font-bold">৳1,500</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-6">Order Summary</h3>

                {/* Coupon Section */}
                <div className="mb-6">
                  {!showCouponInput && !appliedCoupon && (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="w-full flex cursor-pointer items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-teal-600 hover:border-green-400 transition-all duration-300"
                    >
                      <Tag className="w-4 h-4" />
                      <span>Have a coupon code?</span>
                    </button>
                  )}

                  {showCouponInput && (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 bg-teal-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300"
                        >
                          Apply
                        </button>
                      </div>
                      <button
                        onClick={() => setShowCouponInput(false)}
                        className="text-sm cursor-pointer text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Try: SAVE20 (20% off) or FLAT500 (৳500 off)</p>
                      </div>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-green-700">
                        <Percent className="w-4 h-4" />
                        <span className="font-medium">{appliedCoupon.code} Applied</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 cursor-pointer hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span>-৳{savings.toLocaleString()}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center">
                      Shipping
                      {shipping === 0 && <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">FREE</span>}
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-teal-900">Free Delivery</p>
                      <p className="text-sm text-teal-700">
                        {shipping === 0 ? 'Congratulations! You qualify for free shipping' : `Add ৳${(2000 - subtotal).toLocaleString()} more to get free shipping`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: 2-3 business days</span>
                </div>

                {/* Checkout Button */}
                <Link href={"/checkout"} className="w-full cursor-pointer bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 hover:from-teal-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Secure Payment
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Track Order
                  </div>
                </div>

                {/* Continue Shopping */}
                <button className="w-full cursor-pointer mt-4 border border-gray-300 hover:border-blue-300 text-gray-700 hover:text-teal-600 py-3 rounded-xl font-medium transition-all duration-300">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ShoppingCartComponent;