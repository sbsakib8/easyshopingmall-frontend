"use client";

import Section from "@/src/compronent/shared/Section";
import {
  BlogCreate,
  blogDelete,
  blogUploade,
} from "@/src/hook/content/userBlogs";
import { useGetBlogs } from "@/src/utlis/content/useBlogs";
import { cn } from "@/src/utlis/utils";
import {
  Calendar,
  Edit2,
  Eye,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  border,
  iconBg,
  textColor,
  loading,
}) => (
  <div
    className={cn(
      "bg-gradient-to-r backdrop-blur-sm rounded-2xl p-6 hover:transform hover:scale-105 transition-transform duration-200",
      gradient,
      border,
    )}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={cn("text-sm", textColor)}>{title}</p>
        <p className="text-2xl font-bold text-slate-300">
          {loading ? (
            <span className="animate-pulse text-slate-400">Loading...</span>
          ) : (
            value
          )}
        </p>
      </div>
      <div className={cn("p-3 rounded-xl", iconBg)}>
        <Icon size={24} className={textColor} />
      </div>
    </div>
  </div>
);

const BlogCardSkeleton = () => (
  <div className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden animate-pulse">
    {/* Image Section */}
    <div className="relative overflow-hidden">
      <div className="w-full h-48 bg-gray-700/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 w-16 h-6"></div>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6">
      {/* Title */}
      <div className="h-7 bg-gray-700/50 rounded-lg mb-3 w-3/4"></div>

      {/* Excerpt */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-11/12"></div>
        <div className="h-4 bg-gray-700/50 rounded w-10/12"></div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-700/50 rounded"></div>
          <div className="h-3 bg-gray-700/50 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-700/50 rounded"></div>
          <div className="h-3 bg-gray-700/50 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-700/50 rounded"></div>
          <div className="h-3 bg-gray-700/50 rounded w-14"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-700/50 rounded"></div>
          <div className="h-3 bg-gray-700/50 rounded w-12"></div>
        </div>

        <div className="flex gap-2">
          <div className="p-2 bg-gray-700/50 rounded-lg w-8 h-8"></div>
          <div className="p-2 bg-gray-700/50 rounded-lg w-8 h-8"></div>
        </div>
      </div>
    </div>
  </div>
);

const BlogsAdminDashboard = () => {
  const { blogs: apiBlogs, loading, error, refetch } = useGetBlogs();
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    status: "Draft",
    excerpt: "",
    content: "",
    image: null,
  });

  // Get categories from Redux
  const allCategorydata = useSelector(
    (state) => state.category.allCategorydata,
  );

  // Update local blogs when API data changes
  useEffect(() => {
    if (apiBlogs && Array.isArray(apiBlogs)) {
      setBlogs(apiBlogs);
    }
  }, [apiBlogs]);

  const statuses = ["All", "Published", "Draft"];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.category ||
      !formData.excerpt ||
      !formData.content
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("category", formData.category);
      submitData.append("status", formData.status);
      submitData.append("excerpt", formData.excerpt);
      submitData.append("content", formData.content);

      if (formData.image && formData.image instanceof File) {
        submitData.append("image", formData.image);
      }

      if (editingBlog) {
        // Update existing blog
        await blogUploade(submitData, editingBlog._id || editingBlog.id);
      } else {
        // Create new blog
        await BlogCreate(submitData);
      }

      // Refetch blogs after successful submission
      await refetch();
      resetForm();
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      status: "Draft",
      excerpt: "",
      content: "",
      image: null,
    });
    setEditingBlog(null);
    setShowModal(false);
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title || "",
      author: blog.author || "",
      category: blog.category || "",
      status: blog.status || "Draft",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image: null,
    });
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogDelete(id);
        await refetch();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog. Please try again.");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "text-green-400 bg-green-500/20";
      case "Draft":
        return "text-yellow-400 bg-yellow-500/20";
      case "Scheduled":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getImageUrl = (blog) => {
    if (blog.image) {
      // If image is a URL
      if (typeof blog.image === "string") {
        return blog.image;
      }
      // If image path is from backend
      return blog.image;
    }
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop";
  };

  // if (loading && blogs.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-slate-300 flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader2
  //           className="animate-spin mx-auto mb-4 text-blue-400"
  //           size={48}
  //         />
  //         <p className="text-gray-400">Loading blogs...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <section className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-black text-slate-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading blogs</p>
          <button
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const statsCards = [
    {
      id: "total-blogs",
      title: "Total Blogs",
      value: blogs.length,
      icon: Edit2,
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/30",
      textColor: "text-blue-300",
    },
    {
      id: "published",
      title: "Published",
      value: blogs.filter((b) => b.status === "Published").length,
      icon: Eye,
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/30",
      iconBg: "bg-green-500/30",
      textColor: "text-green-300",
    },
    {
      id: "drafts",
      title: "Drafts",
      value: blogs.filter((b) => b.status === "Draft").length,
      icon: Edit2,
      gradient: "from-yellow-500/20 to-yellow-600/20",
      border: "border-yellow-500/30",
      iconBg: "bg-yellow-500/30",
      textColor: "text-yellow-300",
    },
    {
      id: "total-views",
      title: "Total Views",
      value: blogs
        .reduce((sum, blog) => sum + (blog.views || 0), 0)
        .toLocaleString(),
      icon: TrendingUp,
      gradient: "from-purple-500/20 to-purple-600/20",
      border: "border-purple-500/30",
      iconBg: "bg-purple-500/30",
      textColor: "text-purple-300",
    },
  ];

  return (
    <Section className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-black text-slate-300 overflow-hidden">
      <div className="py-5 px-2 lg:px-9">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Blogs Management
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your blog posts and content
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transform shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add New Blog
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card) => (
            <StatCard key={card.id} {...card} loading={loading} />
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 hover:border-blue-500/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blogs by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-3 text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16 col-span-full">
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
                <Edit2 size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No blogs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id || blog.id}
                className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transform hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(blog)}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(blog.status)}`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-300 mb-3 group-hover:text-blue-400 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(
                        blog.date || blog.createdAt,
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag size={14} />
                      {blog.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Eye size={14} />
                      <span className="text-xs">{blog.views || 0} views</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transform"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id || blog.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-slideUp">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {editingBlog ? "Edit Blog" : "Add New Blog"}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    >
                      <option value="">Select Category</option>
                      {allCategorydata?.data?.map((category) => (
                        <option key={category._id} value={category?.name}>
                          {category?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 h-24 resize-none"
                    placeholder="Brief description of the blog post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 h-32 resize-none"
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-slate-300 py-3 px-6 rounded-xl font-semibold transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {editingBlog ? "Updating..." : "Creating..."}
                      </>
                    ) : editingBlog ? (
                      "Update Blog"
                    ) : (
                      "Create Blog"
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
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
          animation: fadeIn 0.3s;
        }

        .animate-slideUp {
          animation: slideUp 0.3s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Section>
  );
};

export default BlogsAdminDashboard;
