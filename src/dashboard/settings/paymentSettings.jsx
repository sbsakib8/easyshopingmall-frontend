"use client"
import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Settings,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Wallet
} from 'lucide-react';

const PaymentSettings = () => {
  const [activeTab, setActiveTab] = useState('gateways');
  const [showApiKey, setShowApiKey] = useState({});
  const [settings, setSettings] = useState({
    stripe: {
      enabled: true,
      publicKey: 'pk_test_51H...',
      secretKey: 'sk_test_51H...',
      webhookSecret: 'whsec_...',
      currencies: ['USD', 'EUR', 'BDT']
    },
    paypal: {
      enabled: true,
      clientId: 'AYSq3RDGsmBLJE...',
      clientSecret: 'EHxhLJj1XJE...',
      sandbox: false
    },
    razorpay: {
      enabled: false,
      keyId: 'rzp_test_...',
      keySecret: 'rzp_test_...'
    },
    ssl: {
      enabled: true,
      storeId: 'test_store',
      storePassword: 'test_password',
      sandbox: true
    },
    bkash: {
      enabled: true,
      username: 'testMerchant',
      password: 'testPassword',
      appKey: 'testAppKey',
      appSecret: 'testAppSecret',
      sandbox: true
    }
  });

  const [generalSettings, setGeneralSettings] = useState({
    defaultCurrency: 'BDT',
    acceptedCurrencies: ['BDT', 'USD', 'EUR'],
    minimumAmount: 10,
    maximumAmount: 100000,
    transactionFee: 2.5,
    taxRate: 15,
    autoRefund: true,
    paymentTimeout: 30,
    saveCards: true,
    requireCvv: true
  });

  const toggleApiKeyVisibility = (gateway, field) => {
    setShowApiKey(prev => ({
      ...prev,
      [`${gateway}_${field}`]: !prev[`${gateway}_${field}`]
    }));
  };

  const handleSettingChange = (gateway, field, value) => {
    setSettings(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  const handleGeneralSettingChange = (field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      alert('Settings saved successfully!');
    }, 1000);
  };

  const testConnection = (gateway) => {
    // Simulate connection test
    setTimeout(() => {
      alert(`${gateway.toUpperCase()} connection test successful!`);
    }, 1500);
  };

  const PaymentGatewayCard = ({ gateway, config, icon: Icon, title, description }) => (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-2xl hover:border-gray-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${config.enabled ? 'from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25' : 'from-gray-600 to-gray-700'}`}>
              <Icon className="w-6 h-6 text-accent-content drop-shadow-sm" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-accent-content">{title}</h3>
              <p className="text-sm text-gray-300">{description}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleSettingChange(gateway, 'enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/25"></div>
          </label>
        </div>

        {config.enabled && (
          <div className="space-y-4 animate-fadeIn">
            {Object.entries(config).map(([key, value]) => {
              if (key === 'enabled' || key === 'currencies') return null;

              const isSecret = key.includes('secret') || key.includes('password') || key.includes('Secret');
              const showKey = showApiKey[`${gateway}_${key}`];

              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="relative">
                    {typeof value === 'boolean' ? (
                      <select
                        value={value.toString()}
                        onChange={(e) => handleSettingChange(gateway, key, e.target.value === 'true')}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <>
                        <input
                          type={isSecret && !showKey ? 'password' : 'text'}
                          value={value}
                          onChange={(e) => handleSettingChange(gateway, key, e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                          placeholder={`Enter ${key}`}
                        />
                        {isSecret && (
                          <button
                            type="button"
                            onClick={() => toggleApiKeyVisibility(gateway, key)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex space-x-2 pt-4">
              <button
                onClick={() => testConnection(gateway)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-accent-content rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Test Connection</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 overflow-hidden">
      <div className="transition-all  duration-500  lg:ml-10 lg:px-9">
        {/* Header */}
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
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-content mb-2">
                  Payment <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span>!
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row space-x-1 bg-gradient-to-r from-gray-800 to-gray-700 p-1 rounded-xl shadow-2xl mb-8 border border-gray-600">
          {[
            { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
            { id: 'general', label: 'General Settings', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'currencies', label: 'Currencies', icon: Globe }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-accent-content shadow-lg shadow-blue-600/25'
                  : 'text-gray-300 hover:text-accent-content hover:bg-gray-600'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'gateways' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PaymentGatewayCard
                gateway="stripe"
                config={settings.stripe}
                icon={CreditCard}
                title="Stripe"
                description="Accept credit cards and digital payments"
              />

              <PaymentGatewayCard
                gateway="paypal"
                config={settings.paypal}
                icon={DollarSign}
                title="PayPal"
                description="PayPal and PayPal Express Checkout"
              />

              <PaymentGatewayCard
                gateway="ssl"
                config={settings.ssl}
                icon={Shield}
                title="SSLCommerz"
                description="Bangladesh's leading payment gateway"
              />

              <PaymentGatewayCard
                gateway="bkash"
                config={settings.bkash}
                icon={Smartphone}
                title="bKash"
                description="Bangladesh's popular mobile payment"
              />

              <PaymentGatewayCard
                gateway="razorpay"
                config={settings.razorpay}
                icon={Wallet}
                title="Razorpay"
                description="India's leading payment gateway"
              />
            </div>
          )}

          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-accent-content mb-4">Transaction Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Default Currency</label>
                    <select
                      value={generalSettings.defaultCurrency}
                      onChange={(e) => handleGeneralSettingChange('defaultCurrency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    >
                      <option value="BDT">BDT - Bangladeshi Taka</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Minimum Amount (BDT)</label>
                    <input
                      type="number"
                      value={generalSettings.minimumAmount}
                      onChange={(e) => handleGeneralSettingChange('minimumAmount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Maximum Amount (BDT)</label>
                    <input
                      type="number"
                      value={generalSettings.maximumAmount}
                      onChange={(e) => handleGeneralSettingChange('maximumAmount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Transaction Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={generalSettings.transactionFee}
                      onChange={(e) => handleGeneralSettingChange('transactionFee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-accent-content mb-4">Payment Options</h3>
                <div className="space-y-4">
                  {[
                    { key: 'autoRefund', label: 'Enable Auto Refunds' },
                    { key: 'saveCards', label: 'Allow Save Cards' },
                    { key: 'requireCvv', label: 'Require CVV' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings[key]}
                          onChange={(e) => handleGeneralSettingChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/25"></div>
                      </label>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Payment Timeout (minutes)</label>
                    <input
                      type="number"
                      value={generalSettings.paymentTimeout}
                      onChange={(e) => handleGeneralSettingChange('paymentTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={generalSettings.taxRate}
                      onChange={(e) => handleGeneralSettingChange('taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-accent-content mb-4">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg border border-green-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-green-300">SSL Certificate Active</span>
                    </div>
                    <p className="text-sm text-green-400 mt-1">Your site is protected with SSL encryption</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-lg border border-blue-700">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-blue-300">PCI DSS Compliant</span>
                    </div>
                    <p className="text-sm text-blue-400 mt-1">Payment data is handled securely</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg border border-yellow-700">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium text-yellow-300">Webhook Security</span>
                    </div>
                    <p className="text-sm text-yellow-400 mt-1">Verify webhook signatures for security</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Webhook Timeout (seconds)</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-accent-content rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'currencies' && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-accent-content mb-4">Supported Currencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['BDT', 'USD', 'EUR', 'GBP', 'JPY', 'CAD'].map((currency) => (
                  <div key={currency} className="flex items-center justify-between p-3 border border-gray-600 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-medium text-accent-content">{currency}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={generalSettings.acceptedCurrencies.includes(currency)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/25"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={saveSettings}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-accent-content px-6 py-3 rounded-full shadow-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 hover:scale-105 border border-green-500 shadow-green-600/25 hover:shadow-green-600/40"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
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
      `}</style>
    </div>
  );
};

export default PaymentSettings;