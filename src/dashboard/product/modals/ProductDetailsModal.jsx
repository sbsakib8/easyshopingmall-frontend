"use client";

import { Backdrop, Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Eye, Package, Star, Tag, X } from "lucide-react";
import { getStatusText } from "../allProductList/allProductList";

const ProductDetailsModal = ({ open, onClose, product = {} }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        }`}
      />
    ));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      className="flex items-center justify-center p-4"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-300 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <img
                src={product?.images[0]}
                alt={product?.productName}
                className="w-full md:w-64 h-64 rounded-xl object-cover border-2 border-purple-500/30"
              />
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-300 mb-2">
                  {product?.productName}
                </h3>
                <div className="flex gap-2 mb-4">
                  {renderStars(product?.ratings)}
                  <span className="text-slate-300 font-semibold">
                    ({product?.ratings}.0)
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{product?.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {product?.category[0]?.name}
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {product?.subCategory[0]?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-400 text-sm">SKU</span>
                </div>
                <p className="text-slate-300 font-semibold">{product?.sku}</p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Price</span>
                </div>
                <p className="text-slate-300 font-semibold text-2xl">
                  ৳{product?.price}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-400 text-sm">
                    Dropshipping Price
                  </span>
                </div>
                <p className="text-slate-300 font-semibold text-2xl">
                  ৳{product?.dropshippingPrice ?? product?.price}
                </p>
                <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-tighter mt-1">
                  {product?.dropshippingPrice != null
                    ? "DS cost (custom)"
                    : "Falls back to regular price"}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Discount</span>
                </div>
                <p className="text-emerald-400 font-semibold text-2xl">
                  {product?.discount}%
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400 text-sm">Stock</span>
                </div>
                <p className="text-slate-300 font-semibold text-2xl">
                  {product?.productStock}
                </p>
                <p className="text-gray-400 text-sm">
                  {getStatusText(product?.productStock)}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <span className="text-gray-400 text-sm">Brand</span>
                <p className="text-slate-300 font-semibold mt-2">
                  {product?.brand}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <span className="text-gray-400 text-sm">Product ID</span>
                <p className="text-emerald-400 font-mono text-sm mt-2">
                  #{product?._id}
                </p>
              </div>
            </div>

            {product?.images?.length > 1 && (
              <div className="mt-6">
                <h4 className="text-slate-300 font-semibold mb-3">
                  All Images
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {product?.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-32 rounded-lg object-cover border border-slate-600/50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default ProductDetailsModal;
