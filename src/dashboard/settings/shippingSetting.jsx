"use client"
import React, { useState } from 'react';
import { Truck, Package, MapPin, Clock, DollarSign, Plus, Trash2, Edit3, Save, X, Globe, Settings } from 'lucide-react';

const ShippingSettings = () => {
  const [activeTab, setActiveTab] = useState('methods');
  
  const [shippingZones, setShippingZones] = useState([
    {
      id: 1,
      name: 'Dhaka Metro',
      regions: ['Dhaka', 'Gazipur', 'Narayanganj'],
      isActive: true
    },
    {
      id: 2,
      name: 'Bangladesh Nationwide',
      regions: ['All Districts'],
      isActive: true
    }
  ]);

  const [shippingMethods, setShippingMethods] = useState([
    {
      id: 1,
      name: 'Standard Delivery',
      cost: 60,
      estimatedDays: '3-5',
      freeShippingThreshold: 1000,
      isActive: true,
      zones: [1, 2]
    },
    {
      id: 2,
      name: 'Express Delivery',
      cost: 120,
      estimatedDays: '1-2',
      freeShippingThreshold: 2000,
      isActive: true,
      zones: [1]
    }
  ]);

  const [newZone, setNewZone] = useState({ name: '', regions: '', isActive: true });
  const [newMethod, setNewMethod] = useState({
    name: '',
    cost: '',
    estimatedDays: '',
    freeShippingThreshold: '',
    isActive: true,
    zones: []
  });

  const [generalSettings, setGeneralSettings] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: 1000,
    enableShippingCalculator: true,
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    processingTime: '1-2'
  });

  const addShippingZone = () => {
    if (newZone.name && newZone.regions) {
      const zone = {
        id: Date.now(),
        name: newZone.name,
        regions: newZone.regions.split(',').map(r => r.trim()),
        isActive: newZone.isActive
      };
      setShippingZones([...shippingZones, zone]);
      setNewZone({ name: '', regions: '', isActive: true });
    }
  };

  const addShippingMethod = () => {
    if (newMethod.name && newMethod.cost && newMethod.estimatedDays) {
      const method = {
        id: Date.now(),
        ...newMethod,
        cost: parseFloat(newMethod.cost),
        freeShippingThreshold: parseFloat(newMethod.freeShippingThreshold) || 0
      };
      setShippingMethods([...shippingMethods, method]);
      setNewMethod({
        name: '',
        cost: '',
        estimatedDays: '',
        freeShippingThreshold: '',
        isActive: true,
        zones: []
      });
    }
  };

  const deleteZone = (id) => {
    setShippingZones(shippingZones.filter(zone => zone.id !== id));
  };

  const deleteMethod = (id) => {
    setShippingMethods(shippingMethods.filter(method => method.id !== id));
  };

  const toggleZoneStatus = (id) => {
    setShippingZones(shippingZones.map(zone => 
      zone.id === id ? { ...zone, isActive: !zone.isActive } : zone
    ));
  };

  const toggleMethodStatus = (id) => {
    setShippingMethods(shippingMethods.map(method => 
      method.id === id ? { ...method, isActive: !method.isActive } : method
    ));
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const Card = ({ children, className = '' }) => (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 overflow-hidden">
      <div className="transition-all  duration-500  lg:ml-10 lg:px-9">
        {/* Header */}
        <div className="mb-8">
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
                  Shipping <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span>! 
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
             
            </div>
          </div>
        </div>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4">
            <TabButton
              id="methods"
              label="Shipping Methods"
              icon={Package}
              isActive={activeTab === 'methods'}
              onClick={() => setActiveTab('methods')}
            />
            <TabButton
              id="zones"
              label="Shipping Zones"
              icon={MapPin}
              isActive={activeTab === 'zones'}
              onClick={() => setActiveTab('zones')}
            />
            <TabButton
              id="general"
              label="General Settings"
              icon={Settings}
              isActive={activeTab === 'general'}
              onClick={() => setActiveTab('general')}
            />
          </div>
        </div>

        {/* Shipping Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            {/* Add New Method */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Plus className="mr-2" size={20} />
                Add Shipping Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Method Name"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="Cost (৳)"
                  value={newMethod.cost}
                  onChange={(e) => setNewMethod({ ...newMethod, cost: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Estimated Days (e.g., 3-5)"
                  value={newMethod.estimatedDays}
                  onChange={(e) => setNewMethod({ ...newMethod, estimatedDays: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="Free Shipping Threshold (৳)"
                  value={newMethod.freeShippingThreshold}
                  onChange={(e) => setNewMethod({ ...newMethod, freeShippingThreshold: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <select
                  multiple
                  value={newMethod.zones}
                  onChange={(e) => setNewMethod({ ...newMethod, zones: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {shippingZones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
                <button
                  onClick={addShippingMethod}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Method</span>
                </button>
              </div>
            </Card>

            {/* Methods List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shippingMethods.map(method => (
                <Card key={method.id} className="p-6 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${method.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                        <Package className="text-white" size={18} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{method.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {method.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleMethodStatus(method.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          method.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {method.isActive ? <X size={16} className="text-white" /> : <Settings size={16} className="text-white" />}
                      </button>
                      <button
                        onClick={() => deleteMethod(method.id)}
                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        Cost:
                      </span>
                      <span className="text-white font-semibold">৳{method.cost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center">
                        <Clock size={16} className="mr-1" />
                        Delivery:
                      </span>
                      <span className="text-white font-semibold">{method.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center">
                        <Package size={16} className="mr-1" />
                        Free Shipping:
                      </span>
                      <span className="text-white font-semibold">Above ৳{method.freeShippingThreshold}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Zones Tab */}
        {activeTab === 'zones' && (
          <div className="space-y-6">
            {/* Add New Zone */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Plus className="mr-2" size={20} />
                Add Shipping Zone
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Zone Name"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Regions (comma separated)"
                  value={newZone.regions}
                  onChange={(e) => setNewZone({ ...newZone, regions: e.target.value })}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={addShippingZone}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Zone</span>
                </button>
              </div>
            </Card>

            {/* Zones List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingZones.map(zone => (
                <Card key={zone.id} className="p-6 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${zone.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                        <MapPin className="text-white" size={18} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{zone.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleZoneStatus(zone.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          zone.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {zone.isActive ? <X size={16} className="text-white" /> : <Settings size={16} className="text-white" />}
                      </button>
                      <button
                        onClick={() => deleteZone(zone.id)}
                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-gray-300 text-sm">Regions:</span>
                    <div className="flex flex-wrap gap-2">
                      {zone.regions.map((region, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="mr-2" size={20} />
              General Shipping Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Enable Free Shipping</h4>
                    <p className="text-gray-400 text-sm">Allow free shipping for orders above threshold</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.enableFreeShipping}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, enableFreeShipping: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Free Shipping Threshold (৳)</label>
                  <input
                    type="number"
                    value={generalSettings.freeShippingThreshold}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, freeShippingThreshold: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Processing Time (Days)</label>
                  <input
                    type="text"
                    value={generalSettings.processingTime}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, processingTime: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Shipping Calculator</h4>
                    <p className="text-gray-400 text-sm">Enable shipping cost calculator on frontend</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.enableShippingCalculator}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, enableShippingCalculator: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Weight Unit</label>
                  <select
                    value={generalSettings.weightUnit}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, weightUnit: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="lb">Pound (lb)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Dimension Unit</label>
                  <select
                    value={generalSettings.dimensionUnit}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dimensionUnit: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="cm">Centimeter (cm)</option>
                    <option value="m">Meter (m)</option>
                    <option value="in">Inch (in)</option>
                    <option value="ft">Feet (ft)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Save size={18} />
                <span>Save Settings</span>
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShippingSettings;