import React from "react";
import { X, User, Tag, Calendar, Clock } from "lucide-react";

const BlogModal = ({blog, setShowModal }) => {
// console.log(blog)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={()=>setShowModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="h-64 w-full overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            {blog.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User size={16} /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={16} /> {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {blog.createdDateBn}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {blog.createdTimeBn}
            </span>
          </div>

          {/* Status */}
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            {blog.status}
          </span>

          {/* Excerpt */}
          <p className="text-gray-700 italic border-l-4 border-gray-200 pl-4">
            {blog.excerpt}
          </p>

          {/* Full Content */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
