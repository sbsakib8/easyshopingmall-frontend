"use client";

import { Backdrop, Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, X } from "lucide-react";

const ProductEditModal = ({
  open,
  onClose,
  product = {},
  updateEditField,
  load,
  saveEdit,
}) => {
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
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-slate-300 flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Edit Product
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product?.productName}
                  onChange={(e) =>
                    updateEditField("productName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={product?.sku}
                  onChange={(e) => updateEditField("sku", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={product?.brand}
                  onChange={(e) => updateEditField("brand", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={product?.price}
                  onChange={(e) =>
                    updateEditField("price", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Dropshipping Price
                </label>
                <input
                  type="number"
                  value={product?.dropshippingPrice ?? ""}
                  onChange={(e) =>
                    updateEditField(
                      "dropshippingPrice",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="Leave empty to use Price"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-tighter mt-1">
                  Wholesale cost for the dropshipper. Empty = regular Price.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={product?.discount}
                  onChange={(e) =>
                    updateEditField("discount", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={product?.productStock}
                  onChange={(e) =>
                    updateEditField("productStock", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={product?.ratings}
                  onChange={(e) =>
                    updateEditField("ratings", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Size
                </label>
                <input
                  type="text"
                  value={product?.productSize?.join(",") || ""}
                  onChange={(e) =>
                    updateEditField(
                      "productSize",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="M, L, XL"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Color
                </label>
                <input
                  type="text"
                  value={product?.color?.join(",") || ""}
                  onChange={(e) =>
                    updateEditField(
                      "color",
                      e.target.value.split(",").map((c) => c.trim()),
                    )
                  }
                  placeholder="Black, Brown, Red"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Rank
                </label>
                <input
                  type="number"
                  value={product?.productRank || ""}
                  onChange={(e) =>
                    updateEditField("productRank", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Status
                </label>
                <select
                  value={
                    product?.productStatus?.length > 0
                      ? product.productStatus[0]
                      : "none"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    updateEditField(
                      "productStatus",
                      val === "none" ? [] : [val],
                    );
                  }}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">None</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Product Tags
                </label>
                <input
                  type="text"
                  value={product?.tags?.join(", ") || ""}
                  onChange={(e) =>
                    updateEditField(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="New, Sale, Trending"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={product?.description}
                  onChange={(e) =>
                    updateEditField("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500 resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center p-4 bg-white/5 border border-slate-600 rounded-xl mt-1">
                  <input
                    type="checkbox"
                    checked={product?.isBoost || false}
                    onChange={(e) =>
                      updateEditField("isBoost", e.target.checked)
                    }
                    className="w-5 h-5 text-emerald-600 bg-transparent border-slate-500 rounded focus:ring-emerald-500"
                  />
                  <label className="ml-3 text-gray-300 font-semibold">
                    Boost Product
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-300 font-semibold rounded-lg transform"
              >
                {load ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default ProductEditModal;
