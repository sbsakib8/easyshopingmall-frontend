"use client"
import { useState, useRef } from "react"
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Eye,
  Download,
  ImageIcon,
  Video,
  FileText,
  Music,
  X,
  Plus,
  User,
  Tag,
} from "lucide-react"

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      name: "product-hero.jpg",
      type: "image",
      size: "2.4 MB",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      uploadDate: "2024-09-01",
      tags: ["product", "hero", "banner"],
      uploader: "Admin",
    },
    {
      id: 2,
      name: "category-fashion.jpg",
      type: "image",
      size: "1.8 MB",
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
      uploadDate: "2024-09-02",
      tags: ["fashion", "category"],
      uploader: "Editor",
    },
    {
      id: 3,
      name: "product-demo.mp4",
      type: "video",
      size: "15.2 MB",
      url: "https://via.placeholder.com/400x300/667eea/ffffff?text=Video",
      uploadDate: "2024-09-03",
      tags: ["product", "demo", "video"],
      uploader: "Marketing",
    },
    {
      id: 4,
      name: "brand-guide.pdf",
      type: "document",
      size: "3.7 MB",
      url: "https://via.placeholder.com/400x300/f093fb/ffffff?text=PDF",
      uploadDate: "2024-08-30",
      tags: ["brand", "guide", "document"],
      uploader: "Design Team",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const fileTypes = {
    image: {
      icon: ImageIcon,
      color: "text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    },
    video: { icon: Video, color: "text-blue-400", bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20" },
    document: { icon: FileText, color: "text-rose-400", bgColor: "bg-gradient-to-br from-rose-500/20 to-pink-500/20" },
    audio: { icon: Music, color: "text-purple-400", bgColor: "bg-gradient-to-br from-purple-500/20 to-violet-500/20" },
  }

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || file.type === selectedType
    return matchesSearch && matchesType
  })

  const handleFileUpload = (files) => {
    Array.from(files).forEach((file, index) => {
      const newFile = {
        id: Date.now() + index,
        name: file.name,
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "document",
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split("T")[0],
        tags: ["new"],
        uploader: "Current User",
      }
      setMediaFiles((prev) => [newFile, ...prev])
    })
    setShowUploadModal(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const deleteSelectedFiles = () => {
    setMediaFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const FileCard = ({ file }) => {
    const FileIcon = fileTypes[file.type]?.icon || FileText
    const isSelected = selectedFiles.includes(file.id)

    return (
      <div
        className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
          isSelected ? "border-cyan-400/50 ring-2 ring-cyan-400/30" : "border-gray-700/50 hover:border-gray-600/50"
        } transform hover:scale-105`}
        onClick={() => toggleFileSelection(file.id)}
      >
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-700/30 to-gray-800/30">
          {file.type === "image" ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div
              className={`flex items-center justify-center h-full ${fileTypes[file.type]?.bgColor || "bg-gradient-to-br from-gray-600/20 to-gray-700/20"}`}
            >
              <FileIcon className={`w-16 h-16 ${fileTypes[file.type]?.color || "text-gray-400"}`} />
            </div>
          )}

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <button className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors">
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {isSelected && (
            <div className="absolute top-2 left-2 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white truncate mb-1">{file.name}</h3>
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>{file.size}</span>
            <span>{file.uploadDate}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {file.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
              >
                {tag}
              </span>
            ))}
            {file.tags.length > 2 && (
              <span className="px-2 py-1 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 text-xs rounded-full border border-gray-600/30">
                +{file.tags.length - 2}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <User className="w-3 h-3 mr-1" />
            {file.uploader}
          </div>
        </div>
      </div>
    )
  }

  const ListView = ({ file }) => {
    const FileIcon = fileTypes[file.type]?.icon || FileText
    const isSelected = selectedFiles.includes(file.id)

    return (
      <div
        className={`flex items-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border ${
          isSelected
            ? "border-cyan-400/50 bg-gradient-to-r from-cyan-900/20 to-blue-900/20"
            : "border-gray-700/50 hover:border-gray-600/50"
        }`}
        onClick={() => toggleFileSelection(file.id)}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${fileTypes[file.type]?.bgColor || "bg-gradient-to-br from-gray-600/20 to-gray-700/20"} mr-4`}
        >
          {file.type === "image" ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FileIcon className={`w-6 h-6 ${fileTypes[file.type]?.color || "text-gray-400"}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{file.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
            <span>{file.size}</span>
            <span>{file.uploadDate}</span>
            <span>{file.uploader}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {file.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-1 ml-4">
            <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
              <Eye className="w-4 h-4 text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
              <Download className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Media Library
              </h1>
              <p className="text-gray-400 mt-1">Manage your media files and assets</p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                <ImageIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{mediaFiles.filter((f) => f.type === "image").length}</p>
                <p className="text-gray-300 text-sm">Images</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{mediaFiles.filter((f) => f.type === "video").length}</p>
                <p className="text-gray-300 text-sm">Videos</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-rose-500/20 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-rose-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {mediaFiles.filter((f) => f.type === "document").length}
                </p>
                <p className="text-gray-300 text-sm">Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg">
                <Tag className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{mediaFiles.length}</p>
                <p className="text-gray-300 text-sm">Total Files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="audio">Audio</option>
              </select>

              <div className="flex border border-gray-600/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between">
              <span className="text-cyan-300 font-medium">{selectedFiles.length} files selected</span>
              <button
                onClick={deleteSelectedFiles}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* File Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <ListView key={file.id} file={file} />
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl transform transition-all duration-200 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Files</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragOver
                  ? "border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                  : "border-gray-600 hover:border-gray-500 bg-gradient-to-br from-gray-700/20 to-gray-800/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? "text-cyan-400" : "text-gray-400"}`} />
              <h3 className="text-lg font-medium text-white mb-2">Drag and drop files here</h3>
              <p className="text-gray-400 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <p className="text-sm text-gray-400 mt-4">Supports: Images, Videos, Audio, Documents</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaLibrary
