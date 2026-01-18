"use client";
import { getCartApi, removeCartItemApi, updateCartItemApi } from '@/src/hook/useCart';
import { removeItemLocal, updateQuantityLocal } from '@/src/redux/cartSlice';
import { useGetSubcategory } from "@/src/utlis/useSubcategory";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  CreditCard,
  Gift,
  Heart,
  MapPin,
  Minus,
  Percent,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Truck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlistApi,
  removeFromWishlistApi
} from "../../hook/useWishlist";


const ShoppingCartComponent = () => {
  const dispatch = useDispatch();
  const { items: rawItems = [], loading, error } = useSelector((state) => state.cart);
  const { data: wishlistItems } = useSelector((state) => state?.wishlist?.data);
  const user = useSelector((state) => state.user.data);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [localWishlist, setLocalWishlist] = useState(new Set());
  const { subcategory, loading: subcategoryLoading } = useGetSubcategory();


  useEffect(() => {
    if (user?._id) {
      getCartApi(user._id, dispatch);
    }
  }, [user?._id, dispatch]);

  // Sync localWishlist with Redux wishlist
  useEffect(() => {
    setLocalWishlist(new Set((wishlistItems || []).map((item) => item.id)));
  }, [wishlistItems]);


  const toggleWishlist = async (id) => {
    try {
      const isInWishlist = localWishlist.has(id);

      if (isInWishlist) {
        await removeFromWishlistApi(id, dispatch);
      } else {
        await addToWishlistApi(id, dispatch);
      }

      // 🔥 Sync UI with Redux (source of truth)
      const updated = new Set(wishlist.data.map((item) => item.id));
      setLocalWishlist(updated);

    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  // const cartItems = rawItems.map((item) => {
  //   const product = item.productId || {};
  //   const id = product._id || item.productId_id;
  //   const price = item.price ?? product.price ?? 0;
  //   const originalPrice =
  //     product.oldPrice ?? product.old_price ?? product.price ?? price;
  //   const quantity = item.quantity ?? 1;
  //   const image =
  //     (product.images && product.images[0]) ||
  //     (product.images && product.image[0]) ||
  //     'https://via.placeholder.com/100x100';
  //   const name = product.productName || product.name || 'Product';
  //   const inStock = (product.stock ?? 1) > 0;
  //   const rating = product.rating ?? product.ratings ?? 4.5;
  //   const color = item.color || 'Default';
  //   const size = item.size || 'N/A';
  //   const discount =
  //     originalPrice && originalPrice > price
  //       ? Math.round(((originalPrice - price) / originalPrice) * 100)
  //       : 0;

  //   return {
  //     id,
  //     productId: id,
  //     categoryId,
  //     name,
  //     price,
  //     originalPrice,
  //     quantity,
  //     image,
  //     color,
  //     size,
  //     inStock,
  //     rating,
  //     discount,
  //   };
  // });


  const cartItems = rawItems.map((item) => {
    const product = item.productId || {};
    const id = product._id || item.productId_id;
    const categoryId =
      product.category?.[0]?._id ||
      product.category?._id ||
      null;

    return {
      id,
      productId: id,
      categoryId,
      name: product.productName || product.name || 'Product',
      price: item.price ?? product.price ?? 0,
      originalPrice: product.oldPrice ?? product.price ?? 0,
      quantity: item.quantity ?? 1,
      image: product.images?.[0] || 'https://via.placeholder.com/100x100',
      inStock: (product.stock ?? 1) > 0,
      rating: product.ratings,
      color: item.color || 'Default',
      size: item.size || 'N/A',
    };
  });

  const updateQuantity = (productId, newQty) => {
    if (!user?._id) return;

    if (newQty <= 0) {
      removeItem(productId);
      return;
    }

    // 🔥 Optimistic UI
    dispatch(updateQuantityLocal({ productId, quantity: newQty }));

    // 🔥 Backend sync
    updateCartItemApi(
      {
        userId: user._id,
        productId,
        quantity: newQty,
      },
      dispatch
    );
  };


  const removeItem = (productId) => {
    if (!user?._id) return;

    // 🔥 Optimistic remove
    dispatch(removeItemLocal(productId));

    // 🔥 Backend remove
    removeCartItemApi(user._id, productId, dispatch);
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

  const cartCategoryIds = useMemo(() => {
    return [...new Set(
      cartItems
        .map(item => item.categoryId)
        .filter(Boolean)
    )];
  }, [cartItems]);

  const cartProductIds = useMemo(() => {
    return cartItems.map(item => item.productId);
  }, [cartItems]);

  const handleAddToCart = async (product) => {
    await addToCartApi({
      productId: product._id,
      quantity: 1,
    });

    toast.success("Added to cart");
  };
  const suggestedItems = useMemo(() => {
    if (!subcategory || !cartCategoryIds.length) return [];

    return subcategory.filter(item =>
      cartCategoryIds.includes(item.category?._id) &&
      !cartProductIds.includes(item._id)
    );
  }, [subcategory, cartCategoryIds, cartProductIds]);




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

  if (!user?._id) {
    return (
      <div className="min-h-screen lg:mt-24 py-5 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to log in to view your cart.</p>
          <Link
            href="/signin"
            className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-green-700 transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen lg:mt-24 py-5 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <p className="text-gray-600 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen lg:mt-24 py-5 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 row-span-2 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2  space-y-4">
              {cartItems?.map((item, index) => (
                // <Link className=' space-y-10' key={item.id}>
                <div
                  key={item.productId}
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
                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              // Optimistically toggle local state for instant UI feedback
                              setLocalWishlist((prev) => {
                                const updated = new Set(prev);
                                if (updated.has(item.productId)) {
                                  updated.delete(item.productId);
                                } else {
                                  updated.add(item.productId);
                                }
                                return updated;
                              });

                              // Call API to sync with Redux
                              toggleWishlist(item?.productId);
                            }}
                            className={`p-2 rounded-lg transition-all duration-300 
      ${localWishlist.has(item?.productId)
                                ? "text-red-500 bg-red-100"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={localWishlist.has(item?.productId) ? "red" : "none"}
                            />
                          </button>

                          <button
                            onClick={() => removeItem(item?.productId)}
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
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                            disabled={!item.inStock}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
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
                // </Link>
              ))}


            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1 row-span-2">
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
                        <span className="font-medium">{appliedCoupon?.code} Applied</span>
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

                {/* Move delivery address & order placement to checkout page */}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳{subtotal?.toLocaleString()}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span>-৳{savings?.toLocaleString()}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-৳{couponDiscount?.toLocaleString()}</span>
                    </div>
                  )}

                  {/* <div className="flex justify-between text-gray-600">
                    <span className="flex items-center">
                      Shipping
                      {shipping === 0 && <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">FREE</span>}
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                  </div> */}

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{subtotal?.toLocaleString()}</span>
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

                {/* Go to Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full cursor-pointer bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 hover:from-teal-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
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
            {/* Suggested Items */}
            {/* Add-to-cart wise suggestions */}
            {suggestedItems.length > 0 && (
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-600" />
                  You might also like
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedItems.slice(0, 8).map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded-lg mb-2"
                      />

                      <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-teal-600">
                        {item.name}
                      </h4>

                      <p className="text-xs text-gray-500 mb-2">
                        Category: {item.category?.name}
                      </p>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-teal-600 text-white text-xs py-1.5 rounded-lg hover:bg-teal-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}


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
    </div >
  );
};

export default ShoppingCartComponent;