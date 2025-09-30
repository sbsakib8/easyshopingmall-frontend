"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  CreditCard, 
  Settings, 
  Edit3, 
  Camera, 
  Save,
  ShoppingBag,
  Star,
  Truck,
  Calendar,
  Eye,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { UserGet } from '@/src/hook/useAuth';

const AccountPage = ({ userId }) => {
  console.log("user id", userId);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sakib Hossain',
    email: 'sakibhossain7397@gmail.com',
    phone: '+880 1234567890',
    address: 'House 123, Road 456, Dhanmondi, Dhaka',
    dateOfBirth: '1995-05-15',
    gender: 'Male'
  });

// user dat a display
  useEffect(() => {
  const fetchUser = async () => {
    const user = await UserGet("68cd9334f3296d31f7e2c90c");
    console.log("get user data", user);
  };

  fetchUser();
}, []);


  const [orders] = useState([
    {
      id: '#ORD-001',
      date: '2024-08-25',
      total: '৳2,450',
      status: 'Delivered',
      items: 3,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      id: '#ORD-002',
      date: '2024-08-20',
      total: '৳1,250',
      status: 'Shipped',
      items: 2,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      id: '#ORD-003',
      date: '2024-08-15',
      total: '৳3,750',
      status: 'Processing',
      items: 5,
      image: 'https://via.placeholder.com/60x60'
    }
  ]);

  const [wishlist] = useState([
    {
      id: 1,
      name: 'Premium Headphones',
      price: '৳4,500',
      image: 'https://via.placeholder.com/150x150',
      inStock: true
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: '৳1,200',
      image: 'https://via.placeholder.com/150x150',
      inStock: false
    }
  ]);

  const [addresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: 'House 123, Road 456, Dhanmondi, Dhaka - 1205',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: 'Floor 5, Building ABC, Gulshan, Dhaka - 1212',
      isDefault: false
    }
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Shipped': return 'text-blue-600 bg-blue-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  

  const TabButton = ({ id, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center cursor-pointer space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group ${
        activeTab === id 
          ? 'bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${
        activeTab === id ? 'scale-110' : 'group-hover:scale-110'
      }`} />
      <span className="font-medium">{label}</span>
      {count && (
        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
          activeTab === id ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen lg:mt-24 py-5 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Manage your profile and account settings</p>
        </div>
      </div>

      <div className=" container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Profile Card */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 cursor-pointer bg-gradient-to-r   from-emerald-600 via-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profileData.name.charAt(0)}
                  </div>
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="absolute cursor-pointer -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg mt-4 text-gray-900">{profileData.name}</h3>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 ">
                <TabButton id="profile" icon={User} label="Profile" />
                <TabButton id="orders" icon={Package} label="Orders" count="3" />
                <TabButton id="wishlist" icon={Heart} label="Wishlist" count="2" />
                <TabButton id="addresses" icon={MapPin} label="Addresses" />
                <TabButton id="payments" icon={CreditCard} label="Payment Methods" />
                <TabButton id="settings" icon={Settings} label="Settings" />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Update your personal information</p>
                    </div>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`flex items-center  cursor-pointer space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isEditing 
                          ? 'bg-teal-500 hover:bg-teal-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                          : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      <span className=' hidden md:block'>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${
                            !isEditing ? 'bg-gray-50' : 'bg-white hover:border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${
                            !isEditing ? 'bg-gray-50' : 'bg-white hover:border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${
                            !isEditing ? 'bg-gray-50' : 'bg-white hover:border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${
                            !isEditing ? 'bg-gray-50' : 'bg-white hover:border-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={profileData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          rows="3"
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 resize-none ${
                            !isEditing ? 'bg-gray-50' : 'bg-white hover:border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                    <p className="text-gray-600">Track and manage your orders</p>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div 
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                        style={{
                          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={order.image} 
                              alt="Order" 
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                Order {order.id}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {order.date} • {order.items} items
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="font-bold text-lg text-gray-900">{order.total}</span>
                            <button className="p-2 text-gray-400 cursor-pointer hover:text-teal-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                    <p className="text-gray-600">Items you've saved for later</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item, index) => (
                      <Link
                        href={`/productdetails/${item.id}`} 
                        key={item.id}
                        className="border cursor-pointer border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-blue-300"
                        style={{
                          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full  h-40 object-cover rounded-lg mb-4"
                          />
                          <button className="absolute cursor-pointer top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-blue-600 mb-3">{item.price}</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 cursor-pointer bg-teal-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                            Add to Cart
                          </button>
                          <button className="p-2 border cursor-pointer border-gray-200 rounded-lg hover:border-red-300 hover:text-red-500 transition-all duration-300">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                      <p className="text-gray-600">Manage your delivery addresses</p>
                    </div>
                    <button className="flex items-center cursor-pointer space-x-2 bg-teal-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <div 
                        key={address.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                        style={{
                          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{address.type}</h3>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{address.address}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 cursor-pointer hover:text-teal-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payments' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                      <p className="text-gray-600">Manage your payment options</p>
                    </div>
                    <button className="flex cursor-pointer items-center space-x-2 bg-teal-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                      <Plus className="w-4 h-4" />
                      <span>Add Card</span>
                    </button>
                  </div>

                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods added</h3>
                    <p className="text-gray-500">Add a payment method to make checkout faster</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                    <p className="text-gray-600">Manage your account preferences</p>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'email', label: 'Email notifications', enabled: true },
                          { id: 'sms', label: 'SMS notifications', enabled: false },
                          { id: 'push', label: 'Push notifications', enabled: true }
                        ].map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between">
                            <span className="text-gray-700">{setting.label}</span>
                            <button
                              className={`w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${
                                setting.enabled ? 'bg-teal-500' : 'bg-gray-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                setting.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                          Change Password
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                          Two-Factor Authentication
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                          Login History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AccountPage;