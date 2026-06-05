"use client";
import Skeleton from '@/src/compronent/loading/Skeleton';
import { addToCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from '@/src/hook/useCart';
import { applyCouponCode } from "@/src/hook/useCoupon";
import { clearCoupon, removeItemLocal, setCoupon, updateQuantityLocal } from '@/src/redux/cartSlice';
import { useGetSubcategory } from "@/src/utlis/useSubcategory";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  Heart,
  Home,
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
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlistApi,
  removeFromWishlistApi
} from "../../hook/useWishlist";
import Section from '../shared/Section';


const ShoppingCartComponent = () => {
  const dispatch = useDispatch();
  const { items: rawItems = [], loading, error, appliedCoupon, couponDiscount } = useSelector((state) => state.cart);
  const { data: wishlistItems } = useSelector((state) => state?.wishlist?.data);
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
  const { items: dsItems = [] } = useSelector((state) => state.dropshippingCart);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
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

    const originalPrice = product.productRank || product.price || 0;
    const price = item.price ?? product.price ?? 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      id,
      productId: id,
      categoryId,
      name: product.productName || product.name || 'Product',
      price,
      originalPrice,
      quantity: item.quantity ?? 1,
      image: product.image || product.images?.[0] || '/img/product.jpg',
      inStock: (product.stock ?? 1) > 0,
      rating: product.ratings,
      color: item.color || 'Default',
      size: item.size || 'N/A',
      discount,
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


  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const resp = await applyCouponCode({
        code: couponCode,
        checkoutAmount: subtotal,
        cartItems: cartItems
      });

      if (resp.success) {
        toast.success(resp.message || "Coupon applied!");
        dispatch(setCoupon({
          coupon: resp.coupon,
          discountAmount: resp.discountAmount
        }));
        setShowCouponInput(false);
        setCouponCode('');
      } else {
        toast.error(resp.message || "Invalid or inactive coupon");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying coupon");
    } finally {
      setIsApplyingCoupon(false);
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


  const handleContinueShopping = () => {
    if (user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) {
      router.push('/all-products');
    } else {
      router.push('/shop');
    }
  }

  const removeCoupon = () => {
    dispatch(clearCoupon());
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (isDS) {
      if (dsItems.length === 0) {
        toast.error("Your dropshipping cart is empty. Please add items to your DS cart first.");
        router.push('/all-products');
        return;
      }

      const hasInvalidPrice = dsItems.some(item =>
        item.sellingPrice === "" || Number(item.sellingPrice) < item.price
      );

      if (hasInvalidPrice) {
        toast.error("Selling price cannot be less than cost price in your dropshipping cart. Please fix it before checkout.");
        router.push('/dropshipping-addtocart');
        return;
      }
      router.push("/dropshipping-checkout");
    } else {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      router.push("/checkout");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = 0; // Shipping calculated at checkout

  const total = subtotal - (couponDiscount || 0) + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!user?._id) {
    return (
      <Section className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to log in to view your cart.</p>
          <Link
            href="/signin"
            className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-accent-content px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-green-700 transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </Section>
    );
  }

  if (loading) {
    return (
      <Section className="min-h-dvh bg-bg">
        <div className="bg-bg shadow-sm border-b mb-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-bg rounded-2xl shadow-lg p-6">
                  <div className="flex space-x-4">
                    <Skeleton className="w-24 h-24 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-20" />
                        <div className="flex gap-2">
                          <Skeleton variant="circle" className="h-8 w-8" />
                          <Skeleton variant="circle" className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-bg rounded-2xl shadow-lg p-6 space-y-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="min-h-dvh flex items-center justify-center bg-bg">
        <p className="text-red-500 text-lg">{error}</p>
      </Section>
    );
  }

  const isDS = user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING");

  return (
    <Section className="min-h-dvh bg-bg">
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-sm font-medium flex-wrap">
          <Link
            href="/"
            className={`flex items-center gap-1 transition-colors ${isDS ? 'text-slate-400 hover:text-emerald-600' : 'text-gray-400 hover:text-teal-600'}`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          {isDS ? (
            <>
              <Link href="/all-products" className="text-slate-400 hover:text-emerald-600 transition-colors">Products</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-emerald-600 font-bold">DS Cart</span>
            </>
          ) : (
            <>
              <Link href="/shop" className="text-gray-400 hover:text-teal-600 transition-colors">Shop</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-teal-600 font-bold">Cart</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Header ── */}
      <div className={`shadow-sm border-b ${isDS ? 'bg-white border-emerald-50' : 'bg-bg'}`}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDS ? 'text-gray-900' : 'text-gray-900'}`}>
                {isDS ? (
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </span>
                ) : (
                  <ShoppingCart className="w-8 h-8 text-teal-600" />
                )}
                {isDS ? 'Dropshipping Cart' : 'Shopping Cart'}
              </h1>
              <p className={`mt-1 text-sm ${isDS ? 'text-slate-500' : 'text-gray-600'}`}>
                {isDS
                  ? `${totalItems} item(s) — set your selling price before checkout`
                  : `${totalItems} items in your cart`
                }
              </p>
            </div>
            <div className="hidden md:flex items-center gap-5 text-sm">
              {isDS ? (
                <>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <Shield className="w-4 h-4" /> Secure Order
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <Truck className="w-4 h-4" /> Fast Fulfillment
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-green-600">
                    <Shield className="w-4 h-4" /> Secure Checkout
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-600">
                    <Truck className="w-4 h-4" /> Fast Delivery
                  </span>
                </>
              )}
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
            <button onClick={handleContinueShopping} className="bg-secondary hover:bg-secondary/80 hover:text-accent text-accent-content px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2  space-y-4">
              {cartItems?.map((item, index) => (
                // <Link className=' space-y-10' key={item.id}>
                <div
                  key={item.productId}
                  className="bg-bg cursor-pointer rounded-2xl shadow-lg py-6 px-3 hover:shadow-xl transition-all duration-300"
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
                        <div className="absolute -top-2 -right-2 bg-red-500 text-accent-content text-xs px-2 py-1 rounded-full font-bold">
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
              <div className="bg-bg rounded-2xl shadow-lg p-6 sticky top-6">
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
                          disabled={!couponCode || isApplyingCoupon}
                          onClick={applyCoupon}
                          className="px-4 py-2 bg-teal-500 hover:bg-green-600 text-accent-content rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </div>
                      <button
                        disabled={isApplyingCoupon}
                        onClick={() => setShowCouponInput(false)}
                        className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 disabled:opacity-50"
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

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-teal-900">ডেলিভারি তথ্য</p>
                      <p className="text-sm text-teal-700">
                        আপনার অবস্থানের ওপর ভিত্তি করে চেকআউট পেজে ডেলিভারি চার্জ নির্ধারণ করা হবে। ২,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>সম্ভাব্য ডেলিভারি: 3-5 কার্যদিবস</span>
                </div>

                {/* Go to Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full cursor-pointer bg-btn-color hover:bg-btn-color/70 text-accent-content py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

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
              <div className="lg:col-span-2 bg-bg rounded-2xl shadow-lg p-6 mt-8">
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
                        src={item.images?.[0] || (Array.isArray(item.image) ? item.image[0] : item.image) || '/img/product.jpg'}
                        alt={item.productName || item.name}
                        className="w-full h-20 object-cover rounded-lg mb-2"
                      />

                      <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-teal-600">
                        {item.productName || item.name}
                      </h4>

                      <p className="text-xs text-gray-500 mb-2">
                        Category: {item.category?.name}
                      </p>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-btn-color text-accent-content text-xs py-1.5 rounded-lg hover:bg-btn-color/70 transition"
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
    </Section >
  );
};

export default ShoppingCartComponent;
