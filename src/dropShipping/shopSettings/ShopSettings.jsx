"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  Image as ImageIcon,
  Facebook,
  CreditCard,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Building2,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, uploadUserImage } from "@/src/hook/useAuth";
import { userget } from "@/src/redux/userSlice";
import toast from "react-hot-toast";
import Container from "@/src/compronent/shared/Container";
import BackButton from "@/src/dropShipping/BackButton/BackButton";

const ShopSettings = () => {
  const data = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    facebookPage: "",
    whatsappNumber: "",
    shopAddress: "",
    shopWebsite: "",
    paymentDetails: {
      bkash: "",
      nagad: "",
      rocket: "",
      bank: "",
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        shopName: data.shopName || "",
        facebookPage: data.facebookPage || "",
        whatsappNumber: data.whatsappNumber || "",
        shopAddress: data.shopAddress || "",
        shopWebsite: data.shopWebsite || "",
        paymentDetails: {
          bkash: data.paymentDetails?.bkash || "",
          nagad: data.paymentDetails?.nagad || "",
          rocket: data.paymentDetails?.rocket || "",
          bank: data.paymentDetails?.bank || "",
        },
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size should be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadUserImage(data._id, file, "shopLogo");
      if (res.success) {
        dispatch(userget(res.user));
        toast.success("Shop logo updated successfully");
      }
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateUserProfile(data._id, formData);
      if (res.success) {
        dispatch(userget(res.user));
        toast.success("Shop settings updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 md:py-16">
      <Container className="max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row-reverse md:items-center justify-between gap-8 md:gap-3">
          <BackButton className="w-min" />
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Store className="size-6 sm:size-8 text-emerald-600" />
              Shop Settings
            </h1>
            <p className="text-slate-600">
              Configure your dropshipping business profile and payment details.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between gap-6"
        >
          {/* Business Profile Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Business Profile
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Shop Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Business Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Shop Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden group">
                      {data?.shopLogo ? (
                        <img
                          src={data.shopLogo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200">
                      {uploading ? "Uploading..." : "Change Logo"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleLogoUpload}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Facebook Page */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Facebook Page URL
                  </label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                    <input
                      type="url"
                      name="facebookPage"
                      value={formData.facebookPage}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Whatsapp */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Whatsapp Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Business Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      name="shopWebsite"
                      value={formData.shopWebsite}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Business Address
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="shopAddress"
                      value={formData.shopAddress}
                      onChange={handleChange}
                      placeholder="Enter your business address"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payout Methods
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bkash */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  bKash Personal Number
                </label>
                <input
                  type="text"
                  name="paymentDetails.bkash"
                  value={formData.paymentDetails.bkash}
                  onChange={handleChange}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                />
              </div>

              {/* Nagad */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nagad Personal Number
                </label>
                <input
                  type="text"
                  name="paymentDetails.nagad"
                  value={formData.paymentDetails.nagad}
                  onChange={handleChange}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Rocket */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Rocket Personal Number
                </label>
                <input
                  type="text"
                  name="paymentDetails.rocket"
                  value={formData.paymentDetails.rocket}
                  onChange={handleChange}
                  placeholder="017XXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none"
                />
              </div>

              {/* Bank */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Bank Account Details
                </label>
                <textarea
                  name="paymentDetails.bank"
                  value={formData.paymentDetails.bank}
                  onChange={handleChange}
                  placeholder="Bank Name, A/C Name, A/C No, Branch..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Settings
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
};

export default ShopSettings;
