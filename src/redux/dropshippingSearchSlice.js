import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDropshippingSearch = createAsyncThunk(
  "dropshippingSearch/fetch",
  async ({ query, mode }, { rejectWithValue }) => {
    try {
      const body =
        mode === "sky"
          ? { skyTitle: query, page: 1, limit: 50 }
          : { skyTitle: query, tags: query, page: 1, limit: 50 };

      const res = await fetch("/api/dropshipping-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      return json;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dropshippingSearchSlice = createSlice({
  name: "dropshippingSearch",
  initialState: {
    query: "",
    mode: "text",
    results: [],
    titleMatches: [],
    skyMatches: [],
    loading: false,
    error: null,
    searched: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.titleMatches = [];
      state.skyMatches = [];
      state.searched = false;
      state.error = null;
    },
    resetSearch: (state) => {
      state.query = "";
      state.results = [];
      state.titleMatches = [];
      state.skyMatches = [];
      state.loading = false;
      state.error = null;
      state.searched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropshippingSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searched = true;
      })
      .addCase(fetchDropshippingSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data || [];
        state.titleMatches = action.payload.titleMatches || [];
        state.skyMatches = action.payload.skyMatches || [];
      })
      .addCase(fetchDropshippingSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setMode, clearResults, resetSearch } =
  dropshippingSearchSlice.actions;
export default dropshippingSearchSlice.reducer;
