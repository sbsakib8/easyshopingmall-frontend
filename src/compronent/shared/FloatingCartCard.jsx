"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toggleFloatingCart, closeFloatingCart } from "@/src/redux/floatingCartSlice";
import { ShoppingCart, X, ShoppingBag } from "lucide-react";

const FloatingCartCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.floatingCart);
  const { items } = useSelector((state) => state.cart);
  const panelRef = useRef(null);

  const totalItems = (items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = (items || []).reduce((sum, item) => sum + (item.totalPrice || item.price * (item.quantity || 1)), 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        dispatch(closeFloatingCart());
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") dispatch(closeFloatingCart());
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, dispatch]);

  return (
    <div ref={panelRef} className="fixed top-1/2 -translate-y-1/2 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500">
            <div className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-semibold text-sm">My Cart ({totalItems})</span>
            </div>
            <button
              onClick={() => dispatch(closeFloatingCart())}
              className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(70vh - 130px)" }}>
            {!items || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <ShoppingBag className="w-10 h-10 mb-2" />
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              items.map((item) => {
                const product = item.productId || {};
                const name = product.productName || product.name || "Product";
                const image = product.images?.[0] || "/img/product.jpg";
                const price = item.price || 0;
                const qty = item.quantity || 1;

                return (
                  <div key={item._id || item.productId?._id} className="flex gap-3">
                    <img
                      src={image}
                      alt={name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-teal-600">
                          ৳{(price * qty).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">x{qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items && items.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => { dispatch(closeFloatingCart()); router.push("/addtocart"); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </button>
              <button
                onClick={() => { dispatch(closeFloatingCart()); router.push("/checkout"); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md cursor-pointer"
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => dispatch(toggleFloatingCart())}
        className="relative ml-auto flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartCard;
