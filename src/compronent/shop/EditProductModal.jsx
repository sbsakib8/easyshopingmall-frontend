"use client";

import { CheckCircle, Edit, Info, Tag, Close as X } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";

const EditProductModal = ({
  open,
  onClose,
  product = {},
  updateEditField,
  updateCouponField,
  handleApplyCoupon,
  saveEdit,
  load,
  couponLoad,
  productCoupon,
  subCategoryCoupon,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        zIndex: 1300,
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "transparent",
          maxWidth: "920px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          outline: "none",
        }}
      >
        {/* Main Modal Content - Keeping your exact styling */}
        <div className="container mx-auto rounded-2xl border border-emerald-500/30 w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
            <Typography
              variant="h5"
              className="text-2xl font-bold text-neutral flex items-center gap-2"
            >
              <Edit className="w-6 h-6" />
              Edit Product
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <X className="w-6 h-6" />
            </IconButton>
          </div>

          {/* Body */}
          <div className="p-6 bg-white/90 text-black overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* All your existing form fields remain exactly the same */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  defaultValue={product?.name}
                  onChange={(e) =>
                    updateEditField("productName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  defaultValue={product?.sku}
                  onChange={(e) => updateEditField("sku", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  defaultValue={product?.brand}
                  onChange={(e) => updateEditField("brand", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  defaultValue={product?.price}
                  onChange={(e) =>
                    updateEditField("price", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Dropshipping Price
                </label>
                <input
                  type="number"
                  defaultValue={product?.dropshippingPrice ?? ""}
                  onChange={(e) =>
                    updateEditField(
                      "dropshippingPrice",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="Leave empty to use Price"
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  defaultValue={product?.discount}
                  onChange={(e) =>
                    updateEditField("discount", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  defaultValue={product?.stock}
                  onChange={(e) =>
                    updateEditField("productStock", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={product?.rating}
                  onChange={(e) =>
                    updateEditField("ratings", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Product Size
                </label>
                <input
                  type="text"
                  defaultValue={product?.size?.join(", ") || ""}
                  onChange={(e) =>
                    updateEditField(
                      "productSize",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="M, L, XL"
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Product Color
                </label>
                <input
                  type="text"
                  defaultValue={product?.color?.join(", ") || ""}
                  onChange={(e) =>
                    updateEditField(
                      "color",
                      e.target.value.split(",").map((c) => c.trim()),
                    )
                  }
                  placeholder="Black, Brown, Red"
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Retail Price(৳)
                </label>
                <input
                  type="number"
                  defaultValue={product?.retailSale || ""}
                  onChange={(e) =>
                    updateEditField("productRank", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Product Status
                </label>
                <select
                  defaultValue={
                    product?.productStatus?.length > 0
                      ? product?.productStatus[0]
                      : "none"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    updateEditField(
                      "productStatus",
                      val === "none" ? [] : [val],
                    );
                  }}
                  className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-secondary bg-white"
                >
                  <option
                    disabled
                    selected
                    defaultValue={
                      product.productStatus?.length > 0
                        ? product?.productStatus[0]
                        : "none"
                    }
                  >
                    {product?.productStatus?.length > 0
                      ? product?.productStatus[0]
                      : "none"}
                  </option>
                  <option defaultValue="none">none</option>
                  <option defaultValue="hot">hot</option>
                  <option defaultValue="cold">cold</option>
                </select>
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Product Tags
                </label>
                <input
                  type="text"
                  defaultValue={product?.tags?.join(", ") || ""}
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
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-semibold mb-2">
                  Video Link
                </label>
                <input
                  defaultValue={product?.video_link}
                  onChange={(e) =>
                    updateEditField("video_link", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></input>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center p-4 bg-slate-500/10 border border-slate-200 rounded-xl mt-1">
                  <input
                    type="checkbox"
                    checked={product?.isBoost || false}
                    onChange={(e) =>
                      updateEditField("isBoost", e.target.checked)
                    }
                    className="w-5 h-5 text-emerald-600 bg-transparent border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label className="ml-3 text-black font-semibold">
                    Boost Product
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={product?.description}
                  onChange={(e) =>
                    updateEditField("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Coupon Section */}
              <div className="md:col-span-2 border-t border-slate-200 pt-6 mt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-500" />
                    Coupon Information
                  </div>
                  {productCoupon?._id ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Product Coupon
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full flex items-center gap-1">
                      <Info className="w-3 h-3" /> No Direct Coupon
                    </span>
                  )}
                  {subCategoryCoupon && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Subcat Coupon (
                      {subCategoryCoupon.code}) Active
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      defaultValue={productCoupon?.code || ""}
                      placeholder="PROMO2024"
                      onChange={(e) =>
                        updateCouponField("code", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Discount Type
                    </label>
                    <select
                      defaultValue={productCoupon?.discountType || "percentage"}
                      onChange={(e) =>
                        updateCouponField("discountType", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      defaultValue={productCoupon?.discountAmount || 0}
                      onChange={(e) =>
                        updateCouponField(
                          "discountAmount",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoad}
                      className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
                    >
                      {couponLoad ? "Applying..." : "Apply Coupon"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={saveEdit}
                disabled={load}
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  background: "linear-gradient(to right, #10b981, #14b8a6)",
                  "&:hover": {
                    background: "linear-gradient(to right, #059669, #0f766e)",
                  },
                }}
              >
                {load ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{ py: 1.5, color: "black", borderColor: "gray" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
