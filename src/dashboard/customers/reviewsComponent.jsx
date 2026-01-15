"use client";

import {
  approveReview,
  getAllReviews,
  rejectReview,
  deleteReview,
  getPendingReviews,
} from "@/src/hook/useReview";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [clientSide, setClientSide] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [approvedReviews, setApprovedReviews] = useState(0);
  const [refresh, setRefresh] = useState(false);

  // Filter and sort reviews
  const filteredReviews = clientSide
    ? reviews
        .filter((review) => {
          const term = searchTerm.toLowerCase();

          const matchesSearch =
            review.userId?.name?.toLowerCase().includes(term) ||
            review.userId?.email?.toLowerCase().includes(term) ||
            review.comment?.toLowerCase().includes(term) ||
            review.status?.toLowerCase().includes(term);

          const matchesStatus = filterStatus === "all" || review.status === filterStatus;

          const matchesRating =
            filterRating === "all" || review.rating?.toString() === filterRating;

          return matchesSearch && matchesStatus && matchesRating;
        })
        .sort((a, b) => {
          let aValue;
          let bValue;

          if (sortBy === "date") {
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
          } else if (sortBy === "rating") {
            aValue = a.rating;
            bValue = b.rating;
          } else {
            aValue = a[sortBy];
            bValue = b[sortBy];
          }

          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        })
    : reviews;

  // Calculate statistics
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  // All Pending Review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getPendingReviews();
        setReviews(data);
        console.log("Fetched reviews:", data);
        setClientSide(true);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [refresh]);

  useEffect(() => {
    const fetchTotalReviews = async () => {
      try {
        const reviews = await getAllReviews();
        setTotalReviews(reviews.length);
        setApprovedReviews(reviews.filter((r) => r.status === "approved").length);
      } catch (err) {
        console.error("Failed to fetch all reviews:", err);
      }
    };

    fetchTotalReviews();
  }, []);

  // Handle review status change
  const handleStatusChange = async (_id, newStatus) => {
    try {
      if (newStatus === "approved") {
        await approveReview(_id);
        toast.success("Review approved");
      } else if (newStatus === "rejected") {
        await rejectReview(_id);
        toast.error("Review rejected");
      } else if (newStatus === "pending") {
        toast("Review set to pending");
      }

      setReviews((prev) => prev.map((r) => (r._id === _id ? { ...r, status: newStatus } : r)));

      setSelectedReview((prev) =>
        prev && prev._id === _id ? { ...prev, status: newStatus } : prev
      );

      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Review status error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update review");
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (_id) => {
    try {
      await deleteReview(_id);

      setReviews((prev) => prev.filter((r) => r._id !== _id));

      setSelectedReview(null);
      setIsDetailModalOpen(false);

      setRefresh((prev) => !prev);

      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Delete review error:", err.response?.data || err.message);
      toast.error("Failed to delete review");
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-600"}`}>
        ★
      </span>
    ));
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const colors = {
      approved: "bg-green-600 text-white",
      pending: "bg-yellow-600 text-white",
      rejected: "bg-red-600 text-white",
    };
    return colors[status] || "bg-gray-600 text-white";
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold z-10"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };

  const Dropdown = ({ isOpen, onClose, children, trigger }) => {
    return (
      <div className="relative">
        {trigger}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onClose}></div>
            <div className="absolute top-full left-0 mt-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 min-w-full">
              {children}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className={`transition-all   duration-500 lg:ml-15 py-5 px-2 lg:px-9`}>
        {/* Welcome Banner */}
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
                  Customers{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Reviews
                  </span>
                  !
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" mx-auto px-4 py-8 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="text-sm font-medium text-gray-400 mb-2">Total Reviews</div>
              <div className="text-3xl font-bold text-white">{totalReviews}</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="text-sm font-medium text-gray-400 mb-2">Average Rating</div>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</div>
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="text-sm font-medium text-gray-400 mb-2">Approved</div>
              <div className="text-3xl font-bold text-green-400">{approvedReviews}</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="text-sm font-medium text-gray-400 mb-2">Pending</div>
              <div className="text-3xl font-bold text-yellow-400">{pendingReviews}</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-white mb-4">Filter & Search Reviews</h2>

            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Search Input - Left */}
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />

              {/* Rating Dropdown - Right */}
              <div className="w-full md:w-1/3">
                <Dropdown
                  isOpen={showRatingDropdown}
                  onClose={() => setShowRatingDropdown(false)}
                  trigger={
                    <button
                      onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-600 transition-colors flex items-center justify-between"
                    >
                      Rating: {filterRating === "all" ? "All" : `${filterRating} Stars`}
                      <span>▼</span>
                    </button>
                  }
                >
                  <button
                    onClick={() => {
                      setFilterRating("all");
                      setShowRatingDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                  >
                    All Ratings
                  </button>

                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setFilterRating(rating.toString());
                        setShowRatingDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    >
                      {rating} Stars
                    </button>
                  ))}
                </Dropdown>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 animate-fade-in">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-400 text-center mt-6">No reviews found</p>
            ) : (
              filteredReviews.map(
                (review, index) => (
                  console.log("review data", review),
                  (
                    <div
                      key={review._id}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-5 lg:gap-x-6 items-start">
                        {/* Customer Info */}
                        <div className="lg:col-span-3 flex items-center gap-3">
                          {review.userId?.image ? (
                            <img
                              src={review.userId.image}
                              alt={review.userId?.name?.charAt(0).toUpperCase() || "U"}
                              className="w-12 h-12 rounded-full border-2 border-yellow-500 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full border-2 border-yellow-500 bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                              {review.userId?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white truncate">
                              {review.userId?.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {review.userId?.email || "No Email"}
                            </p>
                          </div>
                        </div>

                        {/* Product & Rating */}
                        <div className="lg:col-span-3">
                          <h4 className="font-medium text-white mb-1 truncate">
                            {review.productId?.productName || "Unknown Product"}
                          </h4>

                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review?.rating)}</div>
                            <span className="text-xs text-gray-400">({review?.rating}/5)</span>
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="lg:col-span-4">
                          <p className="text-white text-sm leading-relaxed line-clamp-2">
                            {review?.comment}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>
                              {new Date(review?.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span>👍 {review?.helpful || 0} helpful</span>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="lg:col-span-2 flex flex-col gap-3 items-start lg:items-end">
                          <span
                            className={`${getStatusBadge(
                              review?.status
                            )} px-3 py-1 rounded-full text-xs font-semibold capitalize`}
                          >
                            {review?.status}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedReview(review);
                                setIsDetailModalOpen(true);
                              }}
                              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-sm text-white hover:bg-slate-600 transition"
                            >
                              View
                            </button>

                            <Dropdown
                              isOpen={showActionDropdown === review._id}
                              onClose={() => setShowActionDropdown(null)}
                              trigger={
                                <button
                                  onClick={() =>
                                    setShowActionDropdown(
                                      showActionDropdown === review._id ? null : review._id
                                    )
                                  }
                                  className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-sm text-white hover:bg-slate-600 transition"
                                >
                                  Actions
                                </button>
                              }
                            >
                              {review.status !== "approved" && (
                                <button
                                  onClick={() => handleStatusChange(review._id, "approved")}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                                >
                                  Approve
                                </button>
                              )}
                              {review.status !== "pending" && (
                                <button
                                  onClick={() => handleStatusChange(review._id, "pending")}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-600"
                                >
                                  Mark Pending
                                </button>
                              )}
                              {review.status !== "rejected" && (
                                <button
                                  onClick={() => handleStatusChange(review._id, "rejected")}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                Delete
                              </button>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              )
            )}
          </div>

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Reviews Found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
          {selectedReview && (
            <div className="p-8 text-white">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Review Details</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                ></button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {selectedReview.userId?.image ? (
                      <img
                        src={selectedReview.userId.image}
                        alt={selectedReview.userId?.name || "User"}
                        className="w-12 h-12 rounded-full border-2 border-yellow-500 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-yellow-500 bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                        {selectedReview.userId?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold">{selectedReview.userId.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedReview.userId.email || "No Email"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(selectedReview.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Product & Rating Section */}
                <div>
                  <p className="text-md mb-2">Product: T-Shirt</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-500 text-lg">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">({selectedReview.rating}/5)</span>
                  </div>
                </div>

                {/* Comment Section */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Review Comment:</h4>
                  <div className="bg-[#2d3748] p-4 rounded-xl border border-gray-700">
                    <p className="text-gray-200 leading-relaxed">{selectedReview.comment}</p>
                  </div>
                </div>

                {/* Status & Helpful Count */}
                <div className="flex items-center justify-between">
                  <span
                    className={`${getStatusBadge(
                      selectedReview.status
                    )} px-4 py-1 rounded-full text-sm font-medium`}
                  >
                    {selectedReview.status}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center">
                    <span className="mr-1">👍</span> {selectedReview.helpful} people found this
                    helpful
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4">
                  <button
                    onClick={() => handleStatusChange(selectedReview._id, "approved")}
                    className="bg-[#10b981] hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedReview._id, "pending")}
                    className="bg-[#d97706] hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-md transition-all"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedReview._id, "rejected")}
                    className="bg-[#ef4444] hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDeleteReview(selectedReview._id)}
                    className="bg-red-600 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-md transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewsPage;
