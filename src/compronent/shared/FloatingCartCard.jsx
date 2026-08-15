"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { hideFloatingCart } from "@/src/redux/floatingCartSlice";
import { X, ShoppingCart, CreditCard, ArrowRight } from "lucide-react";

const FloatingCartCard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { item, show } = useSelector((state) => state.floatingCart);

  const handleClose = useCallback(() => {
    dispatch(hideFloatingCart());
  }, [dispatch]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [show, handleClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (show) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, handleClose]);

  if (!show || !item) return null;

  const productName = item.name || "Product";
  const productImage = item.image || item.images?.[0] || "/img/product.jpg";
  const productPrice = item.price || 0;
  const productQuantity = item.quantity || 1;
  const productColor = item.color || null;
  const productSize = item.size || null;
  const subtotal = productPrice * productQuantity;

  const handleViewCart = () => {
    handleClose();
    router.push("/addtocart");
  };

  const handleCheckout = () => {
    handleClose();
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    handleClose();
    router.push("/shop");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Floating Card */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-500 ease-out ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-2xl">
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-semibold text-sm">Added to Cart</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Product Image */}
            <div className="relative flex-shrink-0">
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {productQuantity}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {productName}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                {productColor && <span>Color: {productColor}</span>}
                {productSize && <span>Size: {productSize}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-teal-600">
                  ৳{subtotal.toLocaleString()}
                </span>
                {productQuantity > 1 && (
                  <span className="text-xs text-gray-500">
                    ({productQuantity} × ৳{productPrice.toLocaleString()})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100" />

          {/* Subtotal */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-gray-900">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            {/* View Cart */}
            <button
              onClick={handleViewCart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
            </button>

            {/* Checkout Now */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Checkout Now
            </button>

            {/* Continue Shopping */}
            <button
              onClick={handleContinueShopping}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors cursor-pointer"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingCartCard;
