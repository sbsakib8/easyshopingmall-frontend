"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, X, RefreshCw, Edit, Check, AlertCircle } from 'lucide-react';
import { WebsiteinfoCreate, WebsiteinfoDelete, WebsiteinfoUploade } from '@/src/hook/content/useWebsiteInfo';
import { useGetwebsiteinfo } from '@/src/utlis/content/useWebsiteinfo';


export default function WebsiteInfoAdmin() {
  const { websiteinfo, loading: dataLoading, error: dataError, refetch } = useGetwebsiteinfo();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    offerText: '',
    countdownDays: 0,
    countdownHours: 0,
    countdownMinutes: 0,
    countdownSeconds: 0,
    countdownTargetDate: '',
    deliveryText: '',
    supportContact: '',
    discountTitle: '',
    discountLabel: 'Sale',
    discountPercent: 0,
    discountLink: '',
    address: '',
    email: '',
    number: '',
    socialLinks: [],
    active: true
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newSocialLinks = [...formData.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', icon: '', url: '', active: true }]
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.offerText || !formData.discountTitle || !formData.address || !formData.email || !formData.number) {
      showNotification('Please fill all required fields!', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await WebsiteinfoUploade(formData, editingId);
        showNotification('Successfully updated!', 'success');
      } else {
        await WebsiteinfoCreate(formData);
        showNotification('Successfully created!', 'success');
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error:', error);
      showNotification(error.response?.data?.message || 'Operation failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      await WebsiteinfoDelete(id);
      showNotification('Successfully deleted!', 'success');
      refetch();
    } catch (error) {
      console.error('Error:', error);
      showNotification('Delete failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (info) => {
    setFormData({
      offerText: info.offerText || '',
      countdownDays: info.countdownDays || 0,
      countdownHours: info.countdownHours || 0,
      countdownMinutes: info.countdownMinutes || 0,
      countdownSeconds: info.countdownSeconds || 0,
      countdownTargetDate: info.countdownTargetDate ? new Date(info.countdownTargetDate).toISOString().slice(0, 16) : '',
      deliveryText: info.deliveryText || '',
      supportContact: info.supportContact || '',
      discountTitle: info.discountTitle || '',
      discountLabel: info.discountLabel || 'Sale',
      discountPercent: info.discountPercent || 0,
      discountLink: info.discountLink || '',
      address: info.address || '',
      email: info.email || '',
      number: info.number || '',
      socialLinks: info.socialLinks || [],
      active: info.active !== undefined ? info.active : true
    });
    setEditingId(info._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      offerText: '',
      countdownDays: 0,
      countdownHours: 0,
      countdownMinutes: 0,
      countdownSeconds: 0,
      countdownTargetDate: '',
      deliveryText: '',
      supportContact: '',
      discountTitle: '',
      discountLabel: 'Sale',
      discountPercent: 0,
      discountLink: '',
      address: '',
      email: '',
      number: '',
      socialLinks: [],
      active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-6 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}>
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl  rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Website Info Management</h1>
              <p className="text-white mt-1">Admin Dashboard</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={refetch}
                disabled={dataLoading || loading}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex-1 md:flex-initial"
              >
                <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex-1 md:flex-initial"
              >
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showForm ? 'Cancel' : 'Add New'}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg p-4 md:p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              {editingId ? 'Edit Website Info' : 'Create New Website Info'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Top Bar Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold  mb-4">📌 Top Bar Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Offer Text <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="offerText"
                      value={formData.offerText}
                      onChange={handleInputChange}
                      placeholder="FREE delivery & 40% Discount..."
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Countdown Days</label>
                    <input
                      type="number"
                      name="countdownDays"
                      value={formData.countdownDays}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Countdown Hours</label>
                    <input
                      type="number"
                      name="countdownHours"
                      value={formData.countdownHours}
                      onChange={handleInputChange}
                      min="0"
                      max="23"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Countdown Minutes</label>
                    <input
                      type="number"
                      name="countdownMinutes"
                      value={formData.countdownMinutes}
                      onChange={handleInputChange}
                      min="0"
                      max="59"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Countdown Seconds</label>
                    <input
                      type="number"
                      name="countdownSeconds"
                      value={formData.countdownSeconds}
                      onChange={handleInputChange}
                      min="0"
                      max="59"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Date & Time</label>
                    <input
                      type="datetime-local"
                      name="countdownTargetDate"
                      value={formData.countdownTargetDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Time</label>
                    <input
                      type="text"
                      name="deliveryText"
                      value={formData.deliveryText}
                      onChange={handleInputChange}
                      placeholder="7:00 to 22:00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Support Contact</label>
                    <input
                      type="text"
                      name="supportContact"
                      value={formData.supportContact}
                      onChange={handleInputChange}
                      placeholder="+258 3268 21485"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">🎁 Discount / Sale Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="discountTitle"
                      value={formData.discountTitle}
                      onChange={handleInputChange}
                      placeholder="Get 30% Discount Now"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Discount Label</label>
                    <input
                      type="text"
                      name="discountLabel"
                      value={formData.discountLabel}
                      onChange={handleInputChange}
                      placeholder="Sale"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Percent <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discountPercent"
                      value={formData.discountPercent}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      placeholder="30"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Discount Link</label>
                    <input
                      type="text"
                      name="discountLink"
                      value={formData.discountLink}
                      onChange={handleInputChange}
                      placeholder="/shop"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">📍 Footer Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, Country"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="info@example.com"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">🔗 Social Media Links</h3>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">Platform</label>
                          <input
                            type="text"
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                            placeholder="Facebook"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">Icon</label>
                          <input
                            type="text"
                            value={link.icon || ''}
                            onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                            placeholder="fa-facebook"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">URL</label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                            placeholder="https://facebook.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        
                        <div className="flex items-end gap-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={link.active}
                              onChange={(e) => handleSocialLinkChange(index, 'active', e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                          
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="ml-auto bg-red-500  p-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {formData.socialLinks.length === 0 && (
                    <p className="text-gray-300 text-center py-4">No social links added yet</p>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Active Status</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data List */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-6">Website Info List</h2>
          
          {dataLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="text-gray-300 mt-4">Loading data...</p>
            </div>
          ) : dataError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-8 h-8 mx-auto text-red-600 mb-4" />
              <p className="text-red-600">Error loading data. Please try again.</p>
              <button
                onClick={refetch}
                className="mt-4 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : !websiteinfo || websiteinfo.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 mb-4">No data found. Create your first entry!</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600  px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Create New
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {websiteinfo.map((info) => (
                <div key={info._id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-gray-300">{info.discountTitle}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          info.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {info.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm md:text-base">{info.offerText}</p>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleEdit(info)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600  px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex-1 md:flex-initial"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(info._id)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">Discount:</span>
                      <span className="ml-2 text-gray-300">{info.discountPercent}%</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Email:</span>
                      <span className="ml-2 text-gray-300 break-all">{info.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Phone:</span>
                      <span className="ml-2 text-gray-300">{info.number}</span>
                    </div>
                    <div className="md:col-span-3">
                      <span className="font-medium text-gray-300">Address:</span>
                      <span className="ml-2 text-gray-300">{info.address}</span>
                    </div>
                    {info.deliveryText && (
                      <div>
                        <span className="font-medium text-gray-300">Delivery:</span>
                        <span className="ml-2 text-gray-300">{info.deliveryText}</span>
                      </div>
                    )}
                    {info.supportContact && (
                      <div>
                        <span className="font-medium text-gray-300">Support:</span>
                        <span className="ml-2 text-gray-300">{info.supportContact}</span>
                      </div>
                    )}
                    {info.socialLinks && info.socialLinks.length > 0 && (
                      <div className="md:col-span-3">
                        <span className="font-medium text-gray-300">Social Media:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {info.socialLinks.map((social, idx) => (
                            <a
                              key={idx}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs hover:bg-indigo-200 transition"
                            >
                              {social.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}