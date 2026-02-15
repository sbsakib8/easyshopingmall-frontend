"use client"

import { HomeBannerCreate, HomeBannerDelete, HomeBannerUploade } from "@/src/hook/useHomeBanner"
import { useGetHomeBanner } from "@/src/utlis/useHomeBanner"
import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

const HomeSliderPage = () => {

  const { homebanner, loading, error, refetch } = useGetHomeBanner();
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    if (homebanner) {
      if (Array.isArray(homebanner)) {
        setSliders(homebanner);
      } else {
        setSliders([homebanner]);
      }
    }
  }, [homebanner]);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    Description: "",
    images: "",
    linkUrl: "",
  })

  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };

  const handleAddSlider = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("Description", formData.Description);
      data.append("Link_URL", formData.linkUrl);
      data.append("active", true);

      if (formData.images) {
        data.append("images", formData.images);
      }

      const res = await HomeBannerCreate(data);

      const newSlider = {
        id: res?.data?._id || Date.now().toString(),
        title: res?.data?.title || formData.title,
        Description: res?.data?.Description || formData.Description,
        images: res?.data?.images || [],
        linkUrl: res?.data?.Link_URL || formData.linkUrl,
        active: res?.data?.active ?? true,
      };

      setSliders((prev) => [...prev, newSlider]);

      setFormData({
        title: "",
        Description: "",
        images: "",
        linkUrl: "",
      });

      setIsAddDialogOpen(false);
      toast.success("Home banner added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add home banner");
    }
  };

  const handleEditSlider = (slider) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      Description: slider.Description,
      images: slider.images,
      linkUrl: slider.linkUrl,
    })
  }

  // update slider
  const handleUpdateSlider = async () => {
    if (!editingSlider) return;

    try {
      const updatedData = new FormData();
      updatedData.append("title", formData.title || "");
      updatedData.append("Description", formData.Description || "");
      updatedData.append("Link_URL", formData.linkUrl || "");
      updatedData.append("active", editingSlider.active ?? true);

      if (formData.images instanceof File) {
        updatedData.append("images", formData.images);
      }

      await HomeBannerUploade(updatedData, editingSlider._id);

      setSliders((prev) =>
        prev.map((slider) =>
          slider._id === editingSlider._id ? { ...slider, ...formData } : slider
        )
      );

      setEditingSlider(null);
      setFormData({
        title: "",
        Description: "",
        images: "",
        linkUrl: "",
      });

      if (typeof refetch === "function") refetch();

      toast.success("Home banner updated successfully!");
    } catch (error) {
      console.error("Update slider error:", error);
      toast.error("Failed to update banner");
    }
  };

  // delete slider
  const handleDeleteSlider = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this banner?");
    if (!confirmDelete) return;

    try {
      await HomeBannerDelete(id);

      setSliders((prev) => prev.filter((slider) => slider?._id !== id));

      if (typeof refetch === "function") refetch();

      toast.success("Home banner deleted successfully!");
    } catch (error) {
      console.error("Delete banner error:", error);
      toast.error("Failed to delete banner");
    }
  };


  // update slider active status

  const toggleSliderStatus = async (id) => {
    setSliders((prev) =>
      prev.map((slider) =>
        slider._id === id ? { ...slider, active: !slider.active } : slider
      )
    );

    try {
      const targetBanner = sliders.find((slider) => slider._id === id);
      if (!targetBanner) return;

      const updatedActive = !targetBanner.active;

      const formData = new FormData();
      formData.append("active", updatedActive);

      await HomeBannerUploade(formData, id);

      refetch();

    } catch (error) {
      toast.error("❌ Toggle slider status error:", error);
    }
  };


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <header className="border-b border-gray-800/50 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                {sliders?.filter((s) => s?.active).length} Active Sliders
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 text-balance">
            Home Slider Management
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto text-pretty">
            Create and manage beautiful sliders for your homepage with stunning animations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="animate-fade-in-left">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-accent-content">Live Preview</h3>
              </div>

              {sliders?.length > 0 ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-800 shadow-xl">
                  <div className="aspect-[2/1] relative group">
                    <img
                      src={
                        sliders[currentSlide]?.images || "/placeholder.svg?height=400&width=800&query=slider preview"
                      }
                      alt={sliders[currentSlide]?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-accent-content transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                      <h4 className="text-2xl font-bold mb-3 text-balance">{sliders[currentSlide]?.title}</h4>
                      <p className="text-gray-200 text-lg opacity-90 text-pretty">
                        {sliders[currentSlide]?.Description}
                      </p>
                    </div>
                  </div>

                  {sliders?.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        onClick={prevSlide}
                      >
                        <svg className="w-6 h-6 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        onClick={nextSlide}
                      >
                        <svg className="w-6 h-6 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                    {sliders.map((banner, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                          }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-[2/1] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-dashed border-gray-700">
                  <div className="text-center">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-400 text-lg">No sliders added yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="animate-fade-in-right">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-2xl font-bold text-accent-content">Add New Slider</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Enter slider title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Enter slider description"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Image</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Image URL or upload"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-accent-content rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Link URL</label>
                    <input
                      type="text"
                      placeholder="/collections/sale"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                </div>

                <button
                  onClick={handleAddSlider}
                  disabled={!formData.title || !formData.images}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-accent-content font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Slider
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-accent-content mb-6">Manage Sliders</h3>

            {sliders?.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-20 h-20 text-gray-600 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-400 text-xl">No sliders created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sliders
                  ?.sort((a, b) => a.order - b.order)
                  ?.map((slider, index) => (
                    <div
                      key={slider?._id}
                      className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50 border border-gray-700/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <img
                        src={slider?.images || "/placeholder.svg?height=80&width=120&query=slider thumbnail"}
                        alt={slider?.title}
                        className="w-full md:w-24 h-20 object-cover rounded-lg shadow-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-accent-content text-lg mb-2">{slider?.title}</h4>
                        <p className="text-gray-300 text-sm mb-3 text-pretty">{slider?.Description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${slider?.active
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                              }`}
                          >
                            {slider?.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleSliderStatus(slider?._id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${slider?.active
                              ? "bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30"
                              : "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30"
                            }`}
                        >
                          {slider?.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => handleEditSlider(slider)}
                          className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDeleteSlider(slider?._id)}
                          className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ))}
              </div>
            )}
          </div>
        </div>

        {editingSlider && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <h3 className="text-2xl font-bold text-accent-content mb-6">Edit Slider</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Image</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Image URL or upload"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-accent-content rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Link URL</label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-accent-content focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                  </div>

                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateSlider}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-accent-content font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Update Slider
                  </button>
                  <button
                    onClick={() => setEditingSlider(null)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-accent-content font-semibold rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
export default HomeSliderPage