"use client"
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Search, Filter, Grid, List, Upload, Image, Tag, Layers, ChevronDown, ChevronRight, BarChart3, Download } from 'lucide-react';

const AddCategoriesComponent = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      icon: '📱',
      color: '#3B82F6',
      isActive: true,
      sortOrder: 1,
      parentId: null,
      image: null,
      metaTitle: 'Electronics - Best Gadgets',
      metaDescription: 'Shop the latest electronics and gadgets',
      subcategories: [
        { id: 11, name: 'Mobile Phones', slug: 'mobile-phones', isActive: true, sortOrder: 1 },
        { id: 12, name: 'Laptops', slug: 'laptops', isActive: true, sortOrder: 2 }
      ]
    },
    {
      id: 2,
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      icon: '👗',
      color: '#EC4899',
      isActive: true,
      sortOrder: 2,
      parentId: null,
      image: null,
      metaTitle: 'Fashion - Latest Trends',
      metaDescription: 'Discover the latest fashion trends',
      subcategories: [
        { id: 21, name: 'Men Clothing', slug: 'men-clothing', isActive: true, sortOrder: 1 },
        { id: 22, name: 'Women Clothing', slug: 'women-clothing', isActive: true, sortOrder: 2 }
      ]
    },
    {
      id: 3,
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      icon: '🏠',
      color: '#10B981',
      isActive: false,
      sortOrder: 3,
      parentId: null,
      image: null,
      metaTitle: 'Home & Garden Essentials',
      metaDescription: 'Transform your home and garden',
      subcategories: []
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    isActive: true,
    image: null,
    metaTitle: '',
    metaDescription: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const iconOptions = ['📱', '👗', '🏠', '⚽', '📚', '💄', '🚗', '🧸', '🍔', '💊', '🎮', '🎵', '💼', '🌟', '🔧', '🎨', '🌿', '🍕'];
  const colorOptions = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#64748B'];

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
      name: '',
      slug: '',
      icon: '',
      isActive: true,
      image: null,
      metaTitle: '',
      metaDescription: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = () => {
  try {
    if (!formData.name.trim()) return;

    if (editingId) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingId
            ? { ...cat, ...formData, id: editingId }
            : cat
        )
      );
    } else {
      // Add new category
      const newCategory = {
        ...formData,
        id: Date.now(),
        subcategories: []
      };
      setCategories(prev => [...prev, newCategory]);
      console.log(newCategory);
    }

    resetForm();
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    alert("Something went wrong while saving the category!");
  }
};



  const startEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      isActive: category.isActive,
      image: category.image,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription
    });
    setEditingId(category.id);
    setShowAddForm(true);
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const toggleCategoryStatus = (id) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const toggleExpanded = (id) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const bulkActivate = () => {
    setCategories(prev => prev.map(cat => ({ ...cat, isActive: true })));
  };

  const bulkDeactivate = () => {
    setCategories(prev => prev.map(cat => ({ ...cat, isActive: false })));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'categories-export.json';
    link.click();
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive);
    return matchesSearch && matchesFilter;
  });

  const mainCategories = categories.filter(cat => !cat.parentId);
  const activeCategories = categories.filter(cat => cat.isActive);
  const totalSubcategories = categories.reduce((total, cat) => total + (cat.subcategories?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 overflow-hidden">
      <div className={`transition-all  duration-500  lg:ml-10 lg:px-9`}>
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Categories <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add</span>! 
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
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm">Total Categories</p>
                <p className="text-white text-2xl font-bold">{categories.length}</p>
              </div>
              <Layers className="text-cyan-400" size={28} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Active Categories</p>
                <p className="text-white text-2xl font-bold">{activeCategories.length}</p>
              </div>
              <Eye className="text-emerald-400" size={28} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm">Main Categories</p>
                <p className="text-white text-2xl font-bold">{mainCategories.length}</p>
              </div>
              <Grid className="text-pink-400" size={28} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Subcategories</p>
                <p className="text-white text-2xl font-bold">{totalSubcategories}</p>
              </div>
              <List className="text-orange-400" size={28} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All Categories</option>
                  <option value="active" className="bg-slate-800">Active Only</option>
                  <option value="inactive" className="bg-slate-800">Inactive Only</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Add Category Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Layers className="mr-3 text-green-400" />
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    placeholder="Enter category name"
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
                    placeholder="category-url-slug"
                  />
                  <p className="text-gray-400 text-xs">URL: /category/{formData.slug}</p>
                </div>

              </div>

              {/* Right Column - Visual & SEO */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Category Icon</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-xl hover:scale-110 ${
                          formData.icon === icon
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
                  <label className="text-white font-medium">Category Image</label>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-4 text-center hover:border-white/50 transition-all duration-300">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Category"
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
                          id="category-image"
                        />
                        <label
                          htmlFor="category-image"
                          className="cursor-pointer text-white hover:text-green-400 transition-colors font-medium"
                        >
                          Upload Category Image
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
                    <label className="ml-3 text-white">Category Active</label>
                  </div>
                </div>
              </div>

              {/* SEO Section - Full Width */}
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
                disabled={!formData.name.trim()}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save size={20} />
                <span>{editingId ? 'Update Category' : 'Add Category'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Categories Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Tag className="mr-3 text-blue-400" />
              Categories ({filteredCategories.length})
            </h2>
            
            {filteredCategories.length > 0 && (
              <div className="flex space-x-2">
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
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map(category => (
                <div
                  key={category.id}
                  className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 hover:scale-110"
                        style={{ 
                          backgroundColor: category.color + '30', 
                          border: `2px solid ${category.color}`,
                          boxShadow: `0 0 20px ${category.color}40`
                        }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{category.name}</h3>
                        <p className="text-gray-300 text-sm">/{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          category.isActive
                            ? 'text-green-400 hover:bg-green-500/20'
                            : 'text-gray-400 hover:bg-gray-500/20'
                        }`}
                      >
                        {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </div>

                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-xl mb-4 border border-white/10"
                    />
                  )}

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {category.subcategories?.length || 0} subcategories
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredCategories.map(category => (
                <div
                  key={category.id}
                  className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => toggleExpanded(category.id)}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                      
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                        style={{ 
                          backgroundColor: category.color + '30', 
                          border: `2px solid ${category.color}`,
                          boxShadow: `0 0 15px ${category.color}40`
                        }}
                      >
                        {category.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 flex-wrap">
                          <h3 className="text-white font-bold text-lg">{category.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-gray-300 text-sm">
                            Order: {category.sortOrder}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {category.subcategories?.length || 0} subcategories
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">/{category.slug}</p>
                        {expandedCategories.has(category.id) && (
                          <div className="mt-3 space-y-2">
                            <p className="text-gray-300 text-sm">{category.description}</p>
                            {category.metaTitle && (
                              <p className="text-xs text-gray-400">Meta Title: {category.metaTitle}</p>
                            )}
                            {category.metaDescription && (
                              <p className="text-xs text-gray-400">Meta Description: {category.metaDescription}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          category.isActive
                            ? 'text-green-400 hover:bg-green-500/20'
                            : 'text-gray-400 hover:bg-gray-500/20'
                        }`}
                      >
                        {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                      >
                        <Edit3 size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id) && category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-4 ml-8 space-y-2">
                      <h4 className="text-white font-medium text-sm flex items-center">
                        <List className="mr-2" size={16} />
                        Subcategories:
                      </h4>
                      {category.subcategories.map(subcat => (
                        <div key={subcat.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span className="text-gray-300 font-medium">{subcat.name}</span>
                            <span className="text-xs text-gray-500">/{subcat.slug}</span>
                            <span className="text-xs text-gray-500">Order: {subcat.sortOrder}</span>
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
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="relative">
                <Tag className="mx-auto mb-4 text-gray-400 animate-pulse" size={64} />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Categories Found</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for'
                  : 'Start building your product catalog by adding your first category'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 mx-auto transform hover:scale-105 shadow-lg"
                >
                  <Plus size={24} />
                  <span>Add Your First Category</span>
                </button>
              )}
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
              onClick={() => alert('Import CSV functionality would be implemented here')}
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

        {/* Recent Activity */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="mr-3 text-indigo-400" />
            Recent Category Activity
          </h2>
          
          <div className="space-y-4">
            {[
              { action: 'Created', category: 'Gaming Accessories', time: '2 hours ago', type: 'create', user: 'Admin' },
              { action: 'Updated', category: 'Mobile Phones', time: '5 hours ago', type: 'update', user: 'Manager' },
              { action: 'Deactivated', category: 'Vintage Items', time: '1 day ago', type: 'disable', user: 'Admin' },
              { action: 'Created', category: 'Smart Watches', time: '2 days ago', type: 'create', user: 'Admin' },
              { action: 'Updated', category: 'Fashion Accessories', time: '3 days ago', type: 'update', user: 'Editor' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    activity.type === 'create' ? 'bg-green-400' :
                    activity.type === 'update' ? 'bg-blue-400' :
                    'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">
                      {activity.action} "{activity.category}"
                    </p>
                    <p className="text-gray-300 text-sm">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.type === 'create' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {activity.action}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300">
              View All Activity
            </button>
          </div>
        </div>

        {/* Category Tree Structure */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Layers className="mr-3 text-teal-400" />
            Category Hierarchy
          </h2>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            {mainCategories.map(category => (
              <div key={category.id} className="mb-4 last:mb-0">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ 
                      backgroundColor: category.color + '30', 
                      border: `2px solid ${category.color}`
                    }}
                  >
                    {category.icon}
                  </div>
                  <span className="text-white font-medium">{category.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subcategories.map(subcat => (
                      <div key={subcat.id} className="flex items-center space-x-3 p-2 bg-white/3 rounded-lg">
                        <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{subcat.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          subcat.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {subcat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Tag className="mr-3 text-rose-400" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-white/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Category Templates</h3>
              <p className="text-gray-300 text-sm mb-4">Use predefined category templates for quick setup</p>
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300">
                Browse Templates
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-white/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Category Analytics</h3>
              <p className="text-gray-300 text-sm mb-4">View detailed analytics for each category</p>
              <button className="w-full px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300">
                View Analytics
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-white/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
              <h3 className="text-white font-bold mb-2">Bulk Import</h3>
              <p className="text-gray-300 text-sm mb-4">Import categories from CSV or other sources</p>
              <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300">
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
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

        /* Glow effects */
        .glow-effect {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        
        .hover\\:glow-effect:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }

        /* Pulse animation for active elements */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
          }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AddCategoriesComponent;