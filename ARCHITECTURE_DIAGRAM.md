# Server-Side Filtering Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        ShopComponent.jsx                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Filter States:                                               │  │
│  │  • searchTerm                                                 │  │
│  │  • filterCategory                                             │  │
│  │  • filterSubCategory                                          │  │
│  │  • priceRange [min, max]                                      │  │
│  │  • sortBy                                                     │  │
│  │  • currentPage                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    useFilteredProducts Hook                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Receives filter parameters                               │  │
│  │  2. Applies 300ms debounce                                    │  │
│  │  3. Builds API request params                                 │  │
│  │  4. Calls ProductAllGet()                                     │  │
│  │  5. Returns: { products, totalCount, loading, error }         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                        ┌─────────────────┐
                        │  300ms Debounce │
                        └─────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ProductAllGet (API Call)                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  POST /products/get                                           │  │
│  │  {                                                            │  │
│  │    search: "shoes",                                           │  │
│  │    categoryId: "electronics",                                 │  │
│  │    subCategoryId: "all",                                      │  │
│  │    minPrice: 100,                                             │  │
│  │    maxPrice: 500,                                             │  │
│  │    sortBy: "price-low",                                       │  │
│  │    page: 1,                                                   │  │
│  │    limit: 30                                                  │  │
│  │  }                                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Receives request                                          │  │
│  │  2. Builds database query                                     │  │
│  │  3. Applies filters (search, category, price, etc.)           │  │
│  │  4. Applies sorting                                           │  │
│  │  5. Applies pagination                                        │  │
│  │  6. Executes query                                            │  │
│  │  7. Returns filtered results                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API RESPONSE                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  {                                                            │  │
│  │    success: true,                                             │  │
│  │    data: [                                                    │  │
│  │      { id: 1, name: "Product 1", price: 150, ... },           │  │
│  │      { id: 2, name: "Product 2", price: 200, ... },           │  │
│  │      ...                                                      │  │
│  │    ],                                                         │  │
│  │    totalCount: 1234,                                          │  │
│  │    page: 1,                                                   │  │
│  │    totalPages: 42                                             │  │
│  │  }                                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    useFilteredProducts Hook                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Receives API response                                     │  │
│  │  2. Updates state:                                            │  │
│  │     • products = data.data                                    │  │
│  │     • totalCount = data.totalCount                            │  │
│  │     • loading = false                                         │  │
│  │     • error = null                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        ShopComponent.jsx                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Receives updated products                                 │  │
│  │  2. Hides skeleton loading                                    │  │
│  │  3. Renders product grid                                      │  │
│  │  4. Updates pagination (totalPages = totalCount / limit)      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SEES RESULTS                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌──────────────────┐
│   ShopComponent  │
└────────┬─────────┘
         │
         │ uses
         ▼
┌──────────────────────────┐
│  useFilteredProducts()   │◄──────┐
└────────┬─────────────────┘       │
         │                         │
         │ calls                   │ returns
         ▼                         │
┌──────────────────────────┐       │
│   ProductAllGet()        │───────┘
│   (API function)         │
└──────────────────────────┘
         │
         │ HTTP POST
         ▼
┌──────────────────────────┐
│   Backend API            │
│   /products/get          │
└──────────────────────────┘
```

## Debouncing Flow

```
User Types: "s"
    │
    ▼
┌─────────────┐
│ Timer Start │  ← 300ms countdown begins
└─────────────┘
    │
    │ User Types: "h"
    ▼
┌─────────────┐
│ Timer Reset │  ← Previous timer cancelled, new 300ms countdown
└─────────────┘
    │
    │ User Types: "o"
    ▼
┌─────────────┐
│ Timer Reset │  ← Previous timer cancelled, new 300ms countdown
└─────────────┘
    │
    │ User Types: "e"
    ▼
┌─────────────┐
│ Timer Reset │  ← Previous timer cancelled, new 300ms countdown
└─────────────┘
    │
    │ User Types: "s"
    ▼
┌─────────────┐
│ Timer Reset │  ← Previous timer cancelled, new 300ms countdown
└─────────────┘
    │
    │ User stops typing
    │ Wait 300ms...
    ▼
