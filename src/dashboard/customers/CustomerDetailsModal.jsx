"use client";

import { Backdrop, Modal } from "@mui/material";
import { Calendar, MapPin, Phone } from "lucide-react";

const CustomerDetailsModal = ({ isOpen, onClose, customer = {} }) => {
  return (
    <Modal
      open={isOpen}
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
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-300">
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-slate-300 hover:bg-gray-700 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Avatar + Name + Email + Status */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar or First Letter */}
            <div className="w-20 h-20 rounded-full border-4 border-gray-600 flex items-center justify-center bg-gray-800 text-slate-300 font-bold text-3xl overflow-hidden">
              {customer.avatar?.trim() ? (
                <img
                  src={customer.avatar}
                  alt={customer.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                customer.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            {/* Customer Info */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-slate-300">
                {customer.name}
              </h3>
              <p className="text-gray-400">{customer.email}</p>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === "active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-300 mb-3">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {customer.phone}
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span>
                    {customer.address?.address_line},{" "}
                    {customer.address?.district}, {customer.address?.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Joined{""}
                  {customer.joinDate
                    ? new Date(customer.joinDate).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Order Stats */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-300 mb-3">
                Order Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Orders:</span>
                  <span className="text-slate-300 font-semibold">
                    {customer.totalOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Order:</span>
                  <span className="text-slate-300 font-semibold">
                    {customer.lastOrder
                      ? new Date(customer.lastOrder).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;
