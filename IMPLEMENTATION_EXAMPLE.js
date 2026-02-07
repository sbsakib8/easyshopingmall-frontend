/**
 * EXAMPLE: How to integrate server-side filtering into ShopComponent
 * 
 * This file shows the key changes needed to implement server-side filtering
 * Copy the relevant sections into your shopComponent.jsx
 */

// ============================================================================
// 1. IMPORTS - Add these at the top of shopComponent.jsx
// ============================================================================

import { useFilteredProducts } from "@/src/utlis/useFilteredProducts";
import { ProductGridSkeleton } from "@/src/compronent/loading/ProductGridSkeleton";
import { getCategoryId, getSubCategoryId } from "@/src/utlis/filterHelpers";

// ============================================================================
// 2. REPLACE useGetProduct with useFilteredProducts
// ============================================================================

// OLD CODE (Remove this):
// const productParams = useMemo(() => ({ limit: 1000 }), [])
// const { product, loading, error, refetch: productRefetch } = useGetProduct(productParams)

// NEW CODE (Add this):
const {
    products: serverProducts,
    totalCount,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts
} = useFilteredProducts({
    search: searchTerm,
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
    debounceMs: 300 // 300ms debounce for search
});

// ============================================================================
// 3. UPDATE STATE MANAGEMENT - Remove client-side filtering
// ============================================================================

// REMOVE these (no longer needed):
// const [allProducts, setAllProducts] = useState([])
// const filteredProducts = useMemo(() => { ... })
// useEffect for client-side filtering

// KEEP these (still needed):
const [searchTerm, setSearchTerm] = useState("")
const [filterCategory, setFilterCategory] = useState("all")
const [filterSubCategory, setFilterSubCategory] = useState("all")
const [priceRange, setPriceRange] = useState([0, 300])
// ... other filter states

// ============================================================================
// 4. UPDATE PRODUCTS DISPLAY - Use server products directly
// ============================================================================

// OLD CODE (Remove):
// const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

// NEW CODE (Add):
const currentProducts = serverProducts || [];
const totalPages = Math.ceil(totalCount / productsPerPage);

// ============================================================================
// 5. UPDATE LOADING STATE - Use skeleton components
// ============================================================================

// In your JSX, replace the loading section:

// OLD CODE (Remove):
// {loading && (
//   <div className="flex items-center justify-center py-20">
//     <CustomLoader size="large" message="Loading products..." />
//   </div>
// )}

// NEW CODE (Add):
{
    productsLoading && (
        <ProductGridSkeleton count={productsPerPage} viewMode={viewMode} />
    )
}

// ============================================================================
// 6. UPDATE SEARCH INPUT - Add debounce indicator
// ============================================================================

// Add state for search indicator:
const [isSearching, setIsSearching] = useState(false);

// Update search handler:
const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
};

// Add effect to clear searching state:
useEffect(() => {
    if (!productsLoading) {
        setIsSearching(false);
    }
}, [productsLoading]);

// In your search input JSX:
<div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
    />
    {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
    )}
</div>

// ============================================================================
// 7. UPDATE FILTER HANDLERS - Trigger refetch on filter change
// ============================================================================

// Category filter handler:
const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilterSubCategory("all");
    setCurrentPage(1); // Reset to first page
};

// Subcategory filter handler:
const handleSubCategoryChange = (subCategory) => {
    setFilterSubCategory(subCategory);
    setCurrentPage(1);
};

// Price range handler with debounce:
const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(1);
};

// ============================================================================
// 8. UPDATE PAGINATION - Use totalCount from server
// ============================================================================

// The pagination logic remains mostly the same, but uses server totalCount:
const totalPages = Math.ceil(totalCount / productsPerPage);

// ============================================================================
// 9. UPDATE CLEAR FILTERS - Reset all states
// ============================================================================

const clearFilters = () => {
    setFilterCategory("all");
    setFilterSubCategory("all");
    setFilterBrand("all");
    setFilterGender("all");
    setPriceRange([0, 300]);
    setRatingFilter(0);
    setSearchTerm("");
    setCurrentPage(1);
    router.push('/shop');
};

// ============================================================================
// 10. OPTIONAL: Add URL state synchronization
// ============================================================================

// Sync filters to URL for shareable links:
useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (filterCategory !== 'all') params.set('category', filterCategory);
    if (filterSubCategory !== 'all') params.set('subcategory', filterSubCategory);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
    if (priceRange[1] < 300) params.set('maxPrice', priceRange[1]);
    if (currentPage > 1) params.set('page', currentPage);

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : '/shop';

    // Update URL without page reload
    window.history.replaceState({}, '', newUrl);
}, [searchTerm, filterCategory, filterSubCategory, priceRange, currentPage]);

// ============================================================================
// COMPLETE EXAMPLE COMPONENT STRUCTURE
// ============================================================================

/*
const ShopPage = () => {
  // 1. Router and params
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 2. Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSubCategory, setFilterSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;
  
  // 3. API data
  const { categories: apiCategories, subcategories: apiSubcategories } = useCategoryWithSubcategories();
  
  // 4. Server-side filtered products
  const {
    products: serverProducts,
    totalCount,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useFilteredProducts({
    search: searchTerm,
    categoryId: getCategoryId(filterCategory, apiCategories),
    subCategoryId: getSubCategoryId(filterSubCategory, apiSubcategories),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy: sortBy,
    page: currentPage,
    limit: productsPerPage,
    debounceMs: 300
  });
  
  // 5. Computed values
  const currentProducts = serverProducts || [];
  const totalPages = Math.ceil(totalCount / productsPerPage);
  
  // 6. Render
  return (
    <div>
      {productsLoading ? (
        <ProductGridSkeleton count={productsPerPage} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
*/

// ============================================================================
// BACKEND API ENDPOINT EXAMPLE
// ============================================================================

/*
// Example Express.js endpoint structure:

router.post('/products/get', async (req, res) => {
  try {
    const {
      search,
      categoryId,
      subCategoryId,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 30,
      brand,
      rating,
      gender
    } = req.body;
    
    // Build query
    let query = {};
    
    // Search
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Category filter
    if (categoryId && categoryId !== 'all') {
      query.category = categoryId;
    }
    
    // Subcategory filter
    if (subCategoryId && subCategoryId !== 'all') {
      query.subCategory = subCategoryId;
    }
    
    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    
    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = brand;
    }
    
    // Rating filter
    if (rating > 0) {
      query.ratings = { $gte: rating };
    }
    
    // Gender filter
    if (gender && gender !== 'all') {
      query.gender = { $in: [gender, 'unisex'] };
    }
    
    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'rating':
        sort.ratings = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'discount':
        sort.discount = -1;
        break;
      default:
        sort.productName = 1;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('category')
      .populate('subCategory');
    
    const totalCount = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});
*/

export default {};
