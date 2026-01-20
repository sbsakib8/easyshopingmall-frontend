"use client"
import { addToCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from "@/src/hook/useCart"
import { addToWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist"
import { useGetProduct } from "@/src/utlis/userProduct"
import { useSearchProduct } from "@/src/utlis/useSearchProduct"
import { useWishlist } from "@/src/utlis/useWishList"
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories"
import { ArrowUp, ChevronDown, Filter, Grid, Heart, List, Search, ShoppingCart, SlidersHorizontal, Star, X } from "lucide-react"
import CustomLoader from '@/src/compronent/loading/CustomLoader'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
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

const ShopPage = () => {
  const router = useRouter()

  // Request all products without pagination limit
  const productParams = useMemo(() => ({ limit: 1000 }), [])
  const { product, loading, error, refetch } = useGetProduct(productParams)

  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const dispatch = useDispatch()

  // Redux-backed cart & wishlist
  const reduxCart = useSelector((state) => state.cart.items || [])
  // Normalize redux cart items for UI
  const cart = useMemo(() => {
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
  const user = useSelector((state) => state.user.data)
  const { wishlist } = useWishlist()
  
  // Fetch categories and subcategories from API
  const { categories: apiCategories, subcategories: apiSubcategories, loading: categoriesLoading } = useCategoryWithSubcategories()

  // Load cart for logged-in user
  useEffect(() => {
    if (user?._id) {
      getCartApi(user._id, dispatch)
    }
  }, [user, dispatch])
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterSubCategory, setFilterSubCategory] = useState("all")
  const [filterBrand, setFilterBrand] = useState("all")
  const [filterGender, setFilterGender] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showCategory, setShowCategory] = useState(false)
  const [showSubCategory, setShowSubCategory] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 30

  const searchParams = useSearchParams()
  const urlSearch = searchParams?.get("search") || ""
  const urlCategory = searchParams?.get("category") || ""
  const urlSubCategory = searchParams?.get("subcategory") || ""

  // when user navigates with ?search=..., call server-side search
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchProduct({ search: urlSearch, page: currentPage, limit: 200 })

  // keep the local search input in sync with URL search param
  useEffect(() => {
    if (urlSearch) setSearchTerm(urlSearch)
    else setSearchTerm("")
  }, [urlSearch])

  useEffect(() => {
    if (urlSubCategory) {
      // If subcategory is in URL, set it as the filter
      setFilterSubCategory(urlSubCategory)
      setFilterCategory("all") // Reset category when filtering by subcategory
    } else if (urlCategory) {
      // The header passes subcategory names like "saree" as ?category=saree
      const existingCategories = Array.from(new Set(allProducts.map((p) => p.category)))
      const existingSubCategories = Array.from(new Set(allProducts.map((p) => p.subCategory)))

      if (existingSubCategories.includes(urlCategory)) {
        // It's a subcategory name, so filter by subcategory
        setFilterSubCategory(urlCategory)
        setFilterCategory("all")
      } else if (existingCategories.includes(urlCategory)) {
        // It's a category name
        setFilterCategory(urlCategory)
        setFilterSubCategory("all")
      } else {
        // Not found, reset filters
        setFilterCategory("all")
        setFilterSubCategory("all")
      }
    }
  }, [urlCategory, urlSubCategory, allProducts])

  // Filter and search products
  useEffect(() => {
    // If there's a search query param, prefer server-side search results
    if (urlSearch) {
      const list = searchData?.products ?? searchData?.data ?? searchData ?? []
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map((p) => {
          // normalize category to a string (API may return object or array)
          let categoryVal = "uncategorized"
          if (Array.isArray(p.category) && p.category.length > 0) {
            const c0 = p.category[0]
            categoryVal = typeof c0 === "string" ? c0 : c0?.name || String(c0)
          } else if (p.category && typeof p.category === "object") {
            categoryVal = p.category.name || String(p.category)
          } else if (p.category) {
            categoryVal = String(p.category)
          }

          // normalize subCategory
          let subCategoryVal = "general"
          if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
            const s0 = p.subCategory[0]
            subCategoryVal = typeof s0 === "string" ? s0 : s0?.name || String(s0)
          } else if (p.subCategory && typeof p.subCategory === "object") {
            subCategoryVal = p.subCategory.name || String(p.subCategory)
          } else if (p.subCategory) {
            subCategoryVal = String(p.subCategory)
          }

          return {
            id: p._id || p.id || (p._id?.toString && p._id.toString()) || String(p.id || ""),
            name: p.name || p.productName || p.title || "Untitled",
            price: Number(p.price ?? p.sell_price ?? p.sellingPrice ?? p.amount ?? 0) || 0,
            originalPrice: Number(p.originalPrice ?? p.mrp ?? p.price ?? p.sell_price) || Number(p.price ?? 0) || 0,
            category: categoryVal,
            subCategory: subCategoryVal,
            brand: p.brand || p.manufacturer || "Brand",
            size: p.size || p.sizes || p.productSize || [],
            color: p.color || p.colors || p.color || [],
            rating: Number(p.rating ?? p.ratings) || 4,
            reviews: Number(p.reviews ?? 0) || 0,
            image: p.image || p.images?.[0] || "/banner/img/placeholder.png",
            inStock: (typeof p.stock !== "undefined" ? p.stock : (p.productStock ?? p.quantity ?? p.qty ?? 0)) > 0,
            isNew: isProductNew(p.createdAt || p.created_at || p.createdDate),
            discount: Number(p.discount) || Number(p.offerPercent) || 0,
            gender: p.gender || "unisex",
            tags: p.tags || [],
          }
        })

      setAllProducts(normalized)
      setProducts(normalized)
      
      try {
        const prices = normalized.map((p) => Number(p.price) || 0).filter((n) => !Number.isNaN(n))
        if (prices.length > 0) {
          const actualMin = Math.min(...prices)
          const actualMax = Math.max(...prices)
          if (priceRange[0] === 0 && priceRange[1] === 300) {
            setPriceRange([Math.floor(actualMin), Math.ceil(actualMax)])
          }
        }
      } catch (e) { }
    } else {
      // No search active - clear any previous search results
      // and let the regular product loading below handle it
    }
    
    // Only return early if we're actively searching
    if (urlSearch) {
      return;
    }
  }

  // API may return different shapes:
  // - { products: [...] }
  // - array (already product.data set by hook)
  // - { data: [...] }
  
  const list = product?.products ?? product?.data ?? product ?? []
  
  if (Array.isArray(list) && list.length > 0) {
      const normalized = list.map((p) => {
        // normalize category to a string (API may return object or array)
        let categoryVal = "uncategorized"
        if (Array.isArray(p.category) && p.category.length > 0) {
          const c0 = p.category[0]
          categoryVal = typeof c0 === "string" ? c0 : c0?.name || String(c0)
        } else if (p.category && typeof p.category === "object") {
          categoryVal = p.category.name || String(p.category)
        } else if (p.category) {
          categoryVal = String(p.category)
        }

        // normalize subCategory
        let subCategoryVal = "general"
        if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
          const s0 = p.subCategory[0]
          subCategoryVal = typeof s0 === "string" ? s0 : s0?.name || String(s0)
        } else if (p.subCategory && typeof p.subCategory === "object") {
          subCategoryVal = p.subCategory.name || String(p.subCategory)
        } else if (p.subCategory) {
          subCategoryVal = String(p.subCategory)
        }

        return {
          id: p._id || p.id || (p._id?.toString && p._id.toString()) || String(p.id || ""),
          name: p.name || p.productName || p.title || "Untitled",
          price: Number(p.price ?? p.sell_price ?? p.sellingPrice ?? p.amount ?? 0) || 0,
          originalPrice: Number(p.originalPrice ?? p.mrp ?? p.price ?? p.sell_price) || Number(p.price ?? 0) || 0,
          category: categoryVal,
          subCategory: subCategoryVal,
          brand: p.brand || p.manufacturer || "Brand",
          size: p.size || p.sizes || p.productSize || [],
          color: p.color || p.colors || p.color || [],
          rating: Number(p.rating ?? p.ratings) || 4,
          reviews: Number(p.reviews ?? 0) || 0,
          image: p.image || p.images?.[0] || "/banner/img/placeholder.png",
          inStock: (typeof p.stock !== "undefined" ? p.stock : (p.productStock ?? p.quantity ?? p.qty ?? 0)) > 0,
          tags: p.tags || [],
          isNew: isProductNew(p.createdAt || p.created_at || p.createdDate),
          discount: Number(p.discount) || Number(p.offerPercent) || 0,
          gender: p.gender || "unisex",
          tags: p.tags || [],
        }
      })
      
      setAllProducts(normalized)
      setProducts(normalized)
      
      // If user hasn't changed the price range (default [0,300]),
      // expand it to cover actual product prices so items >300 aren't hidden.
      try {
        const prices = normalized.map((p) => Number(p.price) || 0).filter((n) => !Number.isNaN(n))
        if (prices.length > 0) {
          const actualMin = Math.min(...prices)
          const actualMax = Math.max(...prices)
          // only update if current range is the initial default
          if (priceRange[0] === 0 && priceRange[1] === 300) {
            setPriceRange([Math.floor(actualMin), Math.ceil(actualMax)])
          }
        }
      } catch (e) {
        // ignore
      }
    } else {
      setAllProducts([])
      setProducts([])
    }
  }, [product, urlSearch, searchData])

  // Optimized filtering using useMemo for better performance
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Early return if no products
    if (!filtered.length) return [];

    const searchLower = searchTerm.toLowerCase();
    
    // Optimized search filter - single pass through products
    if (searchTerm) {
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
      // Category filter
      if (filterCategory !== "all" && product.category !== filterCategory) return false;
      
      // Subcategory filter
      if (filterSubCategory !== "all" && 
          product.subCategory !== filterSubCategory && 
          product.category !== filterSubCategory) return false;
      
      // Brand filter
      if (filterBrand !== "all" && product.brand !== filterBrand) return false;
      
      // Gender filter
      if (filterGender !== "all" && 
          product.gender !== filterGender && 
          product.gender !== "unisex") return false;
      
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Rating filter
      if (ratingFilter > 0 && product.rating < ratingFilter) return false;
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew - a.isNew
        case "discount":
          return b.discount - a.discount
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered;
  }, [
    allProducts,
    searchTerm,
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
    setCurrentPage(1);
  }, [filteredProducts]);

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
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

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
  const categories = apiCategories.length > 0 
    ? ["all", ...apiCategories.map(cat => cat.name)]
    : ["all", ...Array.from(new Set(allProducts.map((p) => p.category)))]
  
  const subCategories = apiSubcategories.length > 0
    ? (filterCategory === "all"
        ? ["all", ...apiSubcategories.map(sub => sub.name)]
        : ["all", ...apiSubcategories
            .filter(sub => {
              const category = apiCategories.find(cat => cat.id === sub.categoryId || cat.id === sub.categoryId?._id)
              return category?.name === filterCategory
            })
            .map(sub => sub.name)])
    : (filterCategory === "all"
        ? ["all", ...Array.from(new Set(allProducts.map((p) => p.subCategory)))]
        : ["all", ...Array.from(new Set(allProducts.filter((p) => p.category === filterCategory).map((p) => p.subCategory)))])
  
  const brands = ["all", ...Array.from(new Set(allProducts.map((p) => p.brand)))]
  const genders = ["all", "men", "women", "unisex"]

  const clearFilters = () => {
    setFilterCategory("all")
    setFilterSubCategory("all")
    setFilterBrand("all")
    setFilterGender("all")
    setPriceRange([0, 300])
    setRatingFilter(0)
    setSearchTerm("")
    // Clear URL search params as well
    router.push('/shop')
  }

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
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors duration-300 ${viewMode === "grid" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors duration-300 ${viewMode === "list" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 300])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="300"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
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
              <div onClick={()=>setShowCategory(!showCategory)} className="bg-white p-6 rounded-lg shadow-md">
                  <h3  className="flex justify-between font-bold text-lg mb-4 text-gray-800 ">Product Categories <span className={`${showCategory?"":"rotate-180"} lg:hidden`}><ArrowUp/></span> </h3>
                <div className={`space-y-2 ${categories.length > 4 ? 'max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200' : ''}`}>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className={` items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer ${showCategory?"flex":"hidden"} lg:flex`}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === category}
                        onChange={() => {
                          setFilterCategory(category)
                          setFilterSubCategory("all")
                          setShowSubCategory(true)
                          setShowCategory(false)
                        }}
                        className="text-purple-600 focus:ring-purple-500"
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
                <div className={`bg-white p-6 rounded-lg shadow-md ${showSubCategory & !showCategory?"block":"hidden"} lg:block`}>
                  <h3 className="font-bold text-lg mb-4 text-gray-800 flex justify-between ">Subcategories 
                    <span className="lg:hidden">
                   <X onClick={()=>setShowSubCategory(false)} size={30}/> 
                    </span> 
                   </h3>
                  <div className={`space-y-2 ${subCategories.length > 4 ? 'max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200' : ''}`}>
                    {subCategories.map((subcat) => (
                      <label
                        key={subcat}
                        className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          checked={filterSubCategory === subcat}
                          onChange={() => setFilterSubCategory(subcat)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="capitalize text-gray-700">
                          {subcat === "all" ? "All Subcategories" : subcat.replace("-", " ")}
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
                        onChange={() => setFilterBrand(filterBrand === brand ? "all" : brand)}
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
                        onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
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
            {(loading || searchLoading) && (
              <div className="flex items-center justify-center py-20">
                <CustomLoader size="large" message="Loading products..." />
              </div>
            )}

            {/* No Products Found */}
            {!loading && !searchLoading && products.length === 0 && (
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
            {!loading && !searchLoading && products.length > 0 && (
              <div
                className={`${viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
                  : "space-y-6"
                  }`}
              >
                {currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/productdetails/${product.id}`)}
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
                        {product.discount > 0 && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(product)
                          }}
                          className={`p-2 rounded-lg transition-all duration-300
                            ${wishlist.some((item) => item.id === product.id)
                              ? "text-red-500 bg-red-100"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
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
                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

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

                        {/* Add to Cart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                          }}
                          disabled={!product.inStock}
                          className={`w-full py-1.5 px-2 rounded font-medium transition-all duration-300 text-xs ${product.inStock
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentPage === 1
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
                      onClick={() => setCurrentPage(1)}
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
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === page
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
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 hover:bg-purple-50 transition-colors duration-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentPage === totalPages
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
