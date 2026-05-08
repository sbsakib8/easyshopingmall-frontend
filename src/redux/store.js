import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import dropshippingCartReducer from './dropshippingCartSlice';
import categoryReducer from "./categorySlice";
import orderSlice from './orderSlice';
import productReducer from "./productSlice";
import searchReducer from "./searchSlice";
import subcategoryRoute from "./subcategorySlice";
import userReducer from "./userSlice";
import wishlistReducer from "./wishlistSlice";
import shopReducer from "./shopSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory: subcategoryRoute,
    wishlist: wishlistReducer,
    cart: cartReducer,
    dropshippingCart: dropshippingCartReducer,
    order: orderSlice,
    search: searchReducer,
    shop: shopReducer,
  },
});