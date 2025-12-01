"use client"
import { getProductDetailsApi } from '@/src/hook/useProductDetails';
import { ChevronRight, Heart, Loader, Minus, Plus, RotateCcw, Share2, Shield, ShoppingCart, Star, Truck, Zap } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const { data: wishlist } = useSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailsApi(params.id);
        if (data) {
          // Normalize product data
          const normalized = {
            id: data._id || data.id,
            name: data.productName || data.name || 'Product',
            brand: data.brand || 'Brand',
            price: Number(data.price ?? data.sell_price ?? 0) || 0,
            originalPrice: Number(data.oldPrice ?? data.mrp ?? data.price ?? 0) || 0,
            discount: Number(data.discount ?? 0) || 0,
            rating: Number(data.ratings ?? data.rating ?? 4) || 4,
            reviews: Number(data.reviews ?? 0) || 0,
            images: data.images || ['/banner/img/placeholder.png'],
            sizes: data.sizes || [],
            colors: data.colors || [],
            stock: Number(data.productStock ?? data.stock ?? 0) || 0,
            description: data.description || data.productDescription || '',
            specifications: data.specifications || {},
            category: data.category,
            subCategory: data.subCategory,
            features: data.features || [],
          };
          setProduct(normalized);
          if (normalized.colors?.length > 0) setSelectedColor(normalized.colors[0]);
          if (normalized.sizes?.length > 0) setSelectedSize(normalized.sizes[0]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const isWishlisted = product && (wishlist || []).some((i) => i.id === product.id);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    try {
      await addToCartApi(
        {
          userId: user._id,
          productId: product.id,
          quantity,
          price: product.price,
        },
        dispatch
      );
      toast.success(`${product.name} added to cart`);
      await getCartApi(user._id, dispatch);
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product.id, dispatch);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlistApi(product.id, dispatch);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
          <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:mt-30 lg:py-10 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb with Category & SubCategory */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8 flex-wrap">
          <button onClick={() => router.push('/')} className="hover:text-blue-600 hover:underline">Home</button>
          <ChevronRight className="w-4 h-4" />
          {product?.category && (
            <>
              <button onClick={() => router.push('/shop')} className="hover:text-blue-600 hover:underline">
                {typeof product.category === 'string' ? product.category : product.category?.name || 'Category'}
              </button>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          {product?.subCategory && (
            <>
              <span className="hover:text-blue-600 cursor-pointer hover:underline">
                {typeof product.subCategory === 'string' ? product.subCategory : product.subCategory?.name || 'Subcategory'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-semibold truncate">{product?.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl group">
              <img
                src={product?.images?.[selectedImage]}
                alt={product?.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product?.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  {Math.round(product.discount)}% OFF
                </div>
              )}
              <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${isWishlisted
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {(product?.images || []).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${selectedImage === index
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
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
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
                ৳{product?.price?.toFixed(0) || 0}
              </span>
              {product?.originalPrice > product?.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ৳{product?.originalPrice?.toFixed(0) || 0}
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save ৳{(product?.originalPrice - product?.price)?.toFixed(0) || 0}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {(product?.colors?.length || 0) > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex space-x-3">
                  {product?.colors?.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name
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
            )}

            {/* Size Selection */}
            {(product?.sizes?.length || 0) > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product?.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-300 ${selectedSize === size
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:scale-105'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  {product?.stock > 0 ? (
                    <>
                      Only <span className="font-semibold text-red-500">{product.stock} items</span> left in stock!
                    </>
                  ) : (
                    <span className="font-semibold text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 ${product?.stock === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-300 ${activeTab === tab
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
                  {product?.description || 'No description available'}
                </p>
                {product?.features?.length > 0 && (
                  <>
                    <h4 className="text-xl font-semibold mb-4">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product?.specifications || {}).map(([key, value]) => (
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
                  {product?.rating || 0} out of 5 stars
                </h3>
                <p className="text-gray-600">Based on {product?.reviews || 0} customer reviews</p>
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