import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice"
import  subcategoryRoute  from "./subcategorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory:subcategoryRoute

  },
});