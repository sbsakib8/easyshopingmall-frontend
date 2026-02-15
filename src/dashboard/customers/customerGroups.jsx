"use client"

import { useState, useEffect } from "react"



const CustomerGroups = () => {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })

  // Sample data
  useEffect(() => {
    const sampleGroups = [
      {
        id: "1",
        name: "VIP Customers",
        description: "High-value customers with premium benefits",
        color: "#F59E0B",
        createdAt: "2024-01-15",
        totalCustomers: 45,
        totalRevenue: 125000,
        customers: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            totalOrders: 25,
            totalSpent: 5000,
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+1234567891",
            totalOrders: 18,
            totalSpent: 3500,
          },
        ],
      },
      {
        id: "2",
        name: "Regular Customers",
        description: "Standard customer group with regular benefits",
        color: "#10B981",
        createdAt: "2024-01-10",
        totalCustomers: 128,
        totalRevenue: 85000,
        customers: [
          {
            id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "+1234567892",
            totalOrders: 8,
            totalSpent: 1200,
          },
        ],
      },
      {
        id: "3",
        name: "New Customers",
        description: "Recently joined customers",
        color: "#8B5CF6",
        createdAt: "2024-02-01",
        totalCustomers: 67,
        totalRevenue: 15000,
        customers: [],
      },
    ]
    setGroups(sampleGroups)
  }, [])

  const filteredGroups = groups
    .filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "high-revenue") return matchesSearch && group.totalRevenue > 50000
      if (filterBy === "large-groups") return matchesSearch && group.totalCustomers > 50
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "customers") return b.totalCustomers - a.totalCustomers
      if (sortBy === "revenue") return b.totalRevenue - a.totalRevenue
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return

    const group = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      color: newGroup.color,
      customers: [],
      createdAt: new Date().toISOString().split("T")[0],
      totalCustomers: 0,
      totalRevenue: 0,
    }

    setGroups([...groups, group])
    setNewGroup({ name: "", description: "", color: "#3B82F6" })
    setIsCreateModalOpen(false)
  }

  const handleEditGroup = () => {
    if (!selectedGroup || !newGroup.name.trim()) return

    setGroups(
      groups.map((group) =>
        group.id === selectedGroup.id
          ? { ...group, name: newGroup.name, description: newGroup.description, color: newGroup.color }
          : group,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedGroup(null)
  }

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter((group) => group.id !== groupId))
  }

  const openEditModal = (group) => {
    setSelectedGroup(group)
    setNewGroup({
      name: group.name,
      description: group.description,
      color: group.color,
    })
    setIsEditModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 overflow-hidden">
      <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
              Customer Groups
            </h1>
            <p className="text-gray-400 text-lg">Manage and organize your customers into groups</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/50 rounded-xl px-4 py-3 text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/50 rounded-xl px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          >
            <option className="bg-gray-700" value="all">All Groups</option>
            <option className="bg-gray-700" value="high-revenue">High Revenue</option>
            <option className="bg-gray-700" value="large-groups">Large Groups</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/50 rounded-xl px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          >
            <option className="bg-gray-700" value="name">Sort by Name</option>
            <option className="bg-gray-700" value="customers">Sort by Customers</option>
            <option className="bg-gray-700" value="revenue">Sort by Revenue</option>
            <option className="bg-gray-700" value="date">Sort by Date</option>
          </select>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-accent-content px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            + Create Group
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Groups</p>
                <p className="text-3xl font-bold text-accent-content">{groups.length}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-accent-content">
                  {groups.reduce((sum, group) => sum + group.totalCustomers, 0)}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-accent-content">
                  ${groups.reduce((sum, group) => sum + group.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50 group"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }}></div>
                  <h3 className="text-xl font-bold text-accent-content group-hover:text-gray-200 transition-colors">
                    {group.name}
                  </h3>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(group)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{group.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Customers</p>
                  <p className="text-accent-content font-bold text-lg">{group.totalCustomers}</p>
                </div>
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Revenue</p>
                  <p className="text-accent-content font-bold text-lg">${group.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created: {group.createdAt}</span>
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <h2 className="text-2xl font-bold text-accent-content mb-6">Create New Group</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    placeholder="Enter group description"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    value={newGroup.color}
                    onChange={(e) => setNewGroup({ ...newGroup, color: e.target.value })}
                    className="w-full h-12 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-accent-content py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-accent-content py-3 rounded-lg font-medium transition-all"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <h2 className="text-2xl font-bold text-accent-content mb-6">Edit Group</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    value={newGroup.color}
                    onChange={(e) => setNewGroup({ ...newGroup, color: e.target.value })}
                    className="w-full h-12 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-accent-content py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditGroup}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-accent-content py-3 rounded-lg font-medium transition-all"
                >
                  Update Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Details Modal */}
        {selectedGroup && !isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedGroup.color }}></div>
                  <h2 className="text-3xl font-bold text-accent-content">{selectedGroup.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-400 mb-6">{selectedGroup.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl p-4">
                  <p className="text-blue-300 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-accent-content">{selectedGroup.totalCustomers}</p>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-xl p-4">
                  <p className="text-green-300 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-accent-content">${selectedGroup.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-xl p-4">
                  <p className="text-purple-300 text-sm">Created</p>
                  <p className="text-2xl font-bold text-accent-content">{selectedGroup.createdAt}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-accent-content mb-4">Customers in this group</h3>

              {selectedGroup.customers.length > 0 ? (
                <div className="space-y-3">
                  {selectedGroup.customers.map((customer) => (
                    <div key={customer.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-accent-content font-medium">{customer.name}</h4>
                        <p className="text-gray-400 text-sm">{customer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-content font-medium">{customer.totalOrders} orders</p>
                        <p className="text-gray-400 text-sm">${customer.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-400">No customers in this group yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CustomerGroups