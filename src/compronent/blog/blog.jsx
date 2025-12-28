"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Heart, MessageCircle, Share2, Tag, TrendingUp, Search, Filter } from 'lucide-react';
import { BlogAllGet } from '@/src/hook/content/userBlogs';
import LoadingPage from '@/src/helper/loading/loadingPge';
import BlogModal from './BlogModal';
import blog from '@/app/(page)/blog/page';

const BlogPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribe, setsubscribe] = useState(false);
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState({})


  useEffect( () => {
    setIsVisible(true);
   const getBolog=async()=>{
     const res = await BlogAllGet()
    const data = await res.data
    setBlogPosts(data)
    setLoading(false)
   }
   getBolog()
  }, []);
if(loading) return <LoadingPage></LoadingPage>
console.log(blogPosts)
  const handleSubscribe = () => {
    setsubscribe(!subscribe);
  }
  const categories = ['All', 'Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sports', 'Tips & Tricks'];

  // const blogPosts = [
  //   {
  //     id: 1,
  //     title: "২০২৪ সালের সেরা ফ্যাশন ট্রেন্ড: যা জানা জরুরি",
  //     excerpt: "এই বছরের সবচেয়ে জনপ্রিয় ফ্যাশন ট্রেন্ডগুলো নিয়ে বিস্তারিত আলোচনা। কীভাবে আপনি এই ট্রেন্ডগুলো আপনার স্টাইলে incorporate করবেন।",
  //     image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
  //     category: "Fashion",
  //     author: "Fatima Rahman",
  //     date: "২৫ আগস্ট, ২০২৪",
  //     readTime: "৮ মিনিট",
  //     likes: 245,
  //     comments: 18,
  //     tags: ["Fashion", "Trend", "Style"]
  //   },
  //   {
  //     id: 2,
  //     title: "স্মার্টফোন কেনার আগে যে বিষয়গুলো মাথায় রাখবেন",
  //     excerpt: "নতুন স্মার্টফোন কেনার সময় বাজেট, ফিচার, ব্র্যান্ড - সব মিলিয়ে সঠিক সিদ্ধান্ত নেওয়ার জন্য complete guide।",
  //     image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop",
  //     category: "Electronics",
  //     author: "Karim Ahmed",
  //     date: "২২ আগস্ট, ২০২৪",
  //     readTime: "১২ মিনিট",
  //     likes: 189,
  //     comments: 24,
  //     tags: ["Mobile", "Technology", "Guide"]
  //   },
  //   {
  //     id: 3,
  //     title: "ঘর সাজানোর ১০টি সহজ এবং কার্যকর টিপস",
  //     excerpt: "কম খরচে কীভাবে আপনার ঘরকে সুন্দর এবং আকর্ষণীয় করে তুলবেন? আমাদের expert টিপস ফলো করুন।",
  //     image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
  //     category: "Home & Living",
  //     author: "Nasreen Sultana",
  //     date: "২০ আগস্ট, ২০২৪",
  //     readTime: "৬ মিনিট",
  //     likes: 156,
  //     comments: 31,
  //     tags: ["Home Decor", "Interior", "DIY"]
  //   },
  //   {
  //     id: 4,
  //     title: "গ্রীষ্মকালীন ত্বকের যত্নে করণীয়",
  //     excerpt: "গরমের সময় ত্বকের বিশেষ যত্ন প্রয়োজন। জানুন কীভাবে আপনার ত্বককে healthy এবং glowing রাখবেন।",
  //     image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop",
  //     category: "Beauty",
  //     author: "Dr. Rashida Khan",
  //     date: "১৮ আগস্ট, ২০২৪",
  //     readTime: "৭ মিনিট",
  //     likes: 298,
  //     comments: 42,
  //     tags: ["Skincare", "Beauty", "Health"]
  //   },
  //   {
  //     id: 5,
  //     title: "অনলাইন শপিংয়ে নিরাপত্তার ৮টি গুরুত্বপূর্ণ টিপস",
  //     excerpt: "অনলাইনে কেনাকাটা করার সময় কীভাবে নিজেকে scam এবং fraud থেকে রক্ষা করবেন? জেনে নিন expert advice।",
  //     image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
  //     category: "Tips & Tricks",
  //     author: "Tanvir Islam",
  //     date: "১৫ আগস্ট, ২০২৪",
  //     readTime: "১০ মিনিট",
  //     likes: 412,
  //     comments: 56,
  //     tags: ["Security", "Online Shopping", "Tips"]
  //   },
  //   {
  //     id: 6,
  //     title: "ফিটনেস এবং খেলাধুলার জন্য সেরা গিয়ার",
  //     excerpt: "ঘরে বসে exercise করতে চান? জানুন কোন কোন equipment গুলো আপনার জন্য সবচেয়ে উপযোগী হবে।",
  //     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
  //     category: "Sports",
  //     author: "Rafiq Hasan",
  //     date: "১২ আগস্ট, ২০২৪",
  //     readTime: "৯ মিনিট",
  //     likes: 167,
  //     comments: 22,
  //     tags: ["Fitness", "Sports", "Equipment"]
  //   }
  // ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const filteredPosts = regularPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
console.log(selectedPost)
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
                      {featuredPost?.date}
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
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        {featuredPost.likes}
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {featuredPost?.comments || "500"}
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
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {category}
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
              <div key={post._id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: `${index * 200}ms` }}>
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
                    {post.date}
                    <Clock className="w-4 h-4 ml-4 mr-1" />
                    {post.readTime}
                  </div>

                  <button onClick={()=> {
                    setSelectedPost(post)
                    setShowModal(true)
                    }} className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-600 transition-colors line-clamp-2">
                    {post.title}
                  </button>
               
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-teal-500 transition-colors">
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
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
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