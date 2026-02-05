"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Heart, MessageCircle, Share2, Tag, TrendingUp, Search, Filter } from 'lucide-react';
import Skeleton, { BlogSkeleton } from '@/src/compronent/loading/Skeleton';
import BlogModal from './BlogModal';
import { useGetBlogs } from '@/src/utlis/content/useBlogs';
import { useGetcategory } from '@/src/utlis/usecategory';

const BlogPage = ({ initialData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribe, setsubscribe] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState({})

  const { blogs: apiBlogs, loading: blogsLoading } = useGetBlogs()
  const { category: apiCategory, CatLoading: categoryLoading } = useGetcategory()

  const [blogs, setBlogs] = useState(initialData?.blogs || [])
  const [category, setCategory] = useState(initialData?.categories || [])

  useEffect(() => {
    if (apiBlogs) setBlogs(apiBlogs)
  }, [apiBlogs])

  useEffect(() => {
    if (apiCategory) setCategory(apiCategory)
  }, [apiCategory])

  const loading = !initialData && (blogsLoading || categoryLoading);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscribe = () => {
    setsubscribe(!subscribe);
  }

  const featuredPost = blogs[0];
  const regularPosts = blogs.slice(1)

  const filteredPosts = regularPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen lg:mt-20 py-5 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className={`container mx-auto px-4 py-16 md:py-24 relative transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">আমাদের ব্লগ</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">সর্বশেষ ট্রেন্ড, টিপস এবং গাইড পড়ুন আমাদের expert দের কাছ থেকে</p>
            <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className={`mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">ফিচার্ড পোস্ট</h2>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Skeleton className="w-full h-64 md:h-[400px]" />
                  </div>
                  <div className="md:w-1/2 p-8 space-y-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-2/3" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex justify-between pt-6">
                      <Skeleton className="h-6 w-32" />
                      <div className="flex gap-4">
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-6 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : featuredPost ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost?.image}
                      alt={featuredPost?.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 text-black">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {featuredPost?.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1 transition-all duration-300" />
                        {featuredPost?.createdDateBn}
                      </div>
                    </div>

                    <h3 onClick={() => { setSelectedPost(featuredPost); setShowModal(true); }} className="text-2xl md:text-3xl font-bold mb-4 hover:text-teal-600 transition-colors cursor-pointer">
                      {featuredPost?.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ব্লগ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === "All"
                  ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              {category?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regular Posts Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">সাম্প্রতিক পোস্টসমূহ</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <BlogSkeleton key={i} />
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  onClick={() => { setSelectedPost(post); setShowModal(true); }}
                  className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 group cursor-pointer transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো পোস্ট পাওয়া যায়নি</h3>
                <p className="text-gray-500">আপনার search term বা category পরিবর্তন করে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">নতুন পোস্টের আপডেট পান</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">আমাদের newsletter subscribe করুন এবং সর্বপ্রথম জানুন নতুন ব্লগ পোস্ট এবং exclusive content এর কথা।</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা"
              className="flex-1 px-6 py-3 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button onClick={handleSubscribe} className="bg-white cursor-pointer text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              {subscribe ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          <p className='mt-5'>{subscribe ? 'ধন্যবাদ সাবস্ক্রাইব করার জন্য!' : 'সাবস্ক্রাইব করুন'}</p>
        </div>
      </div>

      {showModal && <BlogModal blog={selectedPost} setShowModal={setShowModal} />}
    </div>
  );
};

export default BlogPage;