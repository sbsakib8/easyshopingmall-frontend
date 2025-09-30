"use client"
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Shield,
  Bell,
  CreditCard,
  Truck,
  Eye,
  EyeOff
} from 'lucide-react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    // Store Information
    storeName: 'My E-commerce Store',
    storeDescription: 'Best quality products at affordable prices',
    storeEmail: 'admin@mystore.com',
    storePhone: '+1234567890',
    storeAddress: '123 Business Street, City, Country',
    storeWebsite: 'https://mystore.com',
    
    // Currency & Region
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    country: 'US',
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerNotifications: true,
    
    // SEO
    metaTitle: 'My E-commerce Store',
    metaDescription: 'Best online shopping destination',
    metaKeywords: 'ecommerce, online shopping, products',
    
    // Social Media
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    
    // Payment
    paymentMethods: {
      creditCard: true,
      paypal: true,
      stripe: true,
      bankTransfer: false
    },
    
    // Shipping
    freeShippingThreshold: '50',
    shippingCalculation: 'weight',
    defaultShippingRate: '5',
    
    // Display
    productsPerPage: '12',
    showOutOfStock: true,
    enableWishlist: true,
    enableReviews: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'display', label: 'Display', icon: Eye }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'CAD', 'AUD'];
  const timezones = ['UTC', 'EST', 'PST', 'GMT', 'CET', 'JST', 'IST', 'BST'];
  const languages = ['en', 'bn', 'es', 'fr', 'de', 'it', 'pt', 'ar'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 overflow-hidden">
      <div className="transition-all duration-500 lg:ml-15 py-5 px-2 lg:px-9 mx-auto">
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
                  General <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span>! 
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
             
            </div>
          </div>
        </div>


        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br text-white from-gray-800 to-gray-900  border border-gray-700 rounded-2xl shadow-xl overflow-hidden sticky top-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Settings Menu</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                            : 'text-white hover:bg-gray-50 hover:text-purple-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-gray-800 text-white to-gray-900 rounded-2xl shadow-xl border border-gray-700  overflow-hidden">
              <div className="p-8">
                {/* Store Information Tab */}
                {activeTab === 'store' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Store Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Store Name</label>
                        <input
                          type="text"
                          value={settings.storeName}
                          onChange={(e) => handleInputChange('storeName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 ttext-white" />
                          <input
                            type="email"
                            value={settings.storeEmail}
                            onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-white" />
                          <input
                            type="tel"
                            value={settings.storePhone}
                            onChange={(e) => handleInputChange('storePhone', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 w-5 h-5 text-white" />
                          <input
                            type="url"
                            value={settings.storeWebsite}
                            onChange={(e) => handleInputChange('storeWebsite', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Store Description</label>
                      <textarea
                        value={settings.storeDescription}
                        onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-white" />
                        <textarea
                          value={settings.storeAddress}
                          onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                          rows="2"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Currency</label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          {currencies.map(currency => (
                            <option  className='bg-gray-700' key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Timezone</label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          {timezones.map(timezone => (
                            <option className='bg-gray-700' key={timezone} value={timezone}>{timezone}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          {languages.map(lang => (
                            <option  className='bg-gray-700' key={lang} value={lang}>{lang.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Country</label>
                        <input
                          type="text"
                          value={settings.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings Tab */}
                {activeTab === 'email' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Email Configuration</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email Provider</label>
                        <select
                          value={settings.emailProvider}
                          onChange={(e) => handleInputChange('emailProvider', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <option className='bg-gray-700' value="smtp">SMTP</option>
                          <option className='bg-gray-700' value="sendgrid">SendGrid</option>
                          <option className='bg-gray-700' value="mailgun">Mailgun</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">SMTP Host</label>
                        <input
                          type="text"
                          value={settings.smtpHost}
                          onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">SMTP Port</label>
                        <input
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Username</label>
                        <input
                          type="text"
                          value={settings.smtpUsername}
                          onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={settings.smtpPassword}
                          onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Password Policy</label>
                        <select
                          value={settings.passwordPolicy}
                          onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <option className='bg-gray-700' value="weak">Weak</option>
                          <option className='bg-gray-700' value="medium">Medium</option>
                          <option className='bg-gray-700' value="strong">Strong</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-white">Add extra security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-50 mb-6">Notification Settings</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'orderNotifications', label: 'Order Notifications', desc: 'Get notified about new orders' },
                        { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when products are running low' },
                        { key: 'customerNotifications', label: 'Customer Notifications', desc: 'Notifications about customer activities' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h3 className="font-medium text-white">{item.label}</h3>
                            <p className="text-sm text-white">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[item.key]}
                              onChange={(e) => handleInputChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">SEO Settings</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Meta Description</label>
                      <textarea
                        value={settings.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={settings.metaKeywords}
                        onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                        placeholder="Separate keywords with commas"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Social Media Links</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourstore' },
                          { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourstore' },
                          { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourstore' },
                          { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourstore' }
                        ].map((social) => (
                          <div key={social.key}>
                            <label className="block text-sm font-medium text-white mb-2">{social.label}</label>
                            <input
                              type="url"
                              value={settings[social.key]}
                              onChange={(e) => handleInputChange(social.key, e.target.value)}
                              placeholder={social.placeholder}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Payment Methods</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'creditCard', label: 'Credit/Debit Cards', desc: 'Accept Visa, Mastercard, etc.' },
                        { key: 'paypal', label: 'PayPal', desc: 'Accept PayPal payments' },
                        { key: 'stripe', label: 'Stripe', desc: 'Process payments through Stripe' },
                        { key: 'bankTransfer', label: 'Bank Transfer', desc: 'Accept direct bank transfers' }
                      ].map((method) => (
                        <div key={method.key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h3 className="font-medium text-white">{method.label}</h3>
                            <p className="text-sm text-white">{method.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.paymentMethods[method.key]}
                              onChange={(e) => handleNestedInputChange('paymentMethods', method.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Shipping Settings</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Free Shipping Threshold ($)</label>
                        <input
                          type="number"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Default Shipping Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.defaultShippingRate}
                          onChange={(e) => handleInputChange('defaultShippingRate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Shipping Calculation Method</label>
                      <select
                        value={settings.shippingCalculation}
                        onChange={(e) => handleInputChange('shippingCalculation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      >
                        <option className='bg-gray-700' value="weight">By Weight</option>
                        <option className='bg-gray-700' value="price">By Price</option>
                        <option className='bg-gray-700' value="quantity">By Quantity</option>
                        <option className='bg-gray-700' value="fixed">Fixed Rate</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Display Tab */}
                {activeTab === 'display' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6">Display Settings</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Products Per Page</label>
                        <select
                          value={settings.productsPerPage}
                          onChange={(e) => handleInputChange('productsPerPage', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <option className='bg-gray-700' value="6">6</option>
                          <option className='bg-gray-700' value="12">12</option>
                          <option className='bg-gray-700' value="24">24</option>
                          <option className='bg-gray-700' value="48">48</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'showOutOfStock', label: 'Show Out of Stock Products', desc: 'Display products that are out of stock' },
                        { key: 'enableWishlist', label: 'Enable Wishlist', desc: 'Allow customers to save products to wishlist' },
                        { key: 'enableReviews', label: 'Enable Product Reviews', desc: 'Allow customers to review products' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h3 className="font-medium text-white">{item.label}</h3>
                            <p className="text-sm text-gray-300">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[item.key]}
                              onChange={(e) => handleInputChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setSettings({
                        storeName: 'My E-commerce Store',
                        storeDescription: 'Best quality products at affordable prices',
                        storeEmail: 'admin@mystore.com',
                        storePhone: '+1234567890',
                        storeAddress: '123 Business Street, City, Country',
                        storeWebsite: 'https://mystore.com',
                        currency: 'USD',
                        timezone: 'UTC',
                        language: 'en',
                        country: 'US',
                        emailProvider: 'smtp',
                        smtpHost: 'smtp.gmail.com',
                        smtpPort: '587',
                        smtpUsername: '',
                        smtpPassword: '',
                        twoFactorAuth: false,
                        sessionTimeout: '30',
                        passwordPolicy: 'strong',
                        emailNotifications: true,
                        orderNotifications: true,
                        lowStockAlerts: true,
                        customerNotifications: true,
                        metaTitle: 'My E-commerce Store',
                        metaDescription: 'Best online shopping destination',
                        metaKeywords: 'ecommerce, online shopping, products',
                        facebook: '',
                        instagram: '',
                        twitter: '',
                        linkedin: '',
                        paymentMethods: {
                          creditCard: true,
                          paypal: true,
                          stripe: true,
                          bankTransfer: false
                        },
                        freeShippingThreshold: '50',
                        shippingCalculation: 'weight',
                        defaultShippingRate: '5',
                        productsPerPage: '12',
                        showOutOfStock: true,
                        enableWishlist: true,
                        enableReviews: true
                      })}
                      className="px-6 py-3 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Reset to Default
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast (would be better with a proper toast library) */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Saving settings...</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Custom scrollbar for better aesthetics */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        /* Smooth transitions for form elements */
        input, select, textarea {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        input:focus, select:focus, textarea:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Enhanced button hover effects */
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        button:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Toggle switch animations */
        .peer:checked + div {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  );
};

export default GeneralSettings;