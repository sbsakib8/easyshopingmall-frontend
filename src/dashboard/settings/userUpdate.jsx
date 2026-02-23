"use client";
import React, { useState, useEffect } from 'react';
import { Search, Shield, Trash2, Edit, X, Save, User, Mail, Phone, Calendar, Check, AlertCircle, UserCog, RefreshCw, Image as ImageIcon, Key, Clock } from 'lucide-react';
import { useGetallUsers } from '@/src/utlis/useGetAllUser';
import { deleteUser, updateUserProfile } from '@/src/hook/useAuth';
export default function UserRoleManager() {
  // Get all users
  const { allusers, loading: fetchLoading, error, refetch } = useGetallUsers();

  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (allusers && allusers.length > 0) {
      setUsers(allusers);
      // Show only first 5 users initially
      setDisplayedUsers(allusers.slice(0, 5));
    }
  }, [allusers]);

  const roles = [
    { value: 'USER', label: 'User', color: 'bg-blue-500', icon: '👤' },
    { value: 'DROPSHIPPING', label: 'Dropshipping', color: 'bg-blue-500', icon: '📦' },
    { value: 'ADMIN', label: 'Admin', color: 'bg-red-500', icon: '👑' }
  ];

  const statuses = [
    { value: 'Active', label: 'Active', color: 'bg-green-500' },
    { value: 'Inactive', label: 'Inactive', color: 'bg-yellow-500' },
    { value: 'Blocked', label: 'Blocked', color: 'bg-red-500' }
  ];

  const customerStatuses = [
    { value: 'NewCustomer', label: 'New Customer' },
    { value: 'TopCustomer', label: 'Top Customer' },
    { value: 'ReturningCustomer', label: 'Returning Customer' },
    { value: 'VIPCustomer', label: 'VIP Customer' },
    { value: 'WholesaleCustomer', label: 'Wholesale Customer' },
    { value: 'Reseller', label: 'Reseller' },
    { value: '3starCustomer', label: '3 Star Customer' },
    { value: '4starCustomer', label: '4 Star Customer' },
    { value: '5starCustomer', label: '5 Star Customer' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle search with dynamic display
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // No search - show first 5 users
      setDisplayedUsers(users.slice(0, 5));
      setHasSearched(false);
    } else {
      // Search active - show all matching users
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => {
        return (
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          (user.mobile && user.mobile.includes(term)) ||
          user._id?.toString().includes(term) ||
          user.role?.toLowerCase().includes(term) ||
          user.status?.toLowerCase().includes(term) ||
          user.customerstatus?.toLowerCase().includes(term)
        );
      });
      setDisplayedUsers(filtered);
      setHasSearched(true);
    }
  }, [searchTerm, users]);

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      last_login_date: user.last_login_date ? new Date(user.last_login_date).toISOString().split('T')[0] : '',
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      showNotification('Name and Email are required!', 'error');
      return;
    }

    setUpdateLoading(true);
    try {
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        mobile: editingUser.mobile || null,
        image: editingUser.image || null,
        verify_email: editingUser.verify_email,
        status: editingUser.status,
        customerstatus: editingUser.customerstatus,
        role: editingUser.role,
        last_login_date: editingUser.last_login_date || null
      };

      // Call API to update user
      await updateUserProfile(editingUser._id, updateData);

      // Update local state
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...updateData } : u));

      showNotification('User updated successfully!', 'success');
      setShowModal(false);
      setEditingUser(null);

      // Refetch to ensure data is in sync
      refetch();
    } catch (error) {
      console.error('Update error:', error);
      showNotification(error.response?.data?.message || 'Failed to update user!', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await deleteUser(userId);

      if (res.success) {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
        showNotification("User deleted successfully!", "success");
      } else {
        showNotification(res.message || "Failed to delete user!", "error");
      }
    } catch (error) {
      console.error("Delete user failed:", error);
      showNotification("Failed to delete user!", "error");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserProfile(userId, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      showNotification(`Role changed to ${newRole}!`, 'success');
      refetch();
    } catch (error) {
      showNotification('Failed to change role!', 'error');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserProfile(userId, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      showNotification(`Status changed to ${newStatus}!`, 'success');
      refetch();
    } catch (error) {
      showNotification('Failed to change status!', 'error');
    }
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-500';
  };

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.icon : '👤';
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-500';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-accent-content text-xl">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-accent-content text-xl">Error loading users</p>
          <button
            onClick={refetch}
            className="mt-4 bg-purple-500 text-accent-content px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-accent-content px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in backdrop-blur-sm`}>
          {notification.type === 'success' ?
            <Check className="w-6 h-6" /> :
            <AlertCircle className="w-6 h-6" />
          }
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <UserCog className="w-8 h-8 text-accent-content" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-accent-content">User Management</h1>
                  <p className="text-gray-400 mt-1">Manage users, roles and permissions</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-3 rounded-xl">
                <p className="text-accent-content text-sm font-medium">Total Users</p>
                <p className="text-accent-content text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 px-6 py-3 rounded-xl">
                <p className="text-accent-content text-sm font-medium">Active</p>
                <p className="text-accent-content text-3xl font-bold">{users.filter(u => u.status === 'Active').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, mobile, ID, role or status..."
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-accent-content placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-content transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400 text-sm">
              {hasSearched ? (
                <>Found {displayedUsers.length} user{displayedUsers.length !== 1 ? 's' : ''}</>
              ) : (
                <>Showing {displayedUsers.length} of {users.length} users (search to see all)</>
              )}
            </p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUsers?.map((user) => (
            <div
              key={user?._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/20"
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${getRoleColor(user?.role)} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {user?.image ? (
                      <img src={user?.image} alt={user?.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      getRoleIcon(user?.role)
                    )}
                  </div>
                  <div>
                    <h3 className="text-accent-content font-bold text-lg">{user?.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user?.status)} text-accent-content`}>
                        {user?.status}
                      </span>
                      {user?.verify_email && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.mobile && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span>{user?.mobile}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Last Login: {formatDate(user?.last_login_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Joined: {formatDate(user?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="truncate">ID: {user?._id}</span>
                </div>
              </div>

              {/* Role Selector */}
              <div className="mb-3">
                <label className="block text-gray-400 text-xs font-medium mb-2">Change Role</label>
                <select
                  value={user?.role}
                  onChange={(e) => handleRoleChange(user?._id, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-accent-content text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role?.value} value={role?.value}>
                      {role?.icon} {role?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div className="mb-4">
                <label className="block text-gray-400 text-xs font-medium mb-2">Change Status</label>
                <select
                  value={user?.status}
                  onChange={(e) => handleStatusChange(user?._id, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-accent-content text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status?.value} value={status?.value}>
                      {status?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-accent-content py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user?._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-accent-content py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayedUsers.length === 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-12 text-center border border-gray-700">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-accent-content" />
            </div>
            <h3 className="text-accent-content text-xl font-bold mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gradient-to-br from-gray-800 to-gray-900 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Edit className="w-6 h-6 text-accent-content" />
                </div>
                <h2 className="text-2xl font-bold text-accent-content">Edit User</h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-accent-content transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingUser?.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingUser?.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Mobile Number</label>
                  <input
                    type="text"
                    value={editingUser?.mobile || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={editingUser?.image || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Customer Status</label>
                  <select
                    value={editingUser.customerstatus}
                    onChange={(e) => setEditingUser({ ...editingUser, customerstatus: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {customerStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.verify_email}
                      onChange={(e) => setEditingUser({ ...editingUser, verify_email: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm font-medium">Email Verified</span>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Last Login Date</label>
                  <input
                    type="date"
                    value={editingUser.last_login_date}
                    onChange={(e) => setEditingUser({ ...editingUser, last_login_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">User ID</label>
                  <input
                    type="text"
                    value={editingUser._id}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <h3 className="text-accent-content font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Account Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Addresses</p>
                    <p className="text-accent-content text-xl font-bold">{editingUser.address_details?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Cart Items</p>
                    <p className="text-accent-content text-xl font-bold">{editingUser.shopping_cart?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Orders</p>
                    <p className="text-accent-content text-xl font-bold">{editingUser.orderHistory?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-700 sticky bottom-0 bg-gradient-to-br from-gray-800 to-gray-900">
              <button
                onClick={handleUpdateUser}
                disabled={updateLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-accent-content py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {updateLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update User
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                }}
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}