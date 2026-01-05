"use client";
import React, { useState } from "react";
import {
  Upload,
  X,
  Plus,
  Star,
  Save,
  Eye,
  Package,
  Tag,
  DollarSign,
  BarChart3,
  Camera,
  MapPin,
} from "lucide-react";
import { ProductCreate, ProductNotification } from "@/src/hook/useProduct";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import socket from "@/src/confic/socket";
import { useEffect } from "react";

const AddProductComponent = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    subCategory: "",
    featured: false,
    brand: "",
    productWeight: [],
    productSize: [],
    color: [],
    price: "",
    productStock: "",
    productRank: "",
    discount: "",
    ratings: 5,
    tags: [],
    images: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState("");
  const [setsize, setsetsize] = useState("");
  const [newWeight, setnewWeight] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //  subcategory and category ..
  const allsubCategorydata = useSelector((state) => state.subcategory.allsubCategorydata);
  const allCategorydata = useSelector((state) => state.category.allCategorydata);

  // socket test
  const [notifications, setNotifications] = useState([]);
  console.log(notifications);
  useEffect(() => {
    // socket connect হলে
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    // নতুন notification এলে
    socket.on("notification:new", (notif) => {
      console.log("📩 New notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
      toast.success(` ${notif.title}: ${notif.message}`);
    });

    // cleanup
    return () => {
      socket.off("connect");
      socket.off("notification:new");
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "category" || name === "subCategory"
          ? [value]
          : value,
    }));
  };

  const filteredSubCategories = allsubCategorydata?.data?.filter((subCat) => {
    // category object
    if (typeof subCat.category === "object" && subCat.category?._id) {
      return subCat.category._id === formData.category[0];
    }

    // category array
    if (Array.isArray(subCat.category)) {
      return subCat.category.includes(formData.category[0]);
    }

    // normal string
    return subCat.category === formData.category[0];
  });

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const addcolor = () => {
    if (newColor.trim() && !formData.color.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        color: [...prev.color, newColor.trim()],
      }));
      setNewColor("");
    }
  };

  const addsize = () => {
    if (setsize.trim() && !formData.productSize.includes(setsize.trim())) {
      setFormData((prev) => ({
        ...prev,
        productSize: [...prev.productSize, setsize.trim()],
      }));
      setsetsize("");
    }
  };

  const addweight = () => {
    if (newWeight.trim() && !formData.productWeight.includes(newWeight.trim())) {
      setFormData((prev) => ({
        ...prev,
        productWeight: [...prev.productWeight, newWeight.trim()],
      }));
      setnewWeight("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const removecolor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter((color) => color !== colorToRemove),
    }));
  };
  const removesize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      productSize: prev.productSize.filter((size) => size !== sizeToRemove),
    }));
  };
  const removeweight = (weightToRemove) => {
    setFormData((prev) => ({
      ...prev,
      productWeight: prev.productWeight.filter((weight) => weight !== weightToRemove),
    }));
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      description: "",
      category: "",
      subCategory: "",
      featured: false,
      brand: "",
      productWeight: [],
      productSize: [],
      color: [],
      price: "",
      productStock: "",
      productRank: "",
      discount: "",
      ratings: 5,
      tags: [],
      images: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === "images") {
          formData.images.forEach((img) => formDataToSend.append("images", img.file));
        } else if (key === "category" || key === "subCategory") {
          formData[key].forEach((id) => formDataToSend.append(key, id));
        } else if (
          key === "productSize" ||
          key === "color" ||
          key === "productWeight" ||
          key === "tags"
        ) {
          formData[key].forEach((item) => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await ProductCreate(formDataToSend);

      if (response?.success) {
        toast.success("✅ Product added successfully!");
        resetForm();

        
        await ProductNotification({
          title: "New Product Added",
          message: `Product is now live!`,
          type: "stock",
          referenceId: response.data._id,
          meta: { category: response.data.category },
        });
      } else {
        toast.error(response?.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ Something went wrong! Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handlePreview = () => {
    alert("Preview functionality would show product preview here");
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* main section */}
      <div className={`transition-all  duration-500 py-5 lg:ml-15 px-2 lg:px-9`}>
        {/* Header */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Add New Product</h1>
            <p className="text-blue-100">EasyShoppingMall Admin Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Package className="mr-3 text-blue-400" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white font-medium">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter brand name"
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <label className="text-white font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Enter detailed product description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Categories & Classification */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Tag className="mr-3 text-green-400" />
              Categories & Classification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="text-white font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category[0] || ""}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-slate-800">
                    Select Category
                  </option>

                  {allCategorydata?.data?.length > 0 ? (
                    allCategorydata.data.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-slate-800">
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-slate-800">
                      No categories found
                    </option>
                  )}
                </select>
              </div>

              {/* SUB CATEGORY */}
              <div className="space-y-2">
                <label className="text-white font-medium">Sub Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory[0] || ""}
                  onChange={handleInputChange}
                  disabled={!formData.category.length}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50"
                >
                  <option value="" className="bg-slate-800">
                    Select Sub Category
                  </option>

                  {filteredSubCategories?.length > 0 ? (
                    filteredSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id} className="bg-slate-800">
                        {sub.name}
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-slate-800">
                      No subcategories found
                    </option>
                  )}
                </select>
              </div>

              {/* FEATURED */}
              <div className="space-y-2">
                <label className="text-white font-medium">Featured Product</label>
                <div className="flex items-center p-4 bg-white/10 border border-white/20 rounded-xl">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 bg-transparent border-white/30 rounded focus:ring-green-500"
                  />
                  <label className="ml-3 text-white">Mark as Featured</label>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6 space-y-2">
              <label className="text-white font-medium">Product Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add product tags"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="mr-3 text-yellow-400" />
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* add weight */}
              <div className="">
                <label className="text-white font-medium">Product weight</label>
                <div className="flex flex-wrap gap-2">
                  {formData.productWeight.map((weight) => (
                    <span
                      key={weight}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {weight}
                      <button
                        type="button"
                        onClick={() => removeweight(weight)}
                        className="ml-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setnewWeight(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addweight())}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add product color"
                  />
                  <button
                    type="button"
                    onClick={addweight}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* add size */}
              <div className="">
                <label className="text-white font-medium">Product size</label>
                <div className="flex flex-wrap gap-2">
                  {formData.productSize.map((size) => (
                    <span
                      key={size}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removesize(size)}
                        className="ml-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={setsize}
                    onChange={(e) => setsetsize(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addsize())}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add product color"
                  />
                  <button
                    type="button"
                    onClick={addsize}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* add color */}
              <div className="">
                <label className="text-white font-medium">Product Color</label>
                <div className="flex flex-wrap gap-2">
                  {formData.color.map((color) => (
                    <span
                      key={color}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removecolor(color)}
                        className="ml-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addcolor())}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add product color"
                  />
                  <button
                    type="button"
                    onClick={addcolor}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="mr-3 text-green-400" />
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-white font-medium">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium">Stock Quantity</label>
                <input
                  type="number"
                  name="productStock"
                  value={formData.productStock}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Available quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium">Product Rank</label>
                <input
                  type="number"
                  name="productRank"
                  value={formData.productRank}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Product ranking"
                />
              </div>
            </div>

            {/* Ratings */}
            <div className="mt-6 space-y-2">
              <label className="text-white font-medium">Initial Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, ratings: star }))}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= formData.ratings ? "text-yellow-400 fill-current" : "text-gray-400"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
                <span className="text-white ml-2">{formData.ratings}/5</span>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Camera className="mr-3 text-purple-400" />
              Product Images
            </h2>

            {/* Drag & Drop Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragOver
                  ? "border-blue-400 bg-blue-500/20"
                  : "border-white/30 hover:border-white/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <Upload className="mx-auto mb-4 text-white/60" size={48} />
              <p className="text-white mb-4 text-lg">Drag & drop images here or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 inline-block"
              >
                Browse Images
              </label>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-medium mb-4">
                  Uploaded Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-xl border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs bg-black/50 rounded px-2 py-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handlePreview}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <Eye size={20} />
              <span>Preview Product</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl text-white flex items-center justify-center space-x-2 shadow-lg transition-all duration-300
    ${
      isLoading
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105"
    }
  `}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm">Total Products</p>
                <p className="text-white text-2xl font-bold">1,248</p>
              </div>
              <Package className="text-cyan-400" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Active Categories</p>
                <p className="text-white text-2xl font-bold">24</p>
              </div>
              <Tag className="text-emerald-400" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm">Featured Products</p>
                <p className="text-white text-2xl font-bold">156</p>
              </div>
              <Star className="text-pink-400" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductComponent;
