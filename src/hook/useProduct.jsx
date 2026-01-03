import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// product uploard
export const ProductCreate = async (formData,) => {
  try {
    const response = await axios.post(`${UrlBackend}/products/create`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};


// all product get 
export const ProductAllGet = async (formData,) => {
  try {
    console.log('📤 API Request - ProductAllGet called with:', formData);
    const response = await axios.post(`${UrlBackend}/products/get`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json", // crucial!
      },
    });
    
    console.log('📥 API Response - Full response.data:', response.data);
    
    // Extract products array from response
    const products = response.data?.products || response.data?.data || response.data || [];
    
    // Extract unique categories and subcategories
    const categories = new Set();
    const subCategories = new Set();
    
    if (Array.isArray(products)) {
      products.forEach(product => {
        // Handle category
        if (Array.isArray(product.category)) {
          product.category.forEach(cat => {
            const catName = typeof cat === 'string' ? cat : (cat?.name || String(cat));
            if (catName) categories.add(catName);
          });
        } else if (product.category) {
          const catName = typeof product.category === 'string' ? product.category : (product.category?.name || String(product.category));
          if (catName) categories.add(catName);
        }
        
        // Handle subcategory
        if (Array.isArray(product.subCategory)) {
          product.subCategory.forEach(subCat => {
            const subCatName = typeof subCat === 'string' ? subCat : (subCat?.name || String(subCat));
            if (subCatName) subCategories.add(subCatName);
          });
        } else if (product.subCategory) {
          const subCatName = typeof product.subCategory === 'string' ? product.subCategory : (product.subCategory?.name || String(product.subCategory));
          if (subCatName) subCategories.add(subCatName);
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};


//  delete
export const ProductDelete = async (_id) => {
  try {
    const response = await axios.delete(`${UrlBackend}/products/delete-product`, {
      data: { _id },
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    throw error;
  }
};


// update
export const ProductUpdate = async (formData) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/products/update-product-details`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("update error:", error.response?.data || error.message);
    throw error;
  }
};

// sockeet io product update
export const ProductNotification = async (formData) => {
  try {
    const response = await axios.post(
      `${UrlBackend}/notification`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("update error:", error.response?.data || error.message);
    throw error;
  }
};

