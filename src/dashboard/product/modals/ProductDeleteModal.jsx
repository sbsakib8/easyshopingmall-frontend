"use client";

import { Backdrop, Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const ProductDeleteModal = ({ open, onClose, confirmDelete }) => {
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
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-pink-500/20 rounded-full">
              <Trash2 className="w-8 h-8 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-300">
              Delete Product
            </h2>
          </div>

          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-slate-300 font-semibold rounded-lg transform"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default ProductDeleteModal;