┌─────────────┐
│  API Call   │  ← Only ONE API call made with search="shoes"
└─────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Component State                          │
├─────────────────────────────────────────────────────────────┤
│  Local State (ShopComponent):                               │
│  • searchTerm: ""                                           │
│  • filterCategory: "all"                                    │
│  • filterSubCategory: "all"                                 │
│  • priceRange: [0, 300]                                     │
│  • sortBy: "name"                                           │
│  • currentPage: 1                                           │
│  • viewMode: "grid"                                         │
├─────────────────────────────────────────────────────────────┤
│  Hook State (useFilteredProducts):                          │
│  • products: []                                             │
│  • totalCount: 0                                            │
│  • loading: true                                            │
│  • error: null                                              │
├─────────────────────────────────────────────────────────────┤
│  Redux State (existing):                                    │
│  • cart.items: []                                           │
│  • wishlist.data: []                                        │
│  • user.data: {...}                                         │
└─────────────────────────────────────────────────────────────┘
```

## Loading States Flow

```
Initial Load:
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│  Skeleton  │ → │  API Request │ → │  Show Results│
│  Loading   │    │  (300ms)     │    │              │
└────────────┘    └──────────────┘    └──────────────┘

Filter Change:
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│  Current   │ → │  Skeleton    │ → │  New Results │
│  Results   │    │  Loading     │    │              │
└────────────┘    └──────────────┘    └──────────────┘

Search (with debounce):
┌────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Typing... │ → │  Wait 300ms  │ → │  Skeleton    │ → │  Results     │
│            │    │  (debounce)  │    │  Loading     │    │              │
└────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

## Error Handling Flow

```
┌──────────────┐
│  API Request │
└──────┬───────┘
       │
       ├─── Success ───┐
       │               ▼
       │        ┌──────────────┐
       │        │ Update State │
       │        │ Show Results │
       │        └──────────────┘
       │
       └─── Error ────┐
                      ▼
               ┌──────────────┐
               │ Set Error    │
               │ Show Message │
               │ Keep Old Data│
               └──────────────┘
```

## Performance Comparison

### Before (Client-Side Filtering):
```
1. Fetch ALL products (1000+)     [2-3 seconds]
2. Store in state                 [Memory: ~5MB]
3. Filter in browser              [100-200ms per filter change]
4. Re-render                      [50-100ms]
───────────────────────────────────────────────────
Total: ~3 seconds initial + lag on every filter
```

### After (Server-Side Filtering):
```
1. Fetch ONLY filtered products (30) [500ms-1s]
2. Store in state                    [Memory: ~150KB]
3. Render immediately                [50ms]
───────────────────────────────────────────────────
Total: ~1 second + instant filter changes
```

## Memory Usage Comparison

```
Client-Side:
┌────────────────────────────────────┐
│ All Products: 1000 items × 5KB     │
│ = 5MB in memory                    │
└────────────────────────────────────┘

Server-Side:
┌────────────────────────────────────┐
│ Filtered Products: 30 items × 5KB  │
│ = 150KB in memory                  │
│ (97% reduction!)                   │
└────────────────────────────────────┘
```

## API Call Optimization

### Without Debouncing:
```
User types "shoes" (5 characters)
→ 5 API calls (one per character)
→ Wasted: 4 API calls
```

### With 300ms Debouncing:
```
User types "shoes" (5 characters)
→ Wait 300ms after last character
→ 1 API call
→ Saved: 4 API calls (80% reduction!)
```

## File Dependencies

```
ShopComponent.jsx
├── useFilteredProducts.jsx
│   ├── ProductAllGet (from useProduct.jsx)
│   └── useState, useEffect, useCallback, useRef (React)
├── ProductGridSkeleton.jsx
│   └── CardSkeleton (from Skeleton.jsx)
├── filterHelpers.js
│   ├── getCategoryId
│   ├── getSubCategoryId
│   └── normalizeProduct
└── useCategoryWithSubcategories.jsx (existing)
```

## Sequence Diagram

```
User          ShopComponent     useFilteredProducts     API          Backend
 │                 │                    │                │              │
 │─Type "shoes"───>│                    │                │              │
 │                 │                    │                │              │
 │                 │─Update searchTerm─>│                │              │
 │                 │                    │                │              │
 │                 │                    │─Start Timer───>│              │
 │                 │                    │  (300ms)       │              │
 │                 │                    │                │              │
 │─Wait 300ms─────>│                    │                │              │
 │                 │                    │                │              │
 │                 │                    │─Timer Done────>│              │
 │                 │                    │                │              │
 │                 │                    │─POST request──>│              │
 │                 │                    │                │              │
 │                 │                    │                │─Query DB────>│
 │                 │                    │                │              │
 │                 │                    │                │<─Results────│
 │                 │                    │                │              │
 │                 │                    │<─Response──────│              │
 │                 │                    │                │              │
 │                 │<─Update products───│                │              │
 │                 │                    │                │              │
 │<─Show results───│                    │                │              │
 │                 │                    │                │              │
```

This architecture ensures optimal performance, minimal API calls, and excellent user experience!
