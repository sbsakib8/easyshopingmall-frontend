"use client"
import Image from "next/image"
import { ProductGridSkeleton } from '@/src/compronent/loading/ProductGridSkeleton'
import { addToCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from "@/src/hook/useCart"
import { ProductDelete, ProductUpdate } from "@/src/hook/useProduct"
import { addToWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist"
import {
  fetchShopProducts,
  resetFilters,
  setCurrentPage,
  setDebouncedSearch,
  setFilterCategory,
  setFilterSubCategory,
  setPriceRange,
  setQuickViewProduct,
  setSortBy,
  setViewMode,
  syncFromUrl,
  toggleFilters
} from "@/src/redux/shopSlice"
import { getCategoryId, getSubCategoryId } from "@/src/utlis/filterHelpers"
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories"
import { useWishlist } from "@/src/utlis/useWishList"
import { ArrowUp, ChevronDown, Edit, Filter, Grid, Heart, List, Search, ShoppingCart, SlidersHorizontal, Star, Trash2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

// Helper function to determine if product is new or old
const isProductNew = (createdDate) => {
  if (!createdDate) return true // Default to new if no date
  const created = new Date(createdDate)
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return created > monthAgo
}



const ProductCard = React.memo(({ product, viewMode, router, toggleWishlist, wishlist, favorite, setFavorite, addToCart, user, handleEdit, setDeleteModal }) => {
  const dispatch = useDispatch();
  if (!product) return null;

  // Render Stars Helper
  const ratingValue = product.rating || product.ratings || 0;
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
          ? "text-yellow-400 fill-current"
          : "text-black"
          }`}
      />
    ));
  };

  return (
    <div
      onClick={() => {
        dispatch(setQuickViewProduct(product));
        router.push(`/productdetails/${product.id}`);
      }}
      className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
    >
      <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
        <Image
          src={product.image || "/img/product.jpg"}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "h-full" : "h-40 sm:h-44"}`}
        />

        {/* Badges */}
        <div className="absolute top-0 left-0 flex justify-between w-full">
          <div className="flex items-start">
            {product.isNew && (
              <span className="bg-btn-color text-accent-content px-1 py-1 rounded text-[8px] font-semibold">NEW</span>
            )}
            {product.retailSale > product.price ? <span className="bg-yellow-500 text-black px-1 py-1 mx-[2px] rounded text-[8px] font-semibold">
              -{(product.retailSale - product.price)}৳
            </span> : 0}
          </div>
          {product.productStatus && product.productStatus.length > 0 && !product.productStatus.includes("none") && (
            <span className={` ${product.productStatus.includes("hot") ? 'text-red-500' : 'text-blue-400 '} max-h-6  bg-black px-1 py-1 rounded-md text-xs font-bold`}>
              {Array.isArray(product.productStatus) ? product.productStatus[0] : product.productStatus}
            </span>
          )}
        </div>

        {/* Action Buttons (Wishlist) */}
        <div className={`absolute ${product.productStatus?.length > 0 ? "top-6" : "top-0"} bg-accent-content rounded-md right-0 space-y-2 transition-opacity duration-300`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product)
              // Local update for immediate feedback if needed, distinct from prop check
              if ((favorite && favorite.includes(product.id)) || (wishlist && wishlist.some(i => i.id === product.id))) {
                const removeItem = favorite ? favorite.filter(item => item !== product.id) : []
                return setFavorite(removeItem)
              }
              setFavorite([...favorite, product.id])
            }}
            className={`p-1 cursor-pointer rounded-lg transition-all duration-300
              ${(wishlist && wishlist.some((item) => item.id === product.id))
                ? "text-red-500 bg-red-100"
                : "text-gray-400 bg-bg hover:text-red-500 hover:bg-red-50"
              }`}
          >
            <Heart
              className="w-3 h-3"
              fill={(wishlist && wishlist.some((item) => item.id === product.id)) || (favorite && favorite.includes(product.id)) ? "red" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-accent-content px-3 py-1 rounded font-semibold text-xs">Out of Stock</span>
          </div>
        )}
      </div>

      <div className={`p-3 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
        <div>
          <h3 className={`font-semibold text-sm text-gray-800 mb-1 group-hover:text-secondary transition-colors duration-300 line-clamp-2`}>
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {renderStars(ratingValue)}
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
              <span className="text-xs font-semibold text-gray-400 line-through">
                {product.retailSale.toFixed(2)}
              </span>
            )}
          </div>

          {user?.role !== "ADMIN" ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                addToCart(product)
              }}
              disabled={!product.inStock}
              className={`w-full py-1.5 px-2 rounded font-medium transition-all duration-300 text-xs ${product.inStock
                ? "bg-btn-color text-accent-content hover:bg-btn-color/80 transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {product.inStock ? (
                <span className="flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                  Add to Cart
                </span>
              ) : ("Out of Stock")}
            </button>
          ) : (
            <div className="flex justify-around gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product)
                }}
                disabled={!product.inStock}
                className={`py-1.5 px-2 rounded font-medium transition-all duration-300 text-xs ${product.inStock
                  ? "bg-btn-color text-accent-content hover:bg-green-700 transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {product.inStock ? (
                  <span className="flex items-center justify-center gap-1">
                    <ShoppingCart size={16} />
                  </span>
                ) : (
                  "Out of Stock"
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(product)
                }}
                className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-accent-content rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteModal(product)
                }}
                className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-accent-content rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});


const ShopPage = ({ initialData, queryParams }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  // Get all filter states from Redux
  const shopState = useSelector((state) => state.shop)
  const {
    searchTerm,
    filterCategory,
    filterSubCategory,
    filterBrand,
    filterGender,
    priceRange,
    ratingFilter,
    sortBy,
    currentPage,
    viewMode,
    showFilters,
    products: reduxProducts,
    totalCount: reduxTotalCount,
    loading: productsLoading,
    error: productsError,
    debouncedSearchTerm
  } = shopState

  // Hydrate Redux with Server Data on Mount
  useEffect(() => {
    if (initialData) {
      // Dispatch actions to sync Redux with Server Data
      // We use a custom action type or existing ones. Assuming fetchShopProducts.fulfilled like behavior or direct setters.
      // For now, let's assume we can dispatch a hydration action or manually set data if your slice supports it.
      // If not, we'll rely on the Fallback Logic below for rendering.

      // However, to ensure filters work, we definitely need to populate Redux if it's empty.
      if (!reduxProducts.length && initialData.products?.length) {
        // Check if we have an action to set products directly. If not, this is a conceptual step.
        // Let's rely on the fallback below for view, but dispatch syncFromUrl to set filters.
      }
    }
  }, [initialData, reduxProducts.length]);

  // Sync URL params to Redux state on mount (Enhanced with Props)
  const urlSearch = queryParams?.search || searchParams?.get("search") || ""
  const urlCategory = queryParams?.category || searchParams?.get("category") || ""
  const urlSubCategory = queryParams?.subcategory || searchParams?.get("subcategory") || ""
  const urlBrand = queryParams?.brand || searchParams?.get("brand") || ""
  const urlGender = queryParams?.gender || searchParams?.get("gender") || ""
  const urlMinPrice = queryParams?.minPrice || searchParams?.get("minPrice")
  const urlMaxPrice = queryParams?.maxPrice || searchParams?.get("maxPrice")
  const urlRating = queryParams?.rating || searchParams?.get("rating")
  const urlSortBy = queryParams?.sortBy || searchParams?.get("sortBy") || ""
  const urlPage = queryParams?.page || searchParams?.get("page")

  useEffect(() => {
    dispatch(syncFromUrl({
      search: urlSearch,
      category: urlCategory,
      subcategory: urlSubCategory,
      brand: urlBrand,
      gender: urlGender,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      rating: urlRating,
      sortBy: urlSortBy,
      page: urlPage
    }))
  }, [dispatch]) // Only run on mount to sync initial URL -> Redux

  // Update URL when Filters Change (Redux -> URL)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (filterCategory !== "all") params.set("category", filterCategory);
    if (filterSubCategory !== "all") params.set("subcategory", filterSubCategory);
    if (filterBrand !== "all") params.set("brand", filterBrand);
    if (filterGender !== "all") params.set("gender", filterGender);
    if (sortBy !== "name") params.set("sortBy", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (ratingFilter > 0) params.set("rating", ratingFilter.toString());
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }

    // Replace current URL without reloading page
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    debouncedSearchTerm,
    filterCategory,
    filterSubCategory,
    filterBrand,
    filterGender,
    sortBy,
    currentPage,
    ratingFilter,
    priceRange,
    router
  ]);


  // Use server products directly from Redux OR Fallback to Initial Data
  // This ensures the user sees the cached server data immediately before Redux takes over
  const currentProducts = reduxProducts?.length > 0 || productsLoading ? reduxProducts : (initialData?.products || [])
  
  const totalCount = reduxTotalCount > 0 || productsLoading ? reduxTotalCount : (initialData?.totalCount || 0)

  // Local component state
  const [deleteModal, setDeleteModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [favorite, setFavorite] = useState([])
  const [showCategory, setShowCategory] = useState(false)
  const [showSubCategory, setShowSubCategory] = useState(false)
  const productsPerPage = 100

  // Optimize Redux Selectors to avoid new references
  const reduxCartItems = useSelector((state) => state.cart.items) || []; // Default outside selector
  const reduxCart = useMemo(() => reduxCartItems, [reduxCartItems]);

  // Normalize redux cart items for UI
  const cart = useMemo(() => {
    return (reduxCart || []).map((item) => {
      if (item?.productId) {
        const prod = item.productId
        return {
          id: prod._id || prod.id || String(prod?._id || prod?.id || ""),
          name: prod.productName || prod.name || prod.title || "Product",
          image: prod.images?.[0] || prod.image || "/images/placeholder.png",
          price: Number(prod.price ?? prod.sell_price ?? prod.amount) || 0,
          quantity: item.quantity || 1,
          brand: prod.brand || prod.manufacturer || "",
        }
      }

      return {
        id: item.id || item._id || "",
        name: item.name || item.productName || "Product",
        image: item.image || item.images?.[0] || "/images/placeholder.png",
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        brand: item.brand || "",
      }
    })
  }, [reduxCart])
  const user = useSelector((state) => state.user?.data)
  const { wishlist } = useWishlist()

  // Fetch categories and subcategories from API
  const { categories: apiCategories, subcategories: apiSubcategories, loading: categoriesLoading } = useCategoryWithSubcategories()

  // Load cart for logged-in user
  useEffect(() => {
    if (user?._id) {
      getCartApi(user._id, dispatch)
    }
  }, [user, dispatch])

  const totalPages = Math.ceil(totalCount / productsPerPage)

  // Fetch products when any filter changes
  useEffect(() => {
    const fetchParams = {
      search: debouncedSearchTerm,
      categoryId: getCategoryId(filterCategory, apiCategories),
      subCategoryId: getSubCategoryId(filterSubCategory, apiSubcategories),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy,
      page: currentPage,
      limit: productsPerPage,
      brand: filterBrand,
      rating: ratingFilter,
      gender: filterGender,
    };

    dispatch(fetchShopProducts(fetchParams));
  }, [
    dispatch,
    debouncedSearchTerm,
    filterCategory,
    filterSubCategory,
    priceRange,
    sortBy,
    currentPage,
    filterBrand,
    ratingFilter,
    filterGender,
    apiCategories,
    apiSubcategories
  ]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(searchTerm));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Add to cart (uses API + redux)
  const addToCart = useCallback(async (product) => {
    console.log(product)
    if(product.size.length && product.color.length ){
      toast.error("Please select size and color")
      return
    }
    if (!user?._id) {
      toast.error("Please sign in to add items to cart")
      return
    }

    try {
      await addToCartApi(
        {
          userId: user._id,
          productId: product.id,
          quantity: 1,
          price: product.price,
        },
        dispatch,
      )
      toast.success(`${product.name} added to cart`)
      // refresh cart
      await getCartApi(user._id, dispatch)
    } catch (err) {
      console.error("Add to cart error:", err)
      const msg = err?.response?.data?.message || "Failed to add to cart"
      toast.error(msg)
    }
  }, [user?._id, dispatch]);

  // Remove from cart (uses API + redux)
  const removeFromCart = useCallback(async (productId) => {
    if (!user?._id) {
      // optimistic local fallback (should rarely happen)
      return
    }
    try {
      await removeCartItemApi(user._id, productId, dispatch)
      toast.success("Removed from cart")
      await getCartApi(user._id, dispatch)
    } catch (err) {
      console.error("Remove from cart error:", err)
      toast.error("Failed to remove item")
    }
  }, [user?._id, dispatch]);

  // Update quantity (API + redux)
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!user?._id) {
      return
    }
    if (newQuantity === 0) {
      await removeFromCart(productId)
      return
    }
    try {
      await updateCartItemApi({ userId: user._id, productId, quantity: newQuantity }, dispatch)
      await getCartApi(user._id, dispatch)
    } catch (err) {
      console.error("Update cart quantity error:", err)
      toast.error("Failed to update quantity")
    }
  }, [user?._id, dispatch, removeFromCart]);

  // Toggle wishlist (uses API + redux)
  const toggleWishlist = useCallback(async (product) => {
    if (!user?._id) {
      toast.error("Please sign in to add to wishlist")
      return
    }
    try {
      const exists = (wishlist || []).some((i) => i.id === product.id || favorite.includes(product.id))
      if (exists) {
        await removeFromWishlistApi(product.id, dispatch)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlistApi(product.id, dispatch)
        toast.success("Added to wishlist")
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err)
      toast.error("Failed to update wishlist")
    }
  }, [wishlist, favorite, dispatch]);

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate which page numbers to show (using server-side totalPages)
  const getPageNumbers = () => {
    const pages = [];

    if (currentPage <= 5) {
      // Show pages 1-5 when on pages 1-5
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
      }
    } else {
      // When current page > 5, shift the range
      // Start from (currentPage - 4) to show 5 pages with current page at position 5
      const startPage = currentPage - 4;
      for (let i = startPage; i <= Math.min(startPage + 4, totalPages); i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showStartDots = currentPage > 5;
  const showEndDots = pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages;

  // Use API categories if available, otherwise fall back to product categories
  const categories = apiCategories.length > 0
    ? ["all", ...apiCategories.map(cat => cat.name)]
    : ["all"]

  const subCategories = apiSubcategories.length > 0
    ? (filterCategory === "all"
      ? ["all", ...apiSubcategories.map(sub => sub.name)]
      : ["all", ...apiSubcategories
        .filter(sub => {
          const category = apiCategories.find(cat => cat.id === sub.categoryId || cat.id === sub.categoryId?._id)
          return category?.name === filterCategory
        })
        .map(sub => sub.name)])
    : ["all"]

  const brands = ["all"] // Can be populated from API if needed
  const genders = ["all", "men", "women", "unisex"]

  const clearFilters = () => {
    dispatch(resetFilters())
    router.push('/shop')
  }
  // handle delete functionality 
  const confirmDelete = async () => {

    try {
      if (!deleteModal) return;
      await ProductDelete(deleteModal.id);
      setDeleteModal(null);
      dispatch(fetchShopProducts({
        search: debouncedSearchTerm,
        categoryId: getCategoryId(filterCategory, apiCategories),
        subCategoryId: getSubCategoryId(filterSubCategory, apiSubcategories),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy: sortBy,
        page: currentPage,
        limit: productsPerPage,
        brand: filterBrand,
        rating: ratingFilter,
        gender: filterGender,
      })); // Refetch filtered products
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const [load, setLoad] = useState(false);
  // handle edit functionality 
  const handleEdit = useCallback((p) => {
    const selectedProudct = currentProducts.find(item => item.id == p.id)
    setEditModal(selectedProudct)

  }, [currentProducts])

  const saveEdit = async () => {
    setLoad(true);
    try {
      // Transform normalized product back to backend format
      const updatePayload = {
        _id: editModal.id || editModal._id, // Backend expects _id
        productName: editModal.name,
        price: editModal.price,
        productRank: editModal.retailSale,
        productStatus: editModal.productStatus || [],
        brand: editModal.brand,
        description: editModal.description,
        productSize: editModal.size,
        color: editModal.color,
        discount: editModal.discount,
        ratings: editModal.rating,
        productStock: editModal.stock,
        video_link: editModal.video_link,
      };

      const res = await ProductUpdate(updatePayload);
      if (res.success) {
        toast.success("Product updated successfully!");
        dispatch(fetchShopProducts({
          search: debouncedSearchTerm,
          categoryId: getCategoryId(filterCategory, apiCategories),
          subCategoryId: getSubCategoryId(filterSubCategory, apiSubcategories),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy: sortBy,
          page: currentPage,
          limit: productsPerPage,
          brand: filterBrand,
          rating: ratingFilter,
          gender: filterGender,
        })); // Refetch filtered products
        setEditModal(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoad(false);
    }
  };
  const updateEditField = (field, value) => {
    setEditModal({ ...editModal, [field]: value });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Filter Bar */}
        <div className="bg-white lg:mt-28 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-gray-600 font-medium">Showing {totalCount} results</span>
              {/* Quick Filters */}

            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-secondary bg-white"
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
                  onClick={() => dispatch(setViewMode("grid"))}
                  className={`p-2 transition-colors duration-300 ${viewMode === "grid" ? "bg-secondary text-accent-content" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => dispatch(setViewMode("list"))}
                  className={`p-2 transition-colors duration-300 ${viewMode === "list" ? "bg-secondary text-accent-content" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 ">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => dispatch(toggleFilters())}
              className="lg:hidden w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
            >
              <span className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </span>
              <Filter className="w-5 h-5" />
            </button>

            <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
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
                      onChange={(e) => dispatch(setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]]))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => dispatch(setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 300]))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="300"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => dispatch(setPriceRange([priceRange[0], Number.parseInt(e.target.value)]))}
                    className="w-full accent-secondary"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Price: Tk {priceRange[0]} — Tk {priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div onClick={() => setShowCategory(!showCategory)} className="bg-white px-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="flex justify-between font-bold items-center text-lg mb-4 text-gray-800 border lg:border-none mt-3 p-2 rounded-xl">Product Categories <span className={`${showCategory ? "" : "rotate-180"} lg:hidden`}><ArrowUp /></span> </h3>
                <div className={`space-y-2 ${categories.length > 4 ? 'max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-gray-200' : ''}`}>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className={` items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer ${showCategory ? "flex" : "hidden"} lg:flex`}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === category}
                        onChange={() => {
                          dispatch(setFilterCategory(category))
                          dispatch(setFilterSubCategory("all"))
                          setShowSubCategory(true)
                          setShowCategory(false)
                        }}
                        className="text-secondary focus:ring-secondary"
                      />
                      <span className="capitalize text-gray-700">
                        {category === "all" ? "All Categories" : category.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {subCategories.length > 1 && (
                <div className={`bg-white p-6 rounded-lg shadow-md ${showSubCategory & !showCategory ? "block" : "hidden"} lg:block`}>
                  <h3 className="font-bold text-lg mb-4 text-gray-800 flex justify-between ">Subcategories
                    <span className="lg:hidden">
                      <X onClick={() => setShowSubCategory(false)} size={30} />
                    </span>
                  </h3>
                  <div className={`space-y-2 ${subCategories.length > 4 ? 'max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-gray-200' : ''}`}>
                    {subCategories.map((subcat) => (
                      <label
                        key={subcat}
                        className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          checked={filterSubCategory === subcat}
                          onChange={() => dispatch(setFilterSubCategory(subcat))}
                          className="text-secondary focus:ring-secondary"
                        />
                        <span className="capitalize text-gray-700">
                          {subcat === "all" ? "All Subcategories" : subcat.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {productsLoading && (
              <ProductGridSkeleton count={productsPerPage} viewMode={viewMode} />
            )}

            {/* Error State */}
            {!productsLoading && productsError && (
              <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg border border-red-200 mb-6">
                <p className="font-semibold mb-2 text-lg italic">Error loading products!</p>
                <p className="text-sm mb-4">{productsError.message || "Check your internet or try again."}</p>
                <button
                  onClick={() => dispatch(fetchShopProducts({
                    search: debouncedSearchTerm,
                    categoryId: getCategoryId(filterCategory, apiCategories),
                    subCategoryId: getSubCategoryId(filterSubCategory, apiSubcategories),
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    sortBy: sortBy,
                    page: currentPage,
                    limit: productsPerPage,
                    brand: filterBrand,
                    rating: ratingFilter,
                    gender: filterGender,
                  }))}
                  className="bg-red-500 hover:bg-red-600 text-accent-content px-6 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* No Products Found */}
            {!productsLoading && currentProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-secondary text-accent-content px-6 py-2 rounded-lg hover:bg-secondary transition-colors duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products */}
            {!productsLoading && currentProducts.length > 0 && (
              <div
                className={`${viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
                  : "space-y-6"
                  }`}
              >
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    router={router}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                    favorite={favorite}
                    setFavorite={setFavorite}
                    addToCart={addToCart}
                    user={user}
                    handleEdit={handleEdit}
                    setDeleteModal={setDeleteModal}
                  />
                ))}
              </div>
            )}



            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-secondary text-accent-content hover:bg-secondary"
                    }`}
                >
                  Previous
                </button>

                {/* First Page + Dots (if needed) */}
                {showStartDots && (
                  <>
                    <button
                      onClick={() => dispatch(setCurrentPage(1))}
                      className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 hover:bg-purple-50 transition-colors duration-300"
                    >
                      1
                    </button>
                    <span className="px-2 text-gray-500 font-bold">...</span>
                  </>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => dispatch(setCurrentPage(page))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === page
                      ? "bg-secondary text-accent-content transform scale-110"
                      : "bg-white border border-gray-300 hover:bg-purple-50"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* End Dots + Last Page (if needed) */}
                {showEndDots && (
                  <>
                    <span className="px-2 text-gray-500 font-bold">...</span>
                    <button
                      onClick={() => dispatch(setCurrentPage(totalPages))}
                      className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 hover:bg-purple-50 transition-colors duration-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Next Button */}
                <button
                  onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-secondary text-accent-content hover:bg-secondary"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {
        editModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-accent-content flex items-center gap-2">
                  <Edit className="w-6 h-6" />
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-accent-content cursor-pointer" />
                </button>
              </div>

              <div className="p-6 bg-white/90 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block  text-sm font-semibold mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editModal?.productName}
                      onChange={(e) => updateEditField("productName", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg  focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">SKU</label>
                    <input
                      type="text"
                      value={editModal?.sku}
                      onChange={(e) => updateEditField("sku", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">Brand</label>
                    <input
                      type="text"
                      value={editModal?.brand}
                      onChange={(e) => updateEditField("brand", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      value={editModal?.price}
                      onChange={(e) => updateEditField("price", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={editModal?.discount}
                      onChange={(e) => updateEditField("discount", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">Stock</label>
                    <input
                      type="number"
                      value={editModal?.productStock}
                      onChange={(e) => updateEditField("productStock", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editModal?.ratings}
                      onChange={(e) => updateEditField("ratings", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Product Size
                    </label>
                    <input
                      type="text"
                      value={editModal?.productSize?.join(", ") || ""}
                      onChange={(e) =>
                        updateEditField(
                          "productSize",
                          e.target.value.split(",").map((s) => s.trim())
                        )
                      }
                      placeholder="M, L, XL"
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Product Color
                    </label>
                    <input
                      type="text"
                      value={editModal?.color?.join(", ") || ""}
                      onChange={(e) =>
                        updateEditField(
                          "color",
                          e.target.value.split(",").map((c) => c.trim())
                        )
                      }
                      placeholder="Black, Brown, Red"
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>


                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Retail Price(৳)
                    </label>
                    <input
                      type="number"
                      value={editModal?.productRank || ""}
                      onChange={(e) => updateEditField("productRank", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm font-semibold mb-2">
                      Product Status
                    </label>
                    <select
                      defaultValue={editModal.productStatus.length > 0 ? editModal.productStatus[0] : "none"}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateEditField("productStatus", val === "none" ? [] : [val]);
                      }}
                      className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-secondary bg-white"
                    >
                      <option disabled selected defaultValue={editModal.productStatus.length > 0 ? editModal.productStatus[0] : "none"}>{editModal.productStatus.length > 0 ? editModal.productStatus[0] : "none"}</option>
                      <option defaultValue="none">none</option>
                      <option defaultValue="hot">hot</option>
                      <option defaultValue="cold">cold</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-black text-sm font-semibold mb-2">
                      Video Link
                    </label>
                    <input
                      value={editModal?.video_link || "https://youtube.com/shorts/example_video"}
                      onChange={(e) => updateEditField("video_link", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    ></input>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-black text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={editModal?.description}
                      onChange={(e) => updateEditField("description", e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-slate-500/20 border border-slate-600 rounded-lg text-black focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-accent-content font-semibold rounded-lg transition-all transform hover:scale-105"
                  >
                    {load ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditModal(null)}
                    className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {
        deleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/70 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-500/20 rounded-full">
                  <Trash2 className="w-8 h-8 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold ">Delete Product</h2>
              </div>

              <p className=" mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-accent-content font-semibold rounded-lg transition-all transform hover:scale-105 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-600 hover:text-accent-content font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom Scrollbar Styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #a855f7;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9333ea;
        }
        
        /* Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #e5e7eb;
        }
      `}</style>
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

export default ShopPage;
