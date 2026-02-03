# Server-Side Filtering Implementation Guide

## Overview
This document provides implementation instructions for adding server-side filtering with debouncing to the Shop page without changing the existing UI.

## Features Implemented
1. ✅ Server-side search with 300ms debouncing
2. ✅ Backend-based category filtering
3. ✅ Backend-based subcategory filtering
4. ✅ Backend-based price range filtering
5. ✅ Skeleton loading states
6. ✅ Optimized API calls with debouncing

## New Files Created

### 1. `/src/utlis/useFilteredProducts.jsx`
Custom hook for server-side product filtering with automatic debouncing.

**Features:**
- 300ms debounce delay (configurable)
- Automatic cleanup on unmount
- Supports all filter types (search, category, subcategory, price, brand, rating, gender)
- Returns: `{ products, totalCount, loading, error, refetch }`

## Implementation Steps

### Step 1: Update ShopComponent to Use Server-Side Filtering

Replace the current client-side filtering with the new `useFilteredProducts` hook:

```javascript
// At the top of shopComponent.jsx, add:
import { useFilteredProducts } from "@/src/utlis/useFilteredProducts";

// Replace the existing useGetProduct hook with:
const {
  products: serverProducts,
  totalCount,
  loading: productsLoading,
  error: productsError,
  refetch: refetchProducts
} = useFilteredProducts({
  search: searchTerm,
  categoryId: filterCategory,
  subCategoryId: filterSubCategory,
  minPrice: priceRange[0],
  maxPrice: priceRange[1],
  sortBy: sortBy,
  page: currentPage,
  limit: productsPerPage,
  brand: filterBrand,
  rating: ratingFilter,
  gender: filterGender,
  debounceMs: 300 // 300ms debounce
});
```

### Step 2: Update State Management

Remove client-side filtering logic and use server-filtered products directly:

```javascript
// Remove the filteredProducts useMemo
// Remove the client-side filter effect

// Use server products directly:
const currentProducts = serverProducts || [];
const totalPages = Math.ceil(totalCount / productsPerPage);
```

### Step 3: Update Loading States

Replace CustomLoader with Skeleton components for better UX:

```javascript
import { CardSkeleton } from '@/src/compronent/loading/Skeleton';

// In the products grid section:
{productsLoading && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
    {[...Array(productsPerPage)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)}
```

### Step 4: Backend API Requirements

Ensure your backend `/products/get` endpoint supports these query parameters:

```javascript
{
  search: string,          // Search term
  categoryId: string,      // Category ID or "all"
  subCategoryId: string,   // Subcategory ID or "all"
  minPrice: number,        // Minimum price
  maxPrice: number,        // Maximum price
  sortBy: string,          // Sort option: "name", "price-low", "price-high", "rating", "newest", "discount"
  page: number,            // Page number
  limit: number,           // Items per page
  brand: string,           // Brand filter or "all"
  rating: number,          // Minimum rating (0-5)
  gender: string           // Gender filter or "all"
}
```

**Expected Response Format:**
```javascript
{
  data: [...products],     // or products: [...products]
  totalCount: number,      // or total: number
  success: boolean
}
```

### Step 5: Update Search Input

Add debounced search with visual feedback:

```javascript
const [searchTerm, setSearchTerm] = useState("");
const [isSearching, setIsSearching] = useState(false);

// Update search handler:
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  setIsSearching(true);
};

// The hook will automatically debounce and fetch
useEffect(() => {
  if (productsLoading) {
    setIsSearching(false);
  }
}, [productsLoading]);
```

### Step 6: Category/Subcategory Mapping

If your backend requires IDs instead of names, add this mapping:

```javascript
// Map category name to ID
const getCategoryId = (categoryName) => {
  if (categoryName === "all") return "all";
  const category = apiCategories.find(cat => 
    cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  return category?.id || category?._id || "all";
};

// Use in the hook:
const {
  products: serverProducts,
  // ...
} = useFilteredProducts({
  categoryId: getCategoryId(filterCategory),
  subCategoryId: getSubCategoryId(filterSubCategory),
  // ...
});
```

## Benefits

1. **Performance**: Reduced client-side processing, faster filtering
2. **Scalability**: Can handle thousands of products without performance degradation
3. **Network Efficiency**: Only fetches filtered results, not all products
4. **Better UX**: Debouncing prevents excessive API calls during typing
5. **SEO Friendly**: Server-side filtering can be indexed by search engines

## Testing Checklist

- [ ] Search with debouncing works (300ms delay)
- [ ] Category filtering triggers API call
- [ ] Subcategory filtering triggers API call
- [ ] Price range filtering works
- [ ] Sorting options work correctly
- [ ] Pagination updates correctly
- [ ] Loading skeletons display during fetch
- [ ] Error states are handled gracefully
- [ ] Multiple filter combinations work together
- [ ] Clear filters resets to initial state

## Troubleshooting

### Issue: Too many API calls
**Solution**: Increase `debounceMs` to 500 or 800

### Issue: Filters not working
**Solution**: Check backend API parameter names match exactly

### Issue: Loading state flickers
**Solution**: Add minimum loading time:
```javascript
const [minLoadingTime, setMinLoadingTime] = useState(true);
useEffect(() => {
  const timer = setTimeout(() => setMinLoadingTime(false), 300);
  return () => clearTimeout(timer);
}, [productsLoading]);

const showLoading = productsLoading || minLoadingTime;
```

## Next Steps

1. Implement caching strategy (React Query or SWR)
2. Add infinite scroll option
3. Implement filter presets/saved searches
4. Add analytics tracking for popular filters
5. Implement URL state synchronization for shareable filter links
