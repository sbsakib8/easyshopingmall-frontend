"use client"

import { CenterBannerCreate, CenterBannerDelete, CenterBannerUploade } from "@/src/hook/useCernterBanner"
import { useGetCenterBanner } from "@/src/utlis/banner/useCenterBanner"
import { Trash2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

const CenterBanner = () => {

  const { ads, loading, error } = useGetCenterBanner();
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    if (ads) {
      if (Array.isArray(ads)) {
        setBanners(ads);
      } else {
        setBanners([ads]);
      }
    }
  }, [ads]);


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    images: "",
    link: "",
    Description: "",
    status: "active",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const bannersPerPage = 6
  const fileInputRef = useRef(null)

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.Description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || banner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage)
  const startIndex = (currentPage - 1) * bannersPerPage
  const currentBanners = filteredBanners.slice(startIndex, startIndex + bannersPerPage)

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        images: banner.images,
        link: banner.link,
        Description: banner.Description,
        status: banner.status,
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: "",
        images: "",
        link: "",
        Description: "",
        status: "active",
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
  }

  // Create or Update Banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("Description", formData.Description);
      data.append("Link_URL", formData.link);
      data.append("status", formData.status);
      if (formData.images) data.append("images", formData.images);

      let res;

      if (editingBanner) {
        res = await CenterBannerUploade(data, editingBanner._id || editingBanner.id);

        setBanners((prev) =>
          prev.map((banner) =>
            banner._id === editingBanner._id || banner.id === editingBanner.id
              ? { ...banner, ...formData }
              : banner
          )
        );
        refetch();
        toast.success("✅ Banner updated successfully!");
      } else {
        res = await CenterBannerCreate(data);

        const newBanner = {
          id: res?.data?._id || Date.now(),
          ...res?.data || formData,
          createdAt: new Date().toISOString().split("T")[0],
        };

        setBanners((prev) => [newBanner, ...prev]);
        refetch();
        toast.success("✅ Banner Create successfully!");
      }


      closeModal();
    } catch (error) {
      console.error("CenterBanner save error:", error);
      toast.error("Something went wrong while saving the banner!");
    }
  };


  // delete banner
  const handleDelete = (id) => {
    setDeleteModal(id);
  };
  //  confirm delete
  const deleteBanner = async () => {
    try {
      if (!deleteModal) return;
      await CenterBannerDelete(deleteModal);
      setDeleteModal(null);
      refetch();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };




  // Toggle All Status
  const toggleAllStatus = async () => {
    try {
      const hasActive = banners.some((b) => b.status === "active");
      const newStatus = hasActive ? "inactive" : "active";
      setBanners((prev) =>
        prev.map((banner) => ({
          ...banner,
          status: newStatus,
        }))
      );
      await Promise.allSettled(
        banners
          .filter((b) => b._id)
          .map(async (banner) => {
            const data = new FormData();
            data.append("status", newStatus);
            await CenterBannerUploade(data, banner._id);
          })
      );
      toast.success(`All banners are now ${newStatus}!`);
    } catch (error) {
      console.error("Error toggling all statuses:", error);
      toast.error("Something went wrong while updating statuses!");
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black  relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Center Banner Management
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-light">
                Create stunning promotional banners with advanced controls
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={toggleAllStatus}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-accent-content px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
              >
                Toggle All Status
              </button>
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-accent-content px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 animate-pulse"
              >
                ✨ Create New Banner
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Banners</p>
                  <p className="text-3xl font-bold text-accent-content mt-1">{banners.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Active Banners</p>
                  <p className="text-3xl font-bold text-accent-content mt-1">
                    {banners.filter((b) => b.status === "active").length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Inactive Banners</p>
                  <p className="text-3xl font-bold text-accent-content mt-1">
                    {banners.filter((b) => b.status === "inactive").length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>


          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentBanners.map((banner, index) => (
            <div
              key={banner.id}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:from-gray-700/60 hover:to-gray-800/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={banner.images || "/placeholder.svg?height=200&width=400&query=banner"}
                  alt={banner.title}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${banner.status === "active"
                      ? "bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-accent-content border border-emerald-400/50"
                      : "bg-gradient-to-r from-red-500/80 to-pink-500/80 text-accent-content border border-red-400/50"
                    }`}
                >
                  {banner.status.toUpperCase()}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-accent-content mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {banner.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{banner.Description}</p>
                <p className="text-sm text-gray-400 mb-6 font-medium">Created: {banner.createdAt}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => openModal(banner)}
                    className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 text-blue-300 border border-blue-500/30 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/40 hover:to-pink-500/40 text-red-300 border border-red-500/30 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl text-accent-content hover:from-gray-600/60 hover:to-gray-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${currentPage === page
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-accent-content shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-accent-content hover:from-gray-600/60 hover:to-gray-700/60"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl text-accent-content hover:from-gray-600/60 hover:to-gray-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              Next →
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8 border-b border-gray-700/50">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {editingBanner ? "✏️ Edit Banner" : "✨ Create New Banner"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Banner Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    placeholder="Enter banner title"

                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Banner Images</label>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="images/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3 font-semibold"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      📸 Upload Images
                    </button>
                    {formData.images && (
                      <div className="relative">
                        <img
                          src={formData.images || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl border border-gray-700/50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Link URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    placeholder="https://example.com"

                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Description</label>
                  <textarea
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
                    placeholder="Enter banner Description"

                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-600/50 to-gray-700/50 border border-gray-600/50 text-gray-200 rounded-xl font-semibold hover:from-gray-500/60 hover:to-gray-600/60 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-accent-content rounded-xl font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    {editingBanner ? "💾 Update Banner" : "✨ Create Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-full">
                <Trash2 className="w-8 h-8 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-accent-content">Delete Product</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={deleteBanner}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-accent-content font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-accent-content font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CenterBanner
