"use client";

import { BlogSkeleton } from "@/src/compronent/loading/Skeleton";
import { useGetBlogs } from "@/src/utlis/content/useBlogs";
import { useGetcategory } from "@/src/utlis/usecategory";
import { cn } from "@/src/utlis/utils";
import {
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Heart,
  InboxIcon,
  MessageCircle,
  Search,
  Share2,
  TrendingUp,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Container from "../shared/Container";
import Section from "../shared/Section";
import BlogModal from "./BlogModal";

const BlogPage = ({ initialData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribe, setsubscribe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});

  const { blogs: apiBlogs, loading: blogsLoading } = useGetBlogs();
  const { category: apiCategory, CatLoading: categoryLoading } =
    useGetcategory();

  const [blogs, setBlogs] = useState(initialData?.blogs || []);
  const [category, setCategory] = useState(initialData?.categories || []);

  useEffect(() => {
    if (apiBlogs) setBlogs(apiBlogs);
  }, [apiBlogs]);

  useEffect(() => {
    if (apiCategory) setCategory(apiCategory);
  }, [apiCategory]);

  const loading = !initialData && (blogsLoading || categoryLoading);

  useEffect(() => {
    setIsVisible(true);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubscribe = () => {
    setsubscribe(!subscribe);
  };

  const featuredPost = blogs[0];
  const regularPosts = Array.isArray(blogs) ? blogs.slice(1) : [];

  const filteredPosts = regularPosts.filter((post) => {
    const title = post?.title || "";
    const excerpt = post?.excerpt || "";
    const matchesCategory =
      selectedCategory === "All" || post?.category === selectedCategory;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Section className="min-h-dvh bg-bg">
      <Container className="space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary via-primary/60 to-secondary/30 bg-clip-text text-transparent leading-relaxed">
            আমাদের ব্লগ
          </h1>
          <p className="text-slate-400 text-sm sm:text-sm md:text-base lg:text-lg">
            সর্বশেষ ট্রেন্ড, টিপস এবং গাইড পড়ুন আমাদের expert দের কাছ থেকে
          </p>
        </div>

        {/* Featured Post */}
        <div
          className={`transform transition-all duration-1000 space-y-6 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            <TrendingUp className="text-accent" />
            <span>ফিচার্ড পোস্ট</span>
          </h2>

          {loading ? (
            <div className="bg-secondary/6 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between animate-pulse">
              {/* Image Skeleton */}
              <div className="sm:flex-1/3 md:flex-1 h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-112 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>

              {/* Content Skeleton */}
              <div className="sm:flex-2/3 md:flex-1 p-4 space-y-4">
                {/* Category & Date */}
                <div className="flex items-center gap-4">
                  <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-4/5" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-6">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ) : featuredPost ? (
            <div className="bg-secondary/6 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-1/3 md:flex-1 h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-112">
                <Image
                  src={featuredPost?.image}
                  alt={featuredPost?.title}
                  width={500}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:flex-2/3 md:flex-1 p-4 text-black space-y-4">
                <div className="flex items-center gap-4 space-x-1 text-xs md:text-sm">
                  <span className="bg-secondary text-secondary-content px-3 py-1 rounded-full font-medium">
                    {featuredPost?.category}
                  </span>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 transition-all duration-300" />
                    {featuredPost?.createdDateBn}
                  </div>
                </div>

                <h3
                  onClick={() => {
                    setSelectedPost(featuredPost);
                    setShowModal(true);
                  }}
                  className="text-lg md:text-xl font-medium hover:text-teal-600 transition-colors cursor-pointer line-clamp-1 md:line-clamp-2 xl:line-clamp-3 2xl:line-clamp-4"
                >
                  {featuredPost?.title}
                </h3>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 lg:line-clamp-5 xl:line-clamp-6 2xl:line-clamp-7">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between text-[10px] md:text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost?.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost?.readTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {featuredPost?.likes}
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {featuredPost?.comments}
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-secondary/6 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                  <InboxIcon className="w-20 h-20 mx-auto text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Featured Post Available
                  </h3>
                  <p className="text-gray-500 max-w-xs">
                    We couldn't find any featured post at the moment. Please
                    check back later.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex  gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="ব্লগ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 ring-1 ring-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black text-xs md:text-sm"
            />
          </div>

          <div className="relative flex-1 max-w-xs" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 rounded-2xl",
                "bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200",
                "text-left font-medium text-xs sm:text-sm md:text-base shadow-sm",
              )}
            >
              <span className="truncate">
                {selectedCategory === "All"
                  ? "All Categories"
                  : selectedCategory}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-gray-500 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute mt-2 w-full bg-white rounded-md shadow-xl border border-gray-100 z-50 max-h-80 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-primary/10 transition-colors text-xs sm:text-sm md:text-base",
                    selectedCategory === "All" &&
                      "bg-primary/10 text-primary-content font-medium",
                  )}
                >
                  <span>All Categories</span>
                  {selectedCategory === "All" && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </button>

                {category?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-primary/10 transition-colors text-xs sm:text-sm md:text-base",
                      selectedCategory === cat.name &&
                        "bg-primary/10 text-primary-content font-medium",
                    )}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.name && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          {/* <div className="flex-1 overflow-hidden flex items-center justify-center">
            <div
              className={cn(
                "flex items-center gap-3 pb-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin",
              )}
            >
              {[
                { _id: "ALL", name: "ALL", icon: "🌐" },
                { _id: "electronics", name: "Electronics", icon: "📱" },
                { _id: "fashion", name: "Fashion", icon: "👕" },
                { _id: "home", name: "Home & Kitchen", icon: "🏠" },
                { _id: "beauty", name: "Beauty", icon: "💄" },
                { _id: "sports", name: "Sports", icon: "⚽" },
                { _id: "books", name: "Books", icon: "📚" },
                { _id: "toys", name: "Toys & Games", icon: "🧸" },
                { _id: "automotive", name: "Automotive", icon: "🚗" },
                { _id: "grocery", name: "Grocery", icon: "🛒" },
                { _id: "jewelry", name: "Jewelry", icon: "💍" }, // Extra for more width
                { _id: "furniture", name: "Furniture", icon: "🛋️" }, // Extra for more width
              ].map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  type="button"
                  className={cn(
                    "flex items-center px-4 py-1.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 snap-start bg-gray-100 border border-gray-200 text-gray-600 text-xs md:text-sm lg:text-base uppercase",
                    {
                      "bg-primary text-primary-content shadow-lg":
                        selectedCategory === cat.name,
                      "hover:shadow hover:bg-gray-200":
                        selectedCategory !== cat.name,
                    },
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {/* Regular Posts Grid */}
        <div className="space-y-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
            সাম্প্রতিক পোস্টসমূহ
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => <BlogSkeleton key={i} />)
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  onClick={() => {
                    setSelectedPost(post);
                    setShowModal(true);
                  }}
                  className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 group cursor-pointer transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 text-black">
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1 text-teal-600" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-teal-600" />
                        {post.createdDateBn}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <button className="text-teal-600 font-bold text-sm flex items-center transition-all">
                        আরও পড়ুন →
                      </button>
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-teal-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  কোনো পোস্ট পাওয়া যায়নি
                </h3>
                <p className="text-gray-500">
                  আপনার search term বা category পরিবর্তন করে আবার চেষ্টা করুন।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="text-center shadow-xl rounded-2xl border border-secondary-content/20 bg-secondary/5 backdrop-blur-md p-4 md:p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              নতুন পোস্টের আপডেট পান
            </h2>
            <p className="text-xs sm:text-sm md:text-base opacity-90 max-w-2xl mx-auto text-slate-500">
              আমাদের newsletter subscribe করুন এবং সর্বপ্রথম জানুন নতুন ব্লগ
              পোস্ট এবং exclusive content এর কথা।
            </p>
          </div>

          <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 md:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা"
              className="flex-1 px-4 py-2 rounded-full bg-transparent outline-none ring ring-gray-300 text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs sm:text-sm md:text-base"
            />
            <button
              onClick={handleSubscribe}
              className="bg-primary/80 hover:bg-primary cursor-pointer text-primary-content px-4 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base"
            >
              {subscribe ? "Subscribed" : "Subscribe"}
            </button>
          </div>
          <p className="mt-5">
            {subscribe ? "ধন্যবাদ সাবস্ক্রাইব করার জন্য!" : "সাবস্ক্রাইব করুন"}
          </p>
        </div>
      </Container>

      {showModal && (
        <BlogModal blog={selectedPost} setShowModal={setShowModal} />
      )}
    </Section>
  );
};

export default BlogPage;
