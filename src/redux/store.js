import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import categoryReducer from "./categorySlice";
import orderSlice from './orderSlice';
import productReducer from "./productSlice";
import subcategoryRoute from "./subcategorySlice";
import userReducer from "./userSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory: subcategoryRoute,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderSlice
  },
});