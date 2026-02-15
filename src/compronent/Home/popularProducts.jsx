"use client";
import {
  ArrowDown,
  ArrowUp,
  Heart,
  Search,
  ShoppingCart,
  Sparkles,
  Star
} from "lucide-react";
import CustomLoader from '@/src/compronent/loading/CustomLoader';
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// 🧠 Import your hooks
import { addToCartApi } from "../../hook/useCart";
import {
  addToWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
} from "../../hook/useWishlist";
import { useGetcategory } from "../../utlis/usecategory";
import { useGetProduct } from "../../utlis/userProduct";
import { useCategoryWithSubcategories } from "../../utlis/useCategoryWithSubcategories";
import { useWishlist } from "@/src/utlis/useWishList";
import Button from "@/src/helper/Buttons/Button";

// Helper function to determine if product is new or old
const isProductNew = (createdDate) => {
  if (!createdDate) return true; // Default to new if no date
  const created = new Date(createdDate);
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return created > monthAgo;
};

const PopularProducts = ({ initialData }) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [localWishlist, setLocalWishlist] = useState(new Set());


  const dispatch = useDispatch();
  const { data: wishlistItems } = useSelector((state) => state?.wishlist?.data);
  const { wishlist } = useWishlist()
  const user = useSelector((state) => state.user.data);

  const productParams = useMemo(() => ({ page: 1, limit: 1000, search: "" }), []);

  // ✅ Fetch data dynamically (same as shop component)
  const { category: apiCategory, loading: categoryLoading } = useGetcategory();
  const { product: apiProduct, loading: productLoading, error } = useGetProduct(productParams);

  // ✅ Fetch categories and subcategories from API (same as shop)
  const { categories: shopCategoriesApi, subcategories: shopSubcategoriesApi, loading: shopCategoriesLoading } = useCategoryWithSubcategories();

  const [category, setCategory] = useState(initialData?.categories || null);
  const [product, setProduct] = useState(initialData?.products || null);
  const [shopCategories, setShopCategories] = useState(initialData?.categories || null);
  const [shopSubcategories, setShopSubcategories] = useState(initialData?.subcategories || null);

  useEffect(() => {
    if (apiCategory) setCategory(apiCategory);
    if (apiProduct) setProduct(apiProduct);
    if (shopCategoriesApi) setShopCategories(shopCategoriesApi);
    if (shopSubcategoriesApi) setShopSubcategories(shopSubcategoriesApi);
  }, [apiCategory, apiProduct, shopCategoriesApi, shopSubcategoriesApi]);



  // ✅ Fetch wishlist once (for logged-in user)
  useEffect(() => {
    getWishlistApi(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setLocalWishlist(new Set((wishlist || []).map((item) => item.id)));
  }, [wishlist]);



  const loading = !initialData && (categoryLoading || productLoading || shopCategoriesLoading);

  // 🧩 Merge structured dataset using shop categories
  const mergedData = useMemo(() => {
    if (!product || !shopCategories) return { products: [], categories: [] };

    // Use shop categories instead of old category data
    const categories = shopCategories.map((c) => ({
      id: c.name?.toUpperCase(),
      name: c.name?.toUpperCase(),
      icon: c.icon || <Sparkles className="w-4 h-4" />,
      color: c.color || "from-slate-500 to-gray-600",
    }));

    const products = product.map((p) => {
      // Handle category - can be array or object
      let categoryName = "GENERAL";
      if (Array.isArray(p.category) && p.category.length > 0) {
        const cat = p.category[0];
        categoryName = (typeof cat === 'string' ? cat : cat?.name)?.toUpperCase() || "GENERAL";
      } else if (typeof p.category === 'object' && p.category?.name) {
        categoryName = p.category.name?.toUpperCase() || "GENERAL";
      } else if (typeof p.category === 'string') {
        categoryName = p.category.toUpperCase();
      }

      // Handle subcategory
      let subCategoryName = null;
      if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
        const subCat = p.subCategory[0];
        subCategoryName = (typeof subCat === 'string' ? subCat : subCat?.name)?.toUpperCase() || null;
      } else if (typeof p.subCategory === 'object' && p.subCategory?.name) {
        subCategoryName = p.subCategory.name?.toUpperCase() || null;
      } else if (typeof p.subCategory === 'string') {
        subCategoryName = p.subCategory.toUpperCase();
      }

      return {
        id: p._id,
        name: p.productName,
        image: p.images?.[0] || "",
        price: p.price,
        originalPrice: p.oldPrice || p.price,
        rating: p.ratings,
        productStatus: p.productStatus,
        retailSale: p.productRank,
        reviews: p.reviews,
        category: categoryName,
        subCategory: subCategoryName,
        badge: p.tags?.[0] || "New",
        isNew: isProductNew(p.createdAt || p.created_at || p.createdDate),
        discount: p.discount || (p.oldPrice && p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0),
      };
    });

    return { products, categories };
  }, [product, shopCategories]);

  const currentProducts = useMemo(() => {
    if (activeCategory === "ALL") {
      // When ALL is selected, get 5 products from each subcategory within each category
      const productsByCategory = {};

      mergedData.products.forEach(p => {
        if (!productsByCategory[p.category]) {
          productsByCategory[p.category] = {};
        }

        const subCatKey = p.subCategory || 'NO_SUBCATEGORY';
        if (!productsByCategory[p.category][subCatKey]) {
          productsByCategory[p.category][subCatKey] = [];
        }
        productsByCategory[p.category][subCatKey].push(p);
      });

      // Take 5 products from each subcategory within each category
      const result = [];
      Object.keys(productsByCategory).forEach(catName => {
        const subcategories = productsByCategory[catName];
        Object.keys(subcategories).forEach(subCatName => {
          const productsInSubCat = subcategories[subCatName];
          result.push(...productsInSubCat.slice(0, 5));
        });
      });



      return result;
    }

    // When a specific category is selected, get 5 products from each subcategory
    const categoryProducts = mergedData.products.filter((p) => p.category === activeCategory);

    // Group by subcategory
    const productsBySubCategory = {};
    categoryProducts.forEach(p => {
      const subCatKey = p.subCategory || 'NO_SUBCATEGORY';
      if (!productsBySubCategory[subCatKey]) {
        productsBySubCategory[subCatKey] = [];
      }
      productsBySubCategory[subCatKey].push(p);
    });

    // Take 5 products from each subcategory
    const result = [];
    Object.keys(productsBySubCategory).forEach(subCatName => {
      const productsInSubCat = productsBySubCategory[subCatName];
      result.push(...productsInSubCat.slice(0, 5));
    });

    return result;
  }, [mergedData.products, activeCategory]);

  const filteredProducts = useMemo(() => {
    const filtered = currentProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Limit to 100 products for home page to show all categories

    return filtered.slice(0, 100);
  }, [currentProducts, searchTerm]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
          ? "text-yellow-400 fill-current"
          : "text-gray-300"
          }`}
      />
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      Trending: "bg-gradient-to-r from-pink-500 to-rose-500",
      Hot: "bg-gradient-to-r from-red-500 to-orange-500",
      New: "bg-gradient-to-r from-green-500 to-emerald-500",
      Sale: "bg-gradient-to-r from-purple-500 to-violet-500",
      Bestseller: "bg-gradient-to-r from-blue-500 to-indigo-500",
      Featured: "bg-gradient-to-r from-amber-500 to-yellow-500",
      Premium: "bg-gradient-to-r from-gray-700 to-gray-900",
      Popular: "bg-gradient-to-r from-teal-500 to-cyan-500",
      Sport: "bg-gradient-to-r from-orange-500 to-red-500",
      Luxury: "bg-gradient-to-r from-purple-600 to-pink-600",
      Organic: "bg-gradient-to-r from-green-600 to-lime-600",
      Eco: "bg-gradient-to-r from-emerald-600 to-teal-600",
      Smart: "bg-gradient-to-r from-indigo-600 to-blue-600",
      Exclusive: "bg-gradient-to-r from-violet-600 to-purple-600",
    };
    return colors[badge] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const toggleWishlist = async (id) => {
    if (!user?._id) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    // Instant UI
    setLocalWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });

    try {
      const isInWishlist = localWishlist.has(id);

      if (isInWishlist) {
        await removeFromWishlistApi(id, dispatch);
      } else {
        await addToWishlistApi(id, dispatch);
      }

      // Sync with Redux (backend truth)
      await getWishlistApi(dispatch);

    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user?._id) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCartApi(
        {
          userId: user._id,
          productId: product.id,
          quantity: 1,
          price: product.price,
        },
        dispatch
      );
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      const msg = err?.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomLoader size="large" message="Loading products..." />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-red-500">
        Error loading products
      </div>
    );

  return (
    <div className="min-h-screen bg-bg">
      {/* Header & Categories */}
      <div className=" backdrop-blur-lg border-b border-white/20 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6 animate-[fadeInUp_0.6s_ease-out]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Popular Products
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover amazing products across all categories
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6 animate-[slideInUp_0.6s_ease-out]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`flex sm:hidden items-center space-x-2 px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === "ALL"
                ? "bg-secondary text-accent-content shadow-lg"
                : "bg-accent-content hover:bg-white/90 border border-gray-200"
                } mb-5 md:mb-0 gap-2`}
            >
              {showCategories ? "Hide" : "Show"} Categories
              {showCategories ? <ArrowUp color="white" /> : <ArrowDown color="white" />}

            </button>
          </div>

          <div className={` ${showCategories ? "flex" : "hidden"} sm:flex flex-col sm:flex-row sm:flex-wrap overflow-x-auto pt-20 sm:pt-0 justify-center gap-2 sm:gap-3 animate-[fadeInUp_0.8s_ease-out] max-h-60 sm:max-h-full scroll-auto `}>
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`flex items-center space-x-2 px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === "ALL"
                ? "bg-secondary text-accent-content shadow-lg"
                : "bg-accent-content hover:bg-white/90 border border-gray-200"
                }`}
            >
              All
            </button>
            {mergedData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? `bg-secondary text-accent-content shadow-lg`
                  : "bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200"
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className=" bg-base-300 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 container mx-auto px-3 sm:px-6 lg:px-8 py-8">
          {filteredProducts.map((product) => (
            <Link
              href={`/productdetails/${product.id}`}
              key={product.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-0 left-0 flex justify-between w-full">
                  <div className="flex items-start">
                    {product.isNew && (
                      <span className="bg-green-500 text-accent-content px-1 py-1 rounded text-[8px] font-semibold">NEW</span>
                    )}
                    {product.retailSale > product.price ? <span className="bg-yellow-500 text-black px-1 py-1 mx-[2px] rounded text-[8px] font-semibold">
                      -{(product.retailSale - product.price)}৳
                    </span> : 0}
                  </div>
                  {product.productStatus?.length > 0 && (
                    <span className={` ${product.productStatus.includes("hot") ? 'text-red-500' : 'text-blue-400 '} max-h-6  bg-black px-1 py-1 rounded-md text-xs font-bold ${product.productStatus.includes("none") ? 'hidden' : ''}`}>{product.productStatus}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`absolute ${product.productStatus?.length > 0 ? "top-6" : "top-0"}  bg-white rounded-md right-0 space-y-2 transition-opacity duration-300`}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id); // Call our fixed toggle function
                    }}
                    className={`p-2 cursor-pointer rounded-lg transition-all duration-300
      ${localWishlist.has(product.id)
                        ? "text-red-500 bg-red-100"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                  >
                    <Heart
                      className="w-3 h-3"
                      fill={localWishlist.has(product.id) ? "red" : "none"}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500">({product.rating})</span>
                  </div>
                </div>

                <div>
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold text-red-600">
                      Tk {product.price}
                    </span>
                    {product.retailSale > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        Tk {product.retailSale.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full py-1.5 px-2 rounded font-medium transition-all duration-300 text-xs bg-btn-color text-accent-content hover:bg-green-700 transform hover:scale-105 cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* ✨ Animations + Glassmorphism + Scrollbar Hide */}
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
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PopularProducts;
