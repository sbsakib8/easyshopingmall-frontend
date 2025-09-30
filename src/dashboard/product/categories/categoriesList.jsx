"use client";
import React, { useState } from 'react';
import { Edit, Trash2, Plus, Home, Search, Filter, Eye } from 'lucide-react';

const CategoriesList = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Jewellery',
      color: '#deffd9',
      image: '💎',
      status: 'active',
      productsCount: 45
    },
    {
      id: 2,
      name: 'Wellness',
      color: '#fff3ff',
      image: '🧘',
      status: 'active',
      productsCount: 32
    },
    {
      id: 3,
      name: 'Beauty',
      color: '#e3fffa',
      image: '💄',
      status: 'active',
      productsCount: 78
    },
    {
      id: 4,
      name: 'Groceries',
      color: '#ffe8f8',
      image: '🛒',
      status: 'active',
      productsCount: 156
    },
    {
      id: 5,
      name: 'Footwear',
      color: '#def3ff',
      image: '👟',
      status: 'active',
      productsCount: 89
    },
    {
      id: 6,
      name: 'Bags',
      color: '#fdf0ff',
      image: '👜',
      status: 'active',
      productsCount: 67
    },
    {
      id: 7,
      name: 'Electronics',
      color: '#fee6a',
      image: '📱',
      status: 'active',
      productsCount: 234
    },
    {
      id: 8,
      name: 'Fashion',
      color: '#ecffecu',
      image: '👕',
      status: 'active',
      productsCount: 145
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#deffd9',
    image: '🏷️'
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || category.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        ...newCategory,
        status: 'active',
        productsCount: 0
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', color: '#deffd9', image: '🏷️' });
      setShowAddModal(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      image: category.image
    });
    setShowAddModal(true);
  };

  const handleUpdateCategory = () => {
    if (newCategory.name.trim() && editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...newCategory }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', color: '#deffd9', image: '🏷️' });
      setShowAddModal(false);
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const toggleStatus = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
        : cat
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">

         
      {/* main component */}
      <div className={`transition-all  duration-500 lg:ml-10 lg:px-9`}>
       
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
                  Categories <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">List</span>! 
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
             
            </div>
          </div>
        </div>

      <div className="p-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="active" className="bg-slate-800">Active</option>
                <option value="inactive" className="bg-slate-800">Inactive</option>
              </select>
            </div>
            <div className="text-sm text-blue-200 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-lg">
              Total: {filteredCategories.length}
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-scroll shadow-2xl">
          {/* Table Header */}
          <div className="bg-gradient-to-r  from-blue-600/30 to-indigo-600/30 px-6 py-4">
            <div className=" flex justify-between  gap-4 items-center text-sm font-semibold text-blue-200 uppercase ">
              <div>Image</div>
              <div>Category</div>
              <div className="">Color</div>
              <div className="">Products</div>
              <div className="text-right">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/10">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className="px-6 py-4 hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.01] group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <div className=" flex gap-4 items-center justify-between">
                  {/* Image */}
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.image}
                    </div>
                  </div>

                  {/* Category Name */}
                  <div>
                    <div className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors duration-300">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Status: <span className={`px-2 py-1 rounded-full text-xs ${
                        category.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {category.status}
                      </span>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-300 text-sm font-mono">{category.color}</span>
                    </div>
                  </div>

                  {/* Products Count */}
                  <div className="">
                    <div className="text-white font-semibold">
                      {category.productsCount}
                    </div>
                    <div className="text-sm text-gray-400">products</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleStatus(category.id)}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-110"
                      title="Toggle Status"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-110"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No categories found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{categories.length}</div>
            <div className="text-blue-300 text-sm">Total Categories</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{categories.filter(c => c.status === 'active').length}</div>
            <div className="text-green-300 text-sm">Active Categories</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{categories.reduce((sum, cat) => sum + cat.productsCount, 0)}</div>
            <div className="text-purple-300 text-sm">Total Products</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{Math.round(categories.reduce((sum, cat) => sum + cat.productsCount, 0) / categories.length)}</div>
            <div className="text-orange-300 text-sm">Avg Products/Category</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Icon/Emoji</label>
                <input
                  type="text"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter emoji or icon"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: '#deffd9', image: '🏷️' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
      </div>
    </div>
  );
};

export default CategoriesList;