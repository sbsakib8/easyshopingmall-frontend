import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductAllGet } from "../hook/useProduct";
import { normalizeProduct } from "../utlis/filterHelpers";

export const fetchShopProducts = createAsyncThunk(
    "shop/fetchProducts",
    async (params, { rejectWithValue }) => {
        try {
            const data = await ProductAllGet(params);
            const rawProducts = data?.data || data?.products || (Array.isArray(data) ? data : []);
            const count = data?.totalCount || data?.total || (Array.isArray(data) ? data.length : 0);

            return {
                products: rawProducts.map(normalizeProduct),
                totalCount: count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch products");
        }
    }
);

const initialState = {
    // Filter State
    searchTerm: "",
    debouncedSearchTerm: "",
    filterCategory: "all",
    filterSubCategory: "all",
    filterBrand: "all",
    filterGender: "all",
    priceRange: [0, 100000],
    ratingFilter: 0,
    sortBy: "name",
    currentPage: 1,
    viewMode: "grid",
    showFilters: false,

    // Data State
    products: [],
    totalCount: 0,
    quickViewProduct: null, // For zero-latency navigation
    loading: false,
    error: null,
    detailsError: null, // Track specific errors for product details
};

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setDebouncedSearch: (state, action) => {
            state.debouncedSearchTerm = action.payload;
        },
        setFilterCategory: (state, action) => {
            state.filterCategory = action.payload;
            state.filterSubCategory = "all";
            state.currentPage = 1;
        },
        setFilterSubCategory: (state, action) => {
            state.filterSubCategory = action.payload;
            state.currentPage = 1;
        },
        setFilterBrand: (state, action) => {
            state.filterBrand = action.payload;
            state.currentPage = 1;
        },
        setFilterGender: (state, action) => {
            state.filterGender = action.payload;
            state.currentPage = 1;
        },
        setPriceRange: (state, action) => {
            state.priceRange = action.payload;
            state.currentPage = 1;
        },
        setRatingFilter: (state, action) => {
            state.ratingFilter = action.payload;
            state.currentPage = 1;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
        toggleFilters: (state) => {
            state.showFilters = !state.showFilters;
        },
        resetFilters: (state) => {
            return {
                ...initialState,
                viewMode: state.viewMode,
                products: state.products, // Keep products for smoother transition
                totalCount: state.totalCount,
                quickViewProduct: state.quickViewProduct
            };
        },
        setQuickViewProduct: (state, action) => {
            state.quickViewProduct = action.payload;
        },
        setDetailsError: (state, action) => {
            state.detailsError = action.payload;
        },
        clearDetailsError: (state) => {
            state.detailsError = null;
        },
        syncFromUrl: (state, action) => {
            const { search, category, subcategory, sortBy, brand, gender, minPrice, maxPrice, rating, page } = action.payload;
            if (search !== undefined) {
                state.searchTerm = search;
                state.debouncedSearchTerm = search;
            }
            if (category !== undefined) state.filterCategory = category || "all";
            if (subcategory !== undefined) state.filterSubCategory = subcategory || "all";
            if (brand !== undefined) state.filterBrand = brand || "all";
            if (gender !== undefined) state.filterGender = gender || "all";
            if (minPrice !== undefined && maxPrice !== undefined) {
                state.priceRange = [Number(minPrice) || 0, Number(maxPrice) || 100000];
            }
            if (rating !== undefined) state.ratingFilter = Number(rating) || 0;
            if (sortBy !== undefined) state.sortBy = sortBy || "name";
            if (page !== undefined) state.currentPage = Number(page) || 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchShopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
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
    setQuickViewProduct,
    setDetailsError,
    clearDetailsError,
    syncFromUrl
} = shopSlice.actions;

export default shopSlice.reducer;
