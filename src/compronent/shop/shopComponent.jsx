"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Filter, Search, Grid, List, ChevronDown, Plus, Minus, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ShopPage = () => {
  // Clothing products data
  const [allProducts] = useState([
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.00,
      originalPrice: 39.00,
      category: "t-shirts",
      brand: "Urban Style",
      size: ["S", "M", "L", "XL"],
      color: ["White", "Black", "Gray"],
      rating: 4.5,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      inStock: true,
      isNew: true,
      discount: 26,
      gender: "men"
    },
    {
      id: 2,
      name: "Casual Denim Jeans",
      price: 78.00,
      originalPrice: 98.00,
      category: "jeans",
      brand: "Denim Co",
      size: ["28", "30", "32", "34", "36"],
      color: ["Blue", "Black", "Light Blue"],
      rating: 4.3,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      inStock: true,
      isNew: false,
      discount: 20,
      gender: "men"
    },
    {
      id: 3,
      name: "Elegant Summer Dress",
      price: 89.00,
      originalPrice: 120.00,
      category: "dresses",
      brand: "Fashion Queen",
      size: ["XS", "S", "M", "L"],
      color: ["Red", "Blue", "White", "Pink"],
      rating: 4.7,
      reviews: 298,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      inStock: true,
      isNew: true,
      discount: 26,
      gender: "women"
    },
    {
      id: 4,
      name: "Cozy Winter Sweater",
      price: 65.00,
      originalPrice: 85.00,
      category: "sweaters",
      brand: "Warm Wear",
      size: ["S", "M", "L", "XL"],
      color: ["Gray", "Navy", "Burgundy"],
      rating: 4.4,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      inStock: false,
      isNew: false,
      discount: 24,
      gender: "unisex"
    },
    {
      id: 5,
      name: "Sport Running Shoes",
      price: 120.00,
      originalPrice: 150.00,
      category: "shoes",
      brand: "Athletic Pro",
      size: ["7", "8", "9", "10", "11"],
      color: ["White", "Black", "Red"],
      rating: 4.6,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      inStock: true,
      isNew: true,
      discount: 20,
      gender: "unisex"
    },
    {
      id: 6,
      name: "Leather Jacket Premium",
      price: 199.00,
      originalPrice: 250.00,
      category: "jackets",
      brand: "Leather Craft",
      size: ["S", "M", "L", "XL"],
      color: ["Black", "Brown"],
      rating: 4.8,
      reviews: 123,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      inStock: true,
      isNew: false,
      discount: 20,
      gender: "men"
    },
    {
      id: 7,
      name: "Floral Print Blouse",
      price: 45.00,
      originalPrice: 60.00,
      category: "blouses",
      brand: "Elegant Touch",
      size: ["XS", "S", "M", "L"],
      color: ["White", "Pink", "Blue"],
      rating: 4.2,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=400",
      inStock: true,
      isNew: true,
      discount: 25,
      gender: "women"
    },
    {
      id: 8,
      name: "Classic Formal Shirt",
      price: 55.00,
      originalPrice: 75.00,
      category: "shirts",
      brand: "Business Style",
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["White", "Blue", "Light Blue"],
      rating: 4.3,
      reviews: 201,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      inStock: true,
      isNew: false,
      discount: 27,
      gender: "men"
    }
  ]);

  const [products, setProducts] = useState(allProducts);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter and search products
  useEffect(() => {
    let filtered = allProducts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Brand filter
    if (filterBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === filterBrand);
    }

    // Gender filter
    if (filterGender !== 'all') {
      filtered = filtered.filter(product => product.gender === filterGender || product.gender === 'unisex');
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.isNew - a.isNew;
        case 'discount':
          return b.discount - a.discount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterBrand, filterGender, priceRange, ratingFilter, sortBy, allProducts]);

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Toggle wishlist
  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const categories = ['all', 't-shirts', 'jeans', 'dresses', 'sweaters', 'shoes', 'jackets', 'blouses', 'shirts'];
  const brands = ['all', 'Urban Style', 'Denim Co', 'Fashion Queen', 'Warm Wear', 'Athletic Pro', 'Leather Craft', 'Elegant Touch', 'Business Style'];
  const genders = ['all', 'men', 'women', 'unisex'];

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterBrand('all');
    setFilterGender('all');
    setPriceRange([0, 300]);
    setRatingFilter(0);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clothing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Top Filter Bar */}
        <div className="bg-white lg:mt-28 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-gray-600 font-medium">Showing {products.length} results</span>
              
              {/* Quick Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterGender(filterGender === 'men' ? 'all' : 'men')}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    filterGender === 'men'
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Men
                </button>
                <button
                  onClick={() => setFilterGender(filterGender === 'women' ? 'all' : 'women')}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    filterGender === 'women'
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Women
                </button>
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-300"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="name">Sort By Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Best Discount</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-300 ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-300 ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <span className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </span>
              <Filter className="w-5 h-5" />
            </button>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Price Filter */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Price Filter</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min price</span>
                    <span>Max price</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 300])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="300"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-purple-600"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-600">Price: ${priceRange[0]} — ${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Product Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === category}
                        onChange={() => setFilterCategory(category)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="capitalize text-gray-700">
                        {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Select Brands */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Select Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterBrand === brand}
                        onChange={() => setFilterBrand(filterBrand === brand ? 'all' : brand)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">
                        {brand === 'all' ? 'All Brands' : brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === rating}
                        onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-gray-600 text-sm">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* No Products Found */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-6'
              }`}>
                {currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'h-full' : 'h-56'
                        }`}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 space-y-1">
                        {product.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                            NEW
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-300"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              wishlist.some(item => item.id === product.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                      </div>

                      <div>
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-red-600">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-2 px-4 rounded font-semibold transition-all duration-300 text-sm ${
                            product.inStock
                              ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.inStock ? (
                            <span className="flex items-center justify-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </span>
                          ) : (
                            'Out of Stock'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-purple-50 transition-colors duration-300"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === i + 1
                        ? 'bg-purple-500 text-white transform scale-110'
                        : 'bg-white border border-gray-300 hover:bg-purple-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-purple-50 transition-colors duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setCartOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Start shopping to add items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                        <p className="text-purple-600 font-bold">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 bg-white rounded-lg border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors duration-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all duration-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 bg-white">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-purple-600">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => setCart([])}
                  className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-30"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar for cart */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Hover animations */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
        
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }

        /* Radio button custom styles */
        input[type="radio"]:checked {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }
        
        input[type="checkbox"]:checked {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }

        /* Price range slider */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        input[type="range"]::-webkit-slider-track {
          height: 6px;
          cursor: pointer;
          background: #e5e7eb;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ShopPage;