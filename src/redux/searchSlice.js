import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: { 
        query: "",
        adminProductSearchTerm: "",
        adminProductCategory: "All"
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearchQuery: (state) => {
            state.query = "";
        },
        setAdminProductSearchTerm: (state, action) => {
            state.adminProductSearchTerm = action.payload;
        },
        setAdminProductCategory: (state, action) => {
            state.adminProductCategory = action.payload;
        }
    },
});

export const { setSearchQuery, clearSearchQuery, setAdminProductSearchTerm, setAdminProductCategory } = searchSlice.actions;
export default searchSlice.reducer;
