import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
            state.filterSubCategory = "all"; // Reset subcat when cat changes
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
            return { ...initialState, viewMode: state.viewMode };
        },
        syncFromUrl: (state, action) => {
            const { search, category, subcategory, sortBy } = action.payload;
            if (search !== undefined) {
                state.searchTerm = search;
                state.debouncedSearchTerm = search;
            }
            if (category !== undefined) state.filterCategory = category || "all";
            if (subcategory !== undefined) state.filterSubCategory = subcategory || "all";
            if (sortBy !== undefined) state.sortBy = sortBy || "name";
        }
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
    syncFromUrl
} = shopSlice.actions;

export default shopSlice.reducer;
