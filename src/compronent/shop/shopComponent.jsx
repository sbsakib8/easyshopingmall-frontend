"use client"
import { addToCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from "@/src/hook/useCart"
import { addToWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist"
import { useGetProduct } from "@/src/utlis/userProduct"
import { useWishlist } from "@/src/utlis/useWishList"
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories"
import { ArrowUp, ChevronDown, Edit, Filter, Grid, Heart, List, Search, ShoppingCart, SlidersHorizontal, Star, Trash2, X } from "lucide-react"
import { CardSkeleton } from '@/src/compronent/loading/Skeleton'
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { ProductDelete, ProductUpdate } from "@/src/hook/useProduct"
import { useDispatch, useSelector } from "react-redux"

// Helper function to determine if product is new or old
const isProductNew = (createdDate) => {
  if (!createdDate) return true // Default to new if no date
  const created = new Date(createdDate)
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return created > monthAgo
}

import {
  setSearchTerm,
  setDebouncedSearch,
  setFilterCategory,
  setFilterSubCategory,
  setFilterBrand,
  setFilterGender,
  setPriceRange,
  setRatingFilter,
  setSortBy,
  setCurrentPage,
  setViewMode,
  toggleFilters,
  resetFilters,
  syncFromUrl
} from "@/src/redux/shopSlice"

const ShopPage = ({ initialData, queryParams }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Redux state
  const dispatch = useDispatch()
  const shopState = useSelector((state) => state.shop)
  const {
    searchTerm,
    debouncedSearchTerm,
    filterCategory,
    filterSubCategory,
    filterBrand,
    filterGender,
    priceRange,
    ratingFilter,
    sortBy,
    currentPage,
    viewMode,
    showFilters
  } = shopState

  const urlSearch = searchParams?.get("search") || ""
  const urlCategory = searchParams?.get("category") || ""
  const urlSubCategory = searchParams?.get("subcategory") || ""

  const [deleteModal, setDeleteModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [apiCategoriesState, setApiCategoriesState] = useState(initialData?.categories || [])
  const [apiSubcategoriesState, setApiSubcategoriesState] = useState(initialData?.subcategories || [])

  const [showCategory, setShowCategory] = useState(false)
  const [showSubCategory, setShowSubCategory] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const productsPerPage = 30

  const user = useSelector((state) => state.user.data)
  const reduxCart = useSelector((state) => state.cart.items || [])
  const { wishlist } = useWishlist()

  // Sync initial URL params to Redux
  useEffect(() => {
    dispatch(syncFromUrl({
      search: urlSearch,
      category: urlCategory,
      subcategory: urlSubCategory,
      sortBy: searchParams?.get("sortBy") || "name"
    }))
  }, [])

  // Normalize redux cart items for UI
  const normalizedCart = useMemo(() => {
    return (reduxCart || []).map((item) => {
      if (item?.productId) {
        const prod = item.productId
        return {
          id: prod._id || prod.id || String(prod?._id || prod?.id || ""),
          name: prod.productName || prod.name || prod.title || "Product",
          image: prod.images?.[0] || prod.image || "/banner/img/placeholder.png",
          price: Number(prod.price ?? prod.sell_price ?? prod.amount) || 0,
          quantity: item.quantity || 1,
          brand: prod.brand || prod.manufacturer || "",
        }
      }

      return {
        id: item.id || item._id || "",
        name: item.name || item.productName || "Product",
        image: item.image || item.images?.[0] || "/banner/img/placeholder.png",
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        brand: item.brand || "",
      }
    })
  }, [reduxCart])

  // Map URL names to IDs for backend filtering
  const currentCategoryId = useMemo(() => {
    if (!filterCategory || filterCategory === "all") return null;
    const cat = apiCategoriesState.find(c =>
      c.name?.toLowerCase() === filterCategory.toLowerCase() ||
      c.slug?.toLowerCase() === filterCategory.toLowerCase()
    );
    return cat?.id || cat?._id || null;
  }, [filterCategory, apiCategoriesState]);

  const currentSubCategoryId = useMemo(() => {
    if (!filterSubCategory || filterSubCategory === "all") return null;
    const sub = apiSubcategoriesState.find(s =>
      s.name?.toLowerCase() === filterSubCategory.toLowerCase() ||
      s.slug?.toLowerCase() === filterSubCategory.toLowerCase()
    );
    return sub?.id || sub?._id || null;
  }, [filterSubCategory, apiSubcategoriesState]);

  // Debounced price range to prevent too many API calls
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Unified product fetching params - RESTORED Server-side filtering with high limit
  const productParams = useMemo(() => ({
    limit: 1000,
    search: debouncedSearchTerm,
    categoryId: currentCategoryId || "all",
    subCategoryId: currentSubCategoryId || "all",
    sortBy: sortBy,
    minPrice: debouncedPriceRange[0],
    maxPrice: debouncedPriceRange[1],
    brand: filterBrand,
    rating: ratingFilter,
    gender: filterGender
  }), [
    debouncedSearchTerm,
    currentCategoryId,
    currentSubCategoryId,
    sortBy,
    debouncedPriceRange,
    filterBrand,
    ratingFilter,
    filterGender
  ]);

  const { product: apiProduct, totalCount: apiTotalCount, loading: productLoading, error: apiError, refetch: productRefetch } = useGetProduct(productParams)
  const searchLoading = productLoading && !!debouncedSearchTerm;

  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch categories and subcategories from API
  const { categories: apiCategories, subcategories: apiSubcategories, loading: categoriesLoading } = useCategoryWithSubcategories()

  useEffect(() => {
    if (apiCategories?.length) setApiCategoriesState(apiCategories)
    if (apiSubcategories?.length) setApiSubcategoriesState(apiSubcategories)
  }, [apiCategories, apiSubcategories])

  // Load cart for logged-in user
  useEffect(() => {
    if (user?._id) {
      getCartApi(user._id, dispatch)
    }
  }, [user, dispatch])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(searchTerm))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, dispatch])

  // Sync Redux state with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let changed = false

    if (debouncedSearchTerm !== urlSearch) {
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm)
      else params.delete("search")
      changed = true
    }

    if (filterCategory !== (urlCategory || "all")) {
      if (filterCategory && filterCategory !== "all") params.set("category", filterCategory)
      else params.delete("category")
      changed = true
    }

    if (filterSubCategory !== (urlSubCategory || "all")) {
      if (filterSubCategory && filterSubCategory !== "all") params.set("subcategory", filterSubCategory)
      else params.delete("subcategory")
      changed = true
    }

    if (changed) {
      router.push(`/shop?${params.toString()}`)
    }
  }, [debouncedSearchTerm, filterCategory, filterSubCategory, router, urlSearch, urlCategory, urlSubCategory, searchParams])

  // Process apiProduct data
  useEffect(() => {
    if (apiProduct) {
      const list = Array.isArray(apiProduct) ? apiProduct : (apiProduct.products || apiProduct.data || []);
      const normalized = list.map((p) => ({
        id: p._id || p.id || String(p._id || ""),
        name: p.productName || p.name || "",
        price: Number(p.price) || 0,
        originalPrice: Number(p.originalPrice || p.price * 1.2) || 0,
        discount: p.discount || 0,
        image: p.images?.[0] || p.image || "/banner/img/placeholder.png",
        rating: p.ratings || 0,
        reviews: p.reviews?.length || 0,
        category: p.category?.[0]?.name || p.category || "",
        subCategory: p.subCategory?.[0]?.name || p.subCategory || "",
        brand: p.brand || "",
        gender: p.gender || "unisex",
        isNew: isProductNew(p.createdAt),
        inStock: (Number(p.productStock) || Number(p.quantity) || Number(p.stock) || 0) > 0,
        tags: p.tags || [],
        createdAt: p.createdAt
      }));
      setAllProducts(normalized);
      setProducts(normalized);
      setTotalProducts(apiTotalCount || normalized.length);

      // Auto-adjust price range based on actual products
      try {
        const prices = normalized.map(p => p.price);
        if (prices.length > 0) {
          const actualMax = Math.max(...prices);
          // If the max price in our data exceeds our current range, update the range
          if (actualMax > priceRange[1]) {
            dispatch(setPriceRange([priceRange[0], Math.ceil(actualMax)]));
          }
        }
      } catch (e) {
        console.error("Price range adjustment error", e);
      }
    } else {
      setAllProducts([]);
      setTotalProducts(0);
    }
  }, [apiProduct, apiTotalCount]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    const searchLower = debouncedSearchTerm.toLowerCase();

    // optimized search filter - single pass through products
    if (debouncedSearchTerm) {
      filtered = filtered.filter((product) => {
        // Early return on first match for better performance
        if (product.name?.toLowerCase().includes(searchLower)) return true;
        if (product.brand?.toLowerCase().includes(searchLower)) return true;
        if (product.category?.toLowerCase().includes(searchLower)) return true;
        if (product.subCategory?.toLowerCase().includes(searchLower)) return true;

        // Check tags only if other fields don't match
        if (product.tags?.length) {
          for (let i = 0; i < product.tags.length; i++) {
            if (product.tags[i]?.toLowerCase().includes(searchLower)) return true;
          }
        }

        return false;
      });
    }

    // Combine multiple filters in single pass
    filtered = filtered.filter((product) => {
      // Category filter - case insensitive
      if (filterCategory !== "all" &&
        product.category?.toLowerCase() !== filterCategory?.toLowerCase()) return false;

      // Subcategory filter - case insensitive
      if (filterSubCategory !== "all") {
        const subMatch = product.subCategory?.toLowerCase() === filterSubCategory?.toLowerCase();
        const catMatch = product.category?.toLowerCase() === filterSubCategory?.toLowerCase();
        if (!subMatch && !catMatch) return false;
      }

      // Brand filter - case insensitive
      if (filterBrand !== "all" &&
        product.brand?.toLowerCase() !== filterBrand?.toLowerCase()) return false;

      // Gender filter - case insensitive
      if (filterGender !== "all" &&
        product.gender?.toLowerCase() !== filterGender?.toLowerCase() &&
        product.gender?.toLowerCase() !== "unisex") return false;

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      // Rating filter
      if (ratingFilter > 0 && product.rating < ratingFilter) return false;

      return true;
    });

    // Sort products (Create a copy to avoid mutation)
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
        case "name": // "Sort By Latest"
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "discount":
          return b.discount - a.discount
        default:
          return (a.name || "").localeCompare(b.name || "")
      }
    })

    return sorted;
  }, [
    allProducts,
    debouncedSearchTerm,
    filterCategory,
    filterSubCategory,
    filterBrand,
    filterGender,
    priceRange,
    ratingFilter,
    sortBy,
  ]);

  // Update products and reset pagination when filters change
  useEffect(() => {
    setProducts(filteredProducts);
    dispatch(setCurrentPage(1));
  }, [filteredProducts, dispatch]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Add to cart (uses API + redux)
  const addToCart = async (product) => {
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
  }

  // Remove from cart (uses API + redux)
  const removeFromCart = async (productId) => {
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
  }

  // Update quantity (API + redux)
  const updateQuantity = async (productId, newQuantity) => {
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
  }

  // Toggle wishlist (uses API + redux)
  const toggleWishlist = async (product) => {
    try {
      const exists = (wishlist || []).some((i) => i.id === product.id)
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
  }

  // Calculate cart total
  const cartTotal = normalizedCart.reduce((total, item) => total + item.price * item.quantity, 0)


  // Calculate which page numbers to show
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
  const categories = apiCategoriesState.length > 0
    ? ["all", ...apiCategoriesState.map(cat => cat.name)]
    : ["all", ...Array.from(new Set(allProducts.map((p) => p.category)))]

  const subCategories = apiSubcategoriesState.length > 0
    ? (filterCategory === "all"
      ? ["all", ...apiSubcategoriesState.map(sub => sub.name)]
      : ["all", ...apiSubcategoriesState
        .filter(sub => {
          const category = apiCategoriesState.find(cat => cat.id === sub.categoryId || cat.id === sub.categoryId?._id)
          return category?.name === filterCategory
        })
        .map(sub => sub.name)])
    : (filterCategory === "all"
      ? ["all", ...Array.from(new Set(allProducts.map((p) => p.subCategory)))]
      : ["all", ...Array.from(new Set(allProducts.filter((p) => p.category === filterCategory).map((p) => p.subCategory)))])

  const brands = ["all", ...Array.from(new Set(allProducts.map((p) => p.brand)))]
  const genders = ["all", "men", "women", "unisex"]

  const clearFilters = () => {
    dispatch(resetFilters())
    // Clear URL params
    router.push('/shop')
  }
  // handle delete functionality 
  const confirmDelete = async () => {

    try {
      if (!deleteModal) return;
      await ProductDelete(deleteModal.id);
      setDeleteModal(null);
      productRefetch()
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const [load, setLoad] = useState(false);
  // handle edit functionality 
  const handleEdit = (p) => {
    const selectedProudct = product.find(item => item._id == p.id)
    setEditModal(selectedProudct)

  }

  const saveEdit = async () => {
    // console.log("editModal-->",editModal)
    setLoad(true);
    try {
      const res = await ProductUpdate(editModal);
      if (res.success) {
        toast.success("Product updated successfully!");
        productRefetch()
        setEditModal(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setLoad(false);
    }
  };
  const updateEditField = (field, value) => {
    setEditModal({ ...editModal, [field]: value });
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
              placeholder="Search products, categories, brands, tags..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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

            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
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
                  onClick={() => dispatch(setViewMode("grid"))}
                  className={`p-2 transition-colors duration-300 ${viewMode === "grid" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => dispatch(setViewMode("list"))}
                  className={`p-2 transition-colors duration-300 ${viewMode === "list" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
              onClick={() => setShowFilters(!showFilters)}
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
                      onChange={(e) => dispatch(setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 10000]))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="10000"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => dispatch(setPriceRange([priceRange[0], Number.parseInt(e.target.value)]))}
                    className="w-full accent-purple-600"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Price: Tk {priceRange[0]} — Tk {priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setShowCategory(!showCategory)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors duration-300"
                >
                  <span className="font-bold text-gray-800">Categories</span>
                  <ArrowUp className={`w-4 h-4 transition-transform duration-300 ${showCategory ? "" : "rotate-180"}`} />
                </button>
                <div className={`p-4 space-y-2 ${showCategory ? "block" : "hidden lg:block"} ${categories.length > 6 ? 'max-h-64 overflow-y-auto' : ''}`}>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={(filterCategory || "all").toLowerCase() === category.toLowerCase()}
                        onChange={() => {
                          dispatch(setFilterCategory(category))
                          if (window.innerWidth < 1024) setShowCategory(false)
                        }}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className={`text-sm capitalize transition-colors ${(filterCategory || "all").toLowerCase() === category.toLowerCase()
                        ? "text-purple-600 font-bold"
                        : "text-gray-600 group-hover:text-purple-600"
                        }`}>
                        {category === "all" ? "All Categories" : category.replace(/-/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {subCategories.length > 1 && (
                <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setShowSubCategory(!showSubCategory)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <span className="font-bold text-gray-800">Subcategories</span>
                    <ArrowUp className={`w-4 h-4 transition-transform duration-300 ${showSubCategory ? "" : "rotate-180"}`} />
                  </button>
                  <div className={`p-4 space-y-2 ${showSubCategory ? "block" : "hidden lg:block"} ${subCategories.length > 6 ? 'max-h-64 overflow-y-auto' : ''}`}>
                    {subCategories.map((subcat) => (
                      <label
                        key={subcat}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          checked={(filterSubCategory || "all").toLowerCase() === subcat.toLowerCase()}
                          onChange={() => {
                            dispatch(setFilterSubCategory(subcat))
                            if (window.innerWidth < 1024) setShowSubCategory(false)
                          }}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className={`text-sm capitalize transition-colors ${(filterSubCategory || "all").toLowerCase() === subcat.toLowerCase()
                          ? "text-purple-600 font-bold"
                          : "text-gray-600 group-hover:text-purple-600"
                          }`}>
                          {subcat === "all" ? "All Subcategories" : subcat.replace(/-/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Select Brands */}
              {/* <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Select Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filterBrand === brand}
                        onChange={() => dispatch(setFilterBrand(filterBrand === brand ? "all" : brand))}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{brand === "all" ? "All Brands" : brand}</span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Rating Filter */}
              {/* <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === rating}
                        onChange={() => dispatch(setRatingFilter(ratingFilter === rating ? 0 : rating))}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-gray-600 text-sm">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {(productLoading || searchLoading) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(10)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* No Products Found */}
            {!productLoading && !searchLoading && products.length === 0 && (
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
            {!productLoading && !searchLoading && products.length > 0 && (
              <div
                className={`${viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
                  : "space-y-6"
                  }`}
              >
                {currentProducts.map((product, index) => (
                  <Link
                    href={`/productdetails/${product.id}`}
                    key={product.id}
                    className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer ${viewMode === "list" ? "flex" : ""
                      }`}
                  >
                    <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "h-full" : "h-40 sm:h-44"
                          }`}
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 space-y-1">
                        {product.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">NEW</span>
                        )}
                        {product.tags?.includes('hot') && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg shadow-red-500/20">HOT</span>
                        )}
                        {product.tags?.includes('cold') && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg shadow-blue-500/20">COLD</span>
                        )}
                        {product.discount > 0 && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 space-y-2  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleWishlist(product)
                          }}
                          className={`p-2 rounded-lg transition-all duration-300
                            ${wishlist.some((item) => item.id === product.id)
                              ? "text-red-500 bg-red-100"
                              : "text-gray-400 bg-white hover:text-red-500 hover:bg-red-50"
                            }`}
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={wishlist.some((item) => item.id === product.id) ? "red" : "none"}
                            strokeWidth={2}
                          />
                        </button>
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded font-semibold text-xs">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className={`p-3 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.rating})</span>
                        </div>
                      </div>

                      <div>
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-bold text-red-600">Tk {product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              Tk {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Standard Add to Cart (Everyone sees this) */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addToCart(product)
                          }}
                          disabled={!product.inStock}
                          className={`w-full py-1.5 px-2 mb-2 rounded font-medium transition-all duration-300 text-xs ${product.inStock
                            ? "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          {product.inStock ? (
                            <span className="flex items-center justify-center gap-1">
                              <ShoppingCart className="w-3 h-3" />
                              Add to Cart
                            </span>
                          ) : (
                            "Out of Stock"
                          )}
                        </button>

                        {/* Admin Controls (Only Admin sees these additional tools) */}
                        {user?.role === "ADMIN" && (
                          <div className="flex justify-between gap-2 mt-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleEdit(product)
                              }}
                              className="flex-1 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit size={10} /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setDeleteModal(product)
                              }}
                              className="flex-1 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 size={10} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
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
                    : "bg-purple-500 text-white hover:bg-purple-600"
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
                      ? "bg-purple-500 text-white transform scale-110"
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
                    : "bg-purple-500 text-white hover:bg-purple-600"
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
      {editModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit className="w-6 h-6" />
                Edit Product
              </h2>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white cursor-pointer" />
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

                <div className="md:col-span-2">
                  <label className="block text-black text-sm font-semibold mb-2">
                    Video Link
                  </label>
                  <input
                    value={editModal?.video_link}
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
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
      )} {/* Delete Confirmation Modal */}
      {deleteModal && (
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-600 hover:text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
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
    </div>
  )
}

export default ShopPage
