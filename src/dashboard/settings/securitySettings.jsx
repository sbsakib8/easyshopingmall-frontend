"use client"
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Key, Smartphone, Users, Activity, AlertTriangle, Check, X, Settings, Globe, Clock } from 'lucide-react';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: true,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipRestriction: false,
    suspiciousActivity: true,
    dataEncryption: true,
    auditLogs: true,
    adminApproval: false,
    apiSecurity: true
  });

  const [activeTab, setActiveTab] = useState('authentication');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const tabs = [
    { id: 'authentication', label: 'Authentication', icon: Lock },
    { id: 'access', label: 'Access Control', icon: Users },
    { id: 'monitoring', label: 'Security Monitoring', icon: Activity },
    { id: 'api', label: 'API Security', icon: Globe }
  ];

  const recentActivities = [
    { action: 'Login from new device', ip: '192.168.1.105', time: '2 minutes ago', status: 'success' },
    { action: 'Password changed', ip: '192.168.1.105', time: '1 hour ago', status: 'success' },
    { action: 'Failed login attempt', ip: '45.123.45.67', time: '3 hours ago', status: 'warning' },
    { action: 'API key regenerated', ip: '192.168.1.105', time: '1 day ago', status: 'success' }
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex-1">
        <h3 className="text-accent-content font-medium">{label}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${checked
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25'
            : 'bg-gray-600'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  const renderAuthenticationTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-accent-content mb-4 flex items-center">
          <Key className="mr-2 h-5 w-5 text-purple-400" />
          Password Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-accent-content placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-accent-content placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-accent-content placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm new password"
            />
          </div>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-accent-content px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Update Password
          </button>
        </div>
      </div>

      <ToggleSwitch
        checked={settings.twoFactor}
        onChange={(value) => handleSettingChange('twoFactor', value)}
        label="Two-Factor Authentication"
        description="Add an extra layer of security with 2FA using SMS or authenticator app"
      />

      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/50">
        <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
        <select
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-accent-content focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/50">
        <label className="block text-sm font-medium text-gray-300 mb-2">Password Expiry (days)</label>
        <select
          value={settings.passwordExpiry}
          onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-accent-content focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        >
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
          <option value={180}>180 days</option>
        </select>
      </div>
    </div>
  );

  const renderAccessTab = () => (
    <div className="space-y-6">
      <ToggleSwitch
        checked={settings.ipRestriction}
        onChange={(value) => handleSettingChange('ipRestriction', value)}
        label="IP Address Restriction"
        description="Only allow access from specific IP addresses"
      />

      <ToggleSwitch
        checked={settings.adminApproval}
        onChange={(value) => handleSettingChange('adminApproval', value)}
        label="Admin Approval Required"
        description="Require admin approval for new user registrations"
      />

      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-accent-content mb-4">Allowed IP Addresses</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">192.168.1.0/24</span>
            <button className="text-red-400 hover:text-red-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">10.0.0.0/8</span>
            <button className="text-red-400 hover:text-red-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-accent-content px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
          Add IP Range
        </button>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <ToggleSwitch
        checked={settings.loginNotifications}
        onChange={(value) => handleSettingChange('loginNotifications', value)}
        label="Login Notifications"
        description="Get notified about new login attempts via email"
      />

      <ToggleSwitch
        checked={settings.suspiciousActivity}
        onChange={(value) => handleSettingChange('suspiciousActivity', value)}
        label="Suspicious Activity Monitoring"
        description="Monitor and alert on unusual account activity"
      />

      <ToggleSwitch
        checked={settings.auditLogs}
        onChange={(value) => handleSettingChange('auditLogs', value)}
        label="Audit Logging"
        description="Keep detailed logs of all administrative actions"
      />

      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-accent-content mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-400" />
          Recent Security Activities
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
              <div>
                <p className="text-accent-content font-medium">{activity.action}</p>
                <p className="text-gray-400 text-sm">IP: {activity.ip} • {activity.time}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <ToggleSwitch
        checked={settings.apiSecurity}
        onChange={(value) => handleSettingChange('apiSecurity', value)}
        label="API Rate Limiting"
        description="Limit the number of API requests per minute"
      />

      <ToggleSwitch
        checked={settings.dataEncryption}
        onChange={(value) => handleSettingChange('dataEncryption', value)}
        label="Data Encryption"
        description="Encrypt all API data transmissions"
      />

      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-accent-content mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <p className="text-accent-content font-medium">Production API Key</p>
              <p className="text-gray-400 text-sm font-mono">
                {showApiKey ? 'pk_live_51H7x2cF...' : '••••••••••••••••••••'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-gray-400 hover:text-accent-content transition-colors"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-accent-content px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Regenerate
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <p className="text-accent-content font-medium">Test API Key</p>
              <p className="text-gray-400 text-sm font-mono">pk_test_51H7x2cF...</p>
            </div>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-accent-content px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6 overflow-hidden">
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
                  Security <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span>!
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Check className="h-8 w-8 text-green-400" />
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">Active</span>
            </div>
            <h3 className="text-accent-content font-semibold mb-2">Security Status</h3>
            <p className="text-gray-400 text-sm">All security measures are active and functioning properly</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Smartphone className="h-8 w-8 text-blue-400" />
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">2FA</span>
            </div>
            <h3 className="text-accent-content font-semibold mb-2">Two-Factor Auth</h3>
            <p className="text-gray-400 text-sm">Additional layer of security enabled</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">3 Alerts</span>
            </div>
            <h3 className="text-accent-content font-semibold mb-2">Security Alerts</h3>
            <p className="text-gray-400 text-sm">Recent security notifications require attention</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          {/* Tabs */}
          <div className="border-b border-gray-700/50">
            <nav className="flex flex-col lg:flex-row space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'authentication' && renderAuthenticationTab()}
            {activeTab === 'access' && renderAccessTab()}
            {activeTab === 'monitoring' && renderMonitoringTab()}
            {activeTab === 'api' && renderApiTab()}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-accent-content px-8 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/25 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;