"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Heart, MessageCircle, Share2, Tag, TrendingUp, Search, Filter } from 'lucide-react';
import LoadingPage from '@/src/helper/loading/loadingPge';
import BlogModal from './BlogModal';
import { useGetBlogs } from '@/src/utlis/content/useBlogs';
import { useGetcategory } from '@/src/utlis/usecategory';

const BlogPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribe, setsubscribe] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState({})
const { blogs, loading }= useGetBlogs()
const { category, CatLoading } = useGetcategory()
  useEffect( () => {
    setIsVisible(true);

  }, []);
if(loading || CatLoading) return <LoadingPage></LoadingPage>
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
// console.log(selectedPost)
  return (
    <div className="min-h-screen lg:mt-20 py-5 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className={`container mx-auto px-4 py-16 md:py-24 relative transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              আমাদের ব্লগ
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              সর্বশেষ ট্রেন্ড, টিপস এবং গাইড পড়ুন আমাদের expert দের কাছ থেকে
            </p>
            <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>



      {/* Featured Post */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className={`mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">ফিচার্ড পোস্ট</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost?.image}
                    alt={featuredPost?.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost?.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredPost?.createdDateBn}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-teal-600 transition-colors cursor-pointer">
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
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Search and Filter */}
      <div className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ব্লগ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
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
      <div className="py-16 bg-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">সাম্প্রতিক পোস্টসমূহ</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div 
                key={post._id} 
                onClick={() => {
                  setSelectedPost(post)
                  setShowModal(true)
                }} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} 
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post?.image}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post?.createdDateBn}
                    <Clock className="w-4 h-4 ml-4 mr-1" />
                    {post?.readTime}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
               
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-teal-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {/* {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো পোস্ট পাওয়া যায়নি</h3>
              <p className="text-gray-500">আপনার search term বা category পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">নতুন পোস্টের আপডেট পান</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            আমাদের newsletter subscribe করুন এবং সর্বপ্রথম জানুন নতুন ব্লগ পোস্ট এবং exclusive content এর কথা।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল ঠিকানা"
              className="flex-1 px-6 py-3 rounded-full bg-white border-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button onClick={handleSubscribe} className="bg-white cursor-pointer text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              {subscribe ? 'subscribed' : 'subscribe'}
            </button>

          </div>
          <p className='mt-5'>{subscribe ? 'ধন্যবাদ সাবস্ক্রাইব করার জন্য!' : 'সাবস্ক্রাইব করুন'}</p>
        </div>
      </div>
      {showModal&& <BlogModal blog={selectedPost} setShowModal={setShowModal} />}
    </div>
  );
};

export default BlogPage;