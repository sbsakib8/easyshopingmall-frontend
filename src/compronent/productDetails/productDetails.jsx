"use client"
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartApi, getCartApi } from "@/src/hook/useCart";
import { getProductDetailsApi } from "@/src/hook/useProductDetails";
import { getApprovedReviews, submitReview } from "@/src/hook/useReview";
import { decreaseProductQuantity, increaseProductQuantity } from "@/src/hook/useUpdateProduct";
import { addToWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist";
import { useGetProduct } from "@/src/utlis/userProduct";
import ReactPlayer from 'react-player'
import {
  ChevronRight,
  Heart,
  Loader,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import CustomLoader from '@/src/compronent/loading/CustomLoader';


const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const { data: wishlist } = useSelector((state) => state.wishlist);
  const cartItems = useSelector((state) => state.cart.items || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showVideo, setshowVideo] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  //review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewList, setReviewList] = useState([]);

  // Fetch all products for related products
  const productParams = useMemo(() => ({}), []);
  const { product: allProductsData } = useGetProduct(productParams);
  // console.log("product", allProductsData);

  const handleSubmitReview = async () => {
    // Check if user is logged in
    console.log("=== Review Submission Check ===");
    console.log("User object:", user);

    // Handle both _id (normal login) and id (Google login)
    const userId = user?._id || user?.id;
    console.log("User ID:", userId);

    if (!userId) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!reviewRating || !reviewText) {
      toast.error("Rating & comment required");
      return;
    }

    // Use params.id instead of product?.id to ensure we have the correct ID
    const productId = params?.id || product?.id;

    // console.log("Product ID from params:", params?.id);
    // console.log("Product ID from product:", product?.id);
    // console.log("Final Product ID:", productId);

    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    try {
      await submitReview(productId, {
        userId: userId,
        rating: reviewRating,
        comment: reviewText,
        status: "pending",
      });

      toast.success("Review submitted. Waiting for admin approval.");

      setReviewRating(0);
      setReviewText("");
      setShowReviewForm(false);

      // Refresh reviews list
      const data = await getApprovedReviews(productId);
      setReviewList(data);
    } catch (error) {
      console.error("=== Review Submission Failed ===");
      console.error("Error object:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit review";
      console.error("Error message to display:", errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getApprovedReviews(params?.id);
        setReviewList(data);

        const approveData = data.filter((review) => review.status === "approved");
        // console.log(approveData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [params?.id]);


  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailsApi(params.id);

        if (data) {
          // Normalize product data - handle all API fields
          const normalized = {
            id: data._id || data.id,
            name: data.productName || data.name || "Product",
            brand: data.brand || "Brand",
            price: Number(data.price ?? data.sell_price ?? 0) || 0,
            originalPrice: Number(data.oldPrice ?? data.mrp ?? data.price ?? 0) || 0,
            discount: Number(data.discount ?? 0) || 0,
            rating: Number(data?.ratings),
            reviews: Number(data.reviews ?? 0) || 0,
            images: data.images || ["/banner/img/placeholder.png"],
            sizes: data.productSize ? [data.productSize] : data.sizes || [],
            colors: Array.isArray(data.color) ? data.color : data.colors || [],
            stock: Number(data.productStock ?? data.stock ?? 0) || 0,
            description: data.description || data.productDescription || "",
            specifications: data.specifications || {},
            category: data.category,
            subCategory: data.subCategory,
            features: data.features || (Array.isArray(data.tags) ? data.tags : []),
            weight: Number(data.productWeight ?? 0) || 0,
            sizes: Array.isArray(data.productSize)
              ? data.productSize
              : typeof data.productSize === "string"
                ? data.productSize.split(",").map((s) => s.trim())
                : [],
            sku: data.sku || "",
            rank: Number(data.productRank ?? 0) || 0,
            featured: data.featured || false,
            publish: data.publish || true,
            tags: Array.isArray(data.tags) ? data.tags : [],
          };
          setProduct(normalized);
          if (normalized.colors?.length > 0) setSelectedColor(normalized.colors[0]);
          if (normalized.sizes?.length > 0) setSelectedSize(normalized.sizes[0]);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  // Filter related products from same subcategory
  useEffect(() => {
    if (!product || !allProductsData || !Array.isArray(allProductsData)) return;

    const normalized = allProductsData.map((p) => {
      let subCategoryVal = "general";
      if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
        const s0 = p.subCategory[0];
        subCategoryVal = typeof s0 === "string" ? s0 : s0?.name || String(s0);
      } else if (p.subCategory && typeof p.subCategory === "object") {
        subCategoryVal = p.subCategory.name || String(p.subCategory);
      } else if (p.subCategory) {
        subCategoryVal = String(p.subCategory);
      }

      return {
        id: p._id || p.id,
        name: p.name || p.productName || "Product",
        price: Number(p.price ?? p.sell_price ?? 0) || 0,
        originalPrice: Number(p.originalPrice ?? p.mrp ?? p.price ?? 0) || 0,
        image: p.image || p.images?.[0] || "/banner/img/placeholder.png",
        rating: Number(p.ratings),
        reviews: Number(p.reviews ?? 0) || 0,
        subCategory: subCategoryVal,
        discount: Number(p.discount ?? 0) || 0,
      };
    });

    // Get related products (same subcategory, max 6)
    const related = normalized
      .filter(
        (p) =>
          p.subCategory ===
          (typeof product.subCategory === "string"
            ? product.subCategory
            : product.subCategory?.name) && p.id !== product.id
      )
      .slice(0, 6);

    setRelatedProducts(related);
  }, [product, allProductsData]);

  const isWishlisted = product && (wishlist || []).some((i) => i.id === product.id);

  // Check if product is in cart
  const cartItem = cartItems.find(
    (item) => item.productId?._id === product?.id || item.productId?.id === product?.id
  );

  const toggleSize = (size) => {
    setSelectedSize(
      (prev) =>
        prev.includes(size)
          ? prev.filter((s) => s !== size) // remove
          : [...prev, size] // add
    );
  };
  const incrementQuantity = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    // If product is already in cart, update it
    if (cartItem && user?._id) {
      try {
        await increaseProductQuantity(user._id, product.id, quantity, dispatch);
        await getCartApi(user._id, dispatch);
        toast.success("Quantity updated");
      } catch (err) {
        console.error("Update cart error:", err);
        toast.error("Failed to update quantity");
      }
    }
  };

  const decrementQuantity = async () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);

    // If product is already in cart, update it
    if (cartItem && user?._id) {
      try {
        await decreaseProductQuantity(user._id, product.id, quantity, dispatch);
        await getCartApi(user._id, dispatch);
        toast.success("Quantity updated");
      } catch (err) {
        console.error("Update cart error:", err);
        toast.error("Failed to update quantity");
      }
    }
  };
  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (product?.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product?.colors?.length && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      await addToCartApi(
        {
          userId: user._id,
          productId: product.id,
          quantity,
          price: product.price,

          // ✅ IMPORTANT
          size: selectedSize,
          color: selectedColor,
          weight: product.weight || null,
        },
        dispatch
      );

      toast.success(`${product.name} added to cart`);
      await getCartApi(user._id, dispatch);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product.id, dispatch);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistApi(product.id, dispatch);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  // FIX product size array (API returns ["40,41,42,43,44"])
  const rawSizes = product?.productSize?.[0] || "";
  const cleanedSizes = rawSizes.split(",").map((s) => s.trim());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomLoader size="large" message="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg">{error || "Product not found"}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
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
          <button onClick={() => router.push("/")} className="hover:text-blue-600 hover:underline">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          {product?.category && (
            <>
              <button
                onClick={() => router.push("/shop")}
                className="hover:text-blue-600 hover:underline"
              >
                {typeof product.category === "string"
                  ? product.category
                  : product.category?.name || "Category"}
              </button>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          {product?.subCategory && (
            <>
              <span className="hover:text-blue-600 cursor-pointer hover:underline">
                {typeof product.subCategory === "string"
                  ? product.subCategory
                  : product.subCategory?.name || "Subcategory"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-semibold truncate">{product?.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl  group">
              <Image
                width={1200}
                height={1400}
                quality={95}
                src={product?.images?.[selectedImage]}
                alt={product?.name}
                className="w-full h-auto object-cover "
              />
              {product?.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  {Math.round(product.discount)}% OFF
                </div>
              )}
              <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${isWishlisted
                  ? "bg-red-500 text-white scale-110"
                  : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
            {/* details video section  */}

            <div className='flex gap-3'>
              <div className={`relative overflow-hidden rounded-lg transition-all duration-300 `}>
                {product?.video_link && <>
                  <img
                    src={product?.images[0] || []}
                    alt={`${product?.name} `}
                    className="w-20 h-20 object-cover"
                  />
                  <img onClick={() => setshowVideo(true)} src={product?.video_link} alt="" className="w-10 h-10 object-cover absolute  top-5 right-5 cursor-pointer" />

                  {/* details video  */}
                {showVideo && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn ">
                  <ReactPlayer
                    controls
                    light={<img
                      src={product?.images[0] || []}
                      alt={`${product?.name} `}
                      className=" w-96 h-96 rounded-xl md:rounded-2xl"
                    />}
                    playIcon={<img className='w-12 h-12 absolute rounded-full' src={"https://cdn-icons-png.freepik.com/256/13983/13983898.png?semt=ais_white_label"} />}
                    width={660}
                    height={315}
                    volume={0.5}
                    playing={true}
                    src={product?.video_link||"https://youtube.com/shorts/axcw2w7pKkk?si=-doija2AmzPRa_4v"}
                  />
                  <button onClick={() => setshowVideo(!showVideo)} className="text-xl bg-red-400 py-1 px-3 rounded-full absolute top-10 right-10 cursor-pointer">X</button>
                </div>}
                </>}
                
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {(product?.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${selectedImage === index
                      ? "ring-4 ring-blue-500 shadow-lg scale-105"
                      : "hover:scale-105 hover:shadow-md"
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                {product.brand}
              </p>

              {/* Category & SubCategory Info */}
              {(product?.category || product?.subCategory) && (
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  {product?.category && (
                    <p>
                      <span className="font-semibold">Category:</span>{" "}
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "Category"}
                    </p>
                  )}
                  {product?.subCategory && (
                    <p>
                      <span className="font-semibold">Subcategory:</span>{" "}
                      {typeof product.subCategory === "string"
                        ? product.subCategory
                        : product.subCategory?.name || "Subcategory"}
                    </p>
                  )}
                </div>
              )}

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
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({reviewList.length || product?.reviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-7">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ৳{product?.price?.toFixed(0) || 0}
              </span>
              <div>
                {product?.discount > 0 && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    {Math.round(product.discount)}% OFF
                  </div>
                )}
                <del className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                  Rs {product?.rank}
                </del>
              </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color: {selectedColor}</h3>
                <div className="flex space-x-3">
                  {product?.colors?.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border transition-all duration-300  ${selectedColor === color
                        ? "ring-4 ring-blue-300 scale-110"
                        : "hover:scale-110"
                        }`}
                      style={{
                        backgroundColor: color,
                        borderColor: 'black',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product?.sizes?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sizes</h3>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isActive = selectedSize === size;

                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize((prev) => (prev === size ? null : size))}
                        className={`
              flex items-center justify-center w-20
              h-8
              px-3 rounded-full font-semibold
              transition-all duration-300 border
              ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md scale-105"
                            : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:scale-105"
                          }
            `}
                      >
                        {size}

                        {isActive && (
                          <span className="text-white font-bold text-lg leading-none ml-1">✓</span>
                        )}
                      </button>
                    );
                  })}
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
                      Only <span className="font-semibold text-red-500">{product.stock} items</span>{" "}
                      left in stock!
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
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:shadow-lg hover:scale-102 cursor-pointer"
                  }`}
              >
                <ShoppingCart className="w-5 h-5 " />
                <span>{product?.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer">
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
                <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-300 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer">
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
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-300 ${activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6 break-words overflow-wrap-anywhere whitespace-pre-line">
                  {product?.description || "No description available"}
                </p>

                {product?.features?.length > 0 && (
                  <>
                    <h4 className="text-xl font-semibold mb-4">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {product?.tags?.length > 0 && (
                  <>
                    <h4 className="text-xl font-semibold mb-4">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display all product specifications and details */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Product Name:</span>
                  <span className="text-gray-600">{product?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="text-gray-600">{product?.sku || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span className="text-gray-600">
                    {product?.weight ? `${product.weight} g` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Size:</span>
                  <span className="text-gray-600">{product?.size || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Stock Available:</span>
                  <span
                    className={`font-semibold ${product?.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {product?.stock} items
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Rank:</span>
                  <span className="text-gray-600">{product?.rank || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Rating:</span>
                  <span className="text-gray-600">{product?.rating} / 5</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Discount:</span>
                  <span className="text-green-600 font-semibold">{product?.discount}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${product?.publish ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {product?.publish ? "Published" : "Unpublished"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Featured:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${product?.featured ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {product?.featured ? "Yes" : "No"}
                  </span>
                </div>
                {Object.entries(product?.specifications || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-900">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Summary */}
                <div className="text-center mb-10">
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
                    {product?.rating || 0} out of 5 stars
                  </h3>
                  <p className="text-center text-gray-700 text-base sm:text-lg mb-4">
                    Based on{" "}
                    <span className="font-semibold text-blue-500">
                      {reviewList.length || product?.reviews || 0}
                    </span>{" "}
                    customer reviews
                  </p>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-6 mb-12">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-wide">
                      Rate This Product
                    </h3>

                    {/* Comment */}
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your comment..."
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* ⭐ Rating */}
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`w-8 h-8 cursor-pointer transition ${star <= reviewRating
                            ? "text-yellow-400 fill-current scale-110"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-md transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                )}

                {/* Reviews Cards */}
                <div className="grid grid-cols-1 gap-6">
                  {reviewList
                    .filter((review) => review.status === "approved")
                    .map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-xl shadow-md py-10 px-5 flex flex-col gap-3 hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-md"
                      >
                        {/* Author */}
                        <div className="flex items-center gap-3">
                          {review.image ? (
                            <img
                              src={review.image}
                              alt={review.author || "Anonymous"}
                              className="w-12 h-12 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                              {review.userId?.name?.[0]?.toUpperCase() || "A"}
                            </div>
                          )}

                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {review.userId.name || "Anonymous"}
                          </h4>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-gray-600 text-sm sm:text-base">{review.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => router.push(`/productdetails/${relProduct.id}`)}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relProduct.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {relProduct.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600">
                      {relProduct.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(relProduct.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({relProduct.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-red-600">
                        ${relProduct.price.toFixed(2)}
                      </span>
                      {relProduct.originalPrice > relProduct.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${relProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/productdetails/${relProduct.id}`);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded font-semibold hover:bg-blue-700 transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
