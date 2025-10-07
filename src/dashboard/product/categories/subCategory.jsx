"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Search, Filter, Grid, List, Upload, Image, Tag, Layers, ChevronDown, ChevronRight, BarChart3, Download, Edit, Link } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UrlBackend } from '@/src/confic/urlExport';
import { SubCategoryAllGet, SubCategoryCreate, SubCategoryUploade } from '@/src/hook/useSubcategory';

const AddSubcategoriesComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    isActive: true,
    image: null,
    metaTitle: '',
    metaDescription: '',
    category: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const dispatch = useDispatch();

  // categoryget 
  
  const allCategorydata = useSelector((state) => state.category.allCategorydata);
  // Get subcategories from Redux store
  const allsubCategorydata = useSelector((state) => state.subcategory.allsubCategorydata);
  const [categories, setCategories] = useState([]);
  const [categoriename, setCategoriename] = useState("");
  const [categorieid, setCategorieid] = useState("");

  const [subcategories, setSubcategories] = useState([]);

  console.log(categories);
  // categori get 
 useEffect(() => {
    if (allCategorydata?.data) {
      setCategories(allCategorydata.data);
    }
  }, [allCategorydata]);

  useEffect(() => {
    SubCategoryAllGet(dispatch)
    }, [])
  
  // Load categories
  useEffect(() => {
    if (allsubCategorydata?.data) {
      setSubcategories(allsubCategorydata.data);
    }
  }, [allsubCategorydata]);

  

  const iconOptions = ['📱', '💻', '⌚', '🎧', '📷', '🖥️', '⌨️', '🖱️', '👕', '👖', '👗', '👠', '👜', '🧥', '👔', '🥾', '🏠', '🛋️', '🛏️', '🪴', '🍳', '🧹', '⚽', '🏀', '🎾', '🏈', '⛳', '🎮', '🎯', '🎨'];

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        slug: generateSlug(newValue),
        metaTitle: newValue ? `${newValue} - EasyShoppingMall` : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
    }
  };

  const resetForm = () => {
    setFormData({
       categoryname:"",
      category:"",
      name: '',
      slug: '',
      icon: '',
      isActive: true,
      image: null,
      metaTitle: '',
      metaDescription: '',
      category: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Please enter subcategory name');
        return;
      }

      if (!formData.category) {
        toast.error('Please select parent category');
        return;
      }

      if (editingId) {
        // Update existing subcategory
        const response = await SubCategoryUploade(formData, editingId);
        
        if (response.data.success) {
          setSubcategories(prev =>
            prev.map(sub =>
              sub._id === editingId ? { ...sub, ...formData } : sub
            )
          );
          toast.success("Subcategory updated successfully");
        }
      } else {
        // Create new subcategory
        const response = await SubCategoryCreate(formData);
        console.log("Submitting formData:", formData);
        
        if (response.data.success) {
          setSubcategories(prev => [...prev, response.data.data]);
          toast.success("Subcategory added successfully");
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this subcategory?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${UrlBackend}/subcategories/${id}`);
      
      if (response.data.success) {
        setSubcategories(prev => prev.filter(sub => sub._id !== id));
        toast.success("Subcategory deleted successfully ✅");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Delete failed ❌");
    }
  };

  const startEdit = (subcategory) => {
    setFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      icon: subcategory.icon,
      isActive: subcategory.isActive,
      image: subcategory.image,
      metaTitle: subcategory.metaTitle,
      metaDescription: subcategory.metaDescription,
      parentCategory: subcategory.parentCategory
    });
    setEditingId(subcategory._id);
    setShowAddForm(true);
  };

  const toggleSubcategoryStatus = async (subcategory) => {
    try {
      const updatedStatus = !subcategory.isActive;
      
      setSubcategories(prev =>
        prev.map(sub =>
          sub._id === subcategory._id ? { ...sub, isActive: updatedStatus } : sub
        )
      );

      const response = await axios.put(`${UrlBackend}/subcategories/${subcategory._id}`, {
        isActive: updatedStatus
      });

      if (response.data.success) {
        toast.success(`Subcategory "${subcategory.name}" status updated`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
      
      setSubcategories(prev =>
        prev.map(sub =>
          sub._id === subcategory._id ? { ...sub, isActive: subcategory.isActive } : sub
        )
      );
    }
  };

  const toggleExpanded = (id) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const bulkActivate = async () => {
    try {
      setSubcategories(prev => prev.map(sub => ({ ...sub, isActive: true })));

      for (const sub of subcategories) {
        if (!sub.isActive) {
          await axios.put(`${UrlBackend}/subcategories/${sub._id}`, { isActive: true });
        }
      }

      toast.success("All subcategories activated");
    } catch (error) {
      console.error("Bulk activate error:", error);
      toast.error("Failed to activate all");
      fetchSubcategories();
    }
  };

  const bulkDeactivate = async () => {
    try {
      setSubcategories(prev => prev.map(sub => ({ ...sub, isActive: false })));

      for (const sub of subcategories) {
        await axios.put(`${UrlBackend}/subcategories/${sub._id}`, { isActive: false });
      }

      toast.success("All subcategories deactivated");
    } catch (error) {
      console.error("Bulk deactivate error:", error);
      toast.error("Failed to deactivate all");
      fetchSubcategories();
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(subcategories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subcategories-export.json';
    link.click();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.color || '#6366F1';
  };

  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSearch = subcategory.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && subcategory.isActive) ||
      (filterStatus === 'inactive' && !subcategory.isActive);
    const matchesCategory = filterCategory === 'all' || subcategory.parentCategory === filterCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const activeSubcategories = subcategories.filter(sub => sub.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 overflow-hidden">
      <div className="transition-all duration-500 lg:ml-10 lg:px-9">
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-indigo-500/10 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Subcategories <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Management</span>!
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Subcategories</p>
                <p className="text-white text-2xl font-bold">{subcategories.length}</p>
              </div>
              <Layers className="text-purple-400" size={28} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Active Subcategories</p>
                <p className="text-white text-2xl font-bold">{activeSubcategories.length}</p>
              </div>
              <Eye className="text-emerald-400" size={28} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm">Parent Categories</p>
                <p className="text-white text-2xl font-bold">{categories.length}</p>
              </div>
              <Link className="text-cyan-400" size={28} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Inactive</p>
                <p className="text-white text-2xl font-bold">{subcategories.length - activeSubcategories.length}</p>
              </div>
              <EyeOff className="text-orange-400" size={28} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
              </div>

              {/* Filter by Status */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="active" className="bg-slate-800">Active Only</option>
                  <option value="inactive" className="bg-slate-800">Inactive Only</option>
                </select>
              </div>

              {/* Filter by Category */}
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-slate-800">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'grid'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'list'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Add Subcategory Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span>Add Subcategory</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Layers className="mr-3 text-green-400" />
                {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Parent Category *</label>
                  <select
                    name="category"
                    value={formData.category}  
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-slate-800">Select parent category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id} className="bg-slate-800">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Subcategory Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    placeholder="subcategory-url-slug"
                  />
                  <p className="text-gray-400 text-xs">URL: /subcategory/{formData.slug}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Subcategory Icon</label>
                  <div className="grid grid-cols-6 gap-2 mb-3 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-xl hover:scale-110 ${formData.icon === icon
                          ? 'border-green-500 bg-green-500/20 shadow-lg'
                          : 'border-white/20 hover:border-white/40'
                          }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-center"
                    placeholder="Or enter custom emoji/icon"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Subcategory Image</label>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-4 text-center hover:border-white/50 transition-all duration-300">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Subcategory"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Image className="mx-auto mb-2 text-white/60" size={32} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="subcategory-image"
                        />
                        <label
                          htmlFor="subcategory-image"
                          className="cursor-pointer text-white hover:text-green-400 transition-colors font-medium"
                        >
                          Upload Subcategory Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Status</label>
                  <div className="flex items-center p-4 bg-white/10 border border-white/20 rounded-xl">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-600 bg-transparent border-white/30 rounded focus:ring-green-500"
                    />
                    <label className="ml-3 text-white">Subcategory Active</label>
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <BarChart3 className="mr-2 text-yellow-400" size={20} />
                    SEO Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-white font-medium">Meta Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                        placeholder="SEO meta title"
                      />
                      <p className="text-xs text-gray-400">
                        {formData.metaTitle.length}/60 characters
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-white font-medium">Meta Description</label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 resize-none"
                        placeholder="SEO meta description"
                      />
                      <p className="text-xs text-gray-400">
                        {formData.metaDescription.length}/160 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.category}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save size={20} />
                <span>{editingId ? 'Update Subcategory' : 'Add Subcategory'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Subcategories Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Tag className="mr-3 text-blue-400" />
              Subcategories ({filteredSubcategories.length})
            </h2>

            {filteredSubcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={bulkActivate}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm"
                >
                  Activate All
                </button>
                <button
                  onClick={bulkDeactivate}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm"
                >
                  Deactivate All
                </button>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm flex items-center space-x-1"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubcategories.map(subcategory => {
                const categoryColor = getCategoryColor(subcategory.parentCategory);
                return (
                  <div
                    key={subcategory._id}
                    className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 hover:scale-110"
                          style={{
                            backgroundColor: categoryColor + '30',
                            border: `2px solid ${categoryColor}`,
                            boxShadow: `0 0 20px ${categoryColor}40`
                          }}
                        >
                          {subcategory?.icon || '📦'}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{subcategory.name}</h3>
                          <p className="text-gray-300 text-sm">/{subcategory.slug}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {getCategoryName(subcategory.parentCategory)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSubcategoryStatus(subcategory)}
                        className={`p-2 rounded-lg transition-all duration-300 ${subcategory.isActive
                            ? 'text-green-400 hover:bg-green-500/20'
                            : 'text-gray-400 hover:bg-gray-500/20'
                          }`}
                      >
                        {subcategory.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>

                    {subcategory.image && (
                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="w-full h-32 object-cover rounded-xl mb-4 border border-white/10"
                      />
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${subcategory.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}>
                        {subcategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(subcategory)}
                        className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(subcategory._id)}
                        className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubcategories.map(subcategory => {
                const categoryColor = getCategoryColor(subcategory.parentCategory);
                return (
                  <div
                    key={subcategory._id}
                    className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <button
                          onClick={() => toggleExpanded(subcategory._id)}
                          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        >
                          {expandedSubcategories.has(subcategory._id) ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>

                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                          style={{
                            backgroundColor: categoryColor + '30',
                            border: `2px solid ${categoryColor}`,
                            boxShadow: `0 0 15px ${categoryColor}40`
                          }}
                        >
                          {subcategory.icon || '📦'}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-4 flex-wrap gap-2">
                            <h3 className="text-white font-bold text-lg">{subcategory.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${subcategory.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                              }`}>
                              {subcategory.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-gray-400 text-sm">
                              Parent: {getCategoryName(subcategory.parentCategory)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">/{subcategory.slug}</p>
                          {expandedSubcategories.has(subcategory._id) && (
                            <div className="mt-3 space-y-2">
                              {subcategory.metaTitle && (
                                <p className="text-xs text-gray-400">Meta Title: {subcategory.metaTitle}</p>
                              )}
                              {subcategory.metaDescription && (
                                <p className="text-xs text-gray-400">Meta Description: {subcategory.metaDescription}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSubcategoryStatus(subcategory)}
                          className={`p-2 rounded-lg transition-all duration-300 ${subcategory.isActive
                            ? 'text-green-400 hover:bg-green-500/20'
                            : 'text-gray-400 hover:bg-gray-500/20'
                            }`}
                        >
                          {subcategory.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>

                        <button
                          onClick={() => startEdit(subcategory)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(subcategory._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredSubcategories.length === 0 && (
            <div className="text-center py-16">
              <div className="relative">
                <Tag className="mx-auto mb-4 text-gray-400 animate-pulse" size={64} />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Subcategories Found</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first subcategory'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 mx-auto transform hover:scale-105 shadow-lg"
                >
                  <Plus size={24} />
                  <span>Add Your First Subcategory</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Subcategory Table */}
        <div className="bg-white/10 backdrop-blur-lg mt-5 rounded-2xl border border-white/20 overflow-x-auto shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 px-6 py-4">
            <div className="grid grid-cols-6 gap-4 items-center text-sm font-semibold text-indigo-200 uppercase min-w-max">
              <div>Image</div>
              <div>Subcategory</div>
              <div>Parent Category</div>
              <div>Icon</div>
              <div>Status</div>
              <div className="text-right">Action</div>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {subcategories.map((subcategory, index) => {
              const categoryColor = getCategoryColor(subcategory.parentCategory);
              return (
                <div
                  key={subcategory._id}
                  className="px-6 py-4 hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.01] group"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'slideInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="grid grid-cols-6 gap-4 items-center min-w-max">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300"
                        style={{ 
                          backgroundColor: categoryColor + '30',
                          border: `2px solid ${categoryColor}`
                        }}
                      >
                        {subcategory.image ? (
                          <img src={subcategory.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          subcategory.icon || '📦'
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors duration-300">
                        {subcategory.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        /{subcategory.slug}
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-medium">
                        {getCategoryName(subcategory.parentCategory)}
                      </div>
                      <div className="text-sm text-gray-400">Parent</div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex justify-center items-center rounded-lg border-2 border-white/20 shadow-lg">
                          <span className="text-gray-300 text-2xl font-mono">{subcategory.icon || '📦'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subcategory.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {subcategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toggleSubcategoryStatus(subcategory)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          subcategory.isActive
                            ? 'text-green-400 hover:bg-green-500/20'
                            : 'text-gray-400 hover:bg-gray-500/20'
                        }`}
                      >
                        {subcategory.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => startEdit(subcategory)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                        title="Edit Subcategory"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory._id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-110"
                        title="Delete Subcategory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {subcategories.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No subcategories found</div>
              <div className="text-gray-500 text-sm">Add your first subcategory to get started</div>
            </div>
          )}
        </div>

        {/* Bulk Actions Panel */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Edit3 className="mr-3 text-yellow-400" />
            Bulk Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={bulkActivate}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Eye size={20} />
              <span>Activate All</span>
            </button>

            <button
              onClick={bulkDeactivate}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <EyeOff size={20} />
              <span>Deactivate All</span>
            </button>

            <button
              onClick={() => toast.info('CSV import feature coming soon')}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Upload size={20} />
              <span>Import CSV</span>
            </button>

            <button
              onClick={exportData}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Download size={20} />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Subcategory Hierarchy */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Layers className="mr-3 text-teal-400" />
            Subcategory Hierarchy
          </h2>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-6">
            {categories.map(category => {
              const categorySubcategories = subcategories.filter(
                sub => sub.parentCategory === category._id
              );
              
              if (categorySubcategories.length === 0) return null;

              return (
                <div key={category._id} className="mb-4 last:mb-0">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{
                        backgroundColor: category.color + '30',
                        border: `2px solid ${category.color || '#6366F1'}`
                      }}
                    >
                      {category.icon}
                    </div>
                    <span className="text-white font-bold text-lg">{category.name}</span>
                    <span className="text-gray-400 text-sm">
                      ({categorySubcategories.length} subcategories)
                    </span>
                  </div>

                  <div className="ml-6 space-y-2">
                    {categorySubcategories.map(subcat => (
                      <div key={subcat._id} className="flex items-center justify-between p-3 bg-white/3 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: (category.color || '#6366F1') + '30',
                              border: `2px solid ${category.color || '#6366F1'}`
                            }}
                          >
                            {subcat.icon || '📦'}
                          </div>
                          <div>
                            <span className="text-gray-200 font-medium">{subcat.name}</span>
                            <p className="text-xs text-gray-400">/{subcat.slug}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          subcat.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {subcat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {categories.every(cat => 
              subcategories.filter(sub => sub.parentCategory === cat._id).length === 0
            ) && (
              <div className="text-center py-8 text-gray-400">
                No subcategories to display in hierarchy
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Tag className="mr-3 text-rose-400" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-white/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Subcategory Templates</h3>
              <p className="text-gray-300 text-sm mb-4">Use predefined templates for quick setup</p>
              <button 
                onClick={() => toast.info('Templates feature coming soon')}
                className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
              >
                Browse Templates
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-white/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Subcategory Analytics</h3>
              <p className="text-gray-300 text-sm mb-4">View detailed analytics for each subcategory</p>
              <button 
                onClick={() => toast.info('Analytics feature coming soon')}
                className="w-full px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300"
              >
                View Analytics
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-white/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Bulk Import</h3>
              <p className="text-gray-300 text-sm mb-4">Import subcategories from CSV</p>
              <button 
                onClick={() => toast.info('Import feature coming soon')}
                className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7C3AED, #DB2777);
        }
      `}</style>
    </div>
  );
};

export default AddSubcategoriesComponent;