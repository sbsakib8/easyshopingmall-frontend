"use client"
import React, { useState } from 'react';
import { Heart, Share2, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw, Zap } from 'lucide-react';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const product = {
    name: "Premium Cotton Summer T-Shirt",
    brand: "StyleCraft",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    rating: 4.5,
    reviews: 1247,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop"
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'blue', value: '#3B82F6' },
      { name: 'red', value: '#EF4444' },
      { name: 'green', value: '#10B981' },
      { name: 'black', value: '#1F2937' },
      { name: 'white', value: '#F9FAFB', border: '#E5E7EB' }
    ],
    features: [
      "100% Premium Cotton",
      "Machine Washable",
      "Breathable Fabric",
      "Pre-shrunk"
    ],
    description: "Experience ultimate comfort with our premium cotton summer t-shirt. Crafted from the finest 100% cotton, this versatile piece offers exceptional breathability and softness. Perfect for casual outings, gym sessions, or lounging at home.",
    specifications: {
      "Fabric": "100% Cotton",
      "Fit": "Regular Fit",
      "Sleeve": "Short Sleeve",
      "Neck": "Round Neck",
      "Pattern": "Solid",
      "Occasion": "Casual"
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen lg:mt-30 lg:py-10 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                {product.discount}% OFF
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                  isWishlisted 
                    ? 'bg-red-500 text-white scale-110' 
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-4 ring-blue-500 shadow-lg scale-105' 
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ৳{product.price}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ৳{product.originalPrice}
              </span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Save ৳{product.originalPrice - product.price}
              </span>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Color: {selectedColor}
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color.name
                        ? 'ring-4 ring-blue-300 scale-110'
                        : 'hover:scale-110'
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: color.border || color.value
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:scale-105'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600">
                  Only <span className="font-semibold text-red-500">12 items</span> left in stock!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
                <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-300 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Truck className="w-8 h-8 text-blue-500" />
                  <span className="text-sm font-medium">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <Shield className="w-8 h-8 text-green-500" />
                  <span className="text-sm font-medium">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <RotateCcw className="w-8 h-8 text-purple-500" />
                  <span className="text-sm font-medium">Easy Return</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <span className="text-sm font-medium">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
                <h4 className="text-xl font-semibold mb-4">Key Features:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-900">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {product.rating} out of 5 stars
                </h3>
                <p className="text-gray-600">Based on {product.reviews} customer reviews</p>
                <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;