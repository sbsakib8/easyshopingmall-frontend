/**
 * Utility functions for product filtering
 */

/**
 * Maps category name to category ID
 * @param {string} categoryName - Category name to map
 * @param {Array} categories - Array of category objects from API
 * @returns {string} Category ID or "all"
 */
export const getCategoryId = (categoryName, categories = []) => {
    if (!categoryName || categoryName === "all") return "all";

    const category = categories.find(cat =>
        cat.name?.toLowerCase() === categoryName.toLowerCase() ||
        cat.slug?.toLowerCase() === categoryName.toLowerCase()
    );

    return category?.id || category?._id || "all";
};

/**
 * Maps subcategory name to subcategory ID
 * @param {string} subCategoryName - Subcategory name to map
 * @param {Array} subCategories - Array of subcategory objects from API
 * @returns {string} Subcategory ID or "all"
 */
export const getSubCategoryId = (subCategoryName, subCategories = []) => {
    if (!subCategoryName || subCategoryName === "all") return "all";

    const subCategory = subCategories.find(sub =>
        sub.name?.toLowerCase() === subCategoryName.toLowerCase() ||
        sub.slug?.toLowerCase() === subCategoryName.toLowerCase()
    );

    return subCategory?.id || subCategory?._id || "all";
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;

    return function debounced(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

/**
 * Builds filter params object for API calls
 * @param {Object} filters - Filter values
 * @returns {Object} Clean params object with only non-default values
 */
export const buildFilterParams = (filters = {}) => {
    const params = {};

    // Add search if present
    if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
    }

    // Add category if not "all"
    if (filters.categoryId && filters.categoryId !== "all") {
        params.categoryId = filters.categoryId;
    }

    // Add subcategory if not "all"
    if (filters.subCategoryId && filters.subCategoryId !== "all") {
        params.subCategoryId = filters.subCategoryId;
    }

    // Add price range if not default
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
        params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined && filters.maxPrice < 100000) {
        params.maxPrice = filters.maxPrice;
    }

    // Add brand if not "all"
    if (filters.brand && filters.brand !== "all") {
        params.brand = filters.brand;
    }

    // Add rating if > 0
    if (filters.rating && filters.rating > 0) {
        params.rating = filters.rating;
    }

    // Add gender if not "all"
    if (filters.gender && filters.gender !== "all") {
        params.gender = filters.gender;
    }

    // Add sort
    if (filters.sortBy) {
        params.sortBy = filters.sortBy;
    }

    // Add pagination
    if (filters.page) {
        params.page = filters.page;
    }

    if (filters.limit) {
        params.limit = filters.limit;
    }

    return params;
};

/**
 * Normalizes product data from API response
 * @param {Object} product - Raw product object from API
 * @returns {Object} Normalized product object
 */
export const normalizeProduct = (product) => {
    if (!product) return null;

    // Normalize category
    let categoryVal = "uncategorized";
    if (Array.isArray(product.category) && product.category.length > 0) {
        const c0 = product.category[0];
        categoryVal = typeof c0 === "string" ? c0 : c0?.name || String(c0);
    } else if (product.category && typeof product.category === "object") {
        categoryVal = product.category.name || String(product.category);
    } else if (product.category) {
        categoryVal = String(product.category);
    }

    // Normalize subCategory
    let subCategoryVal = "general";
    if (Array.isArray(product.subCategory) && product.subCategory.length > 0) {
        const s0 = product.subCategory[0];
        subCategoryVal = typeof s0 === "string" ? s0 : s0?.name || String(s0);
    } else if (product.subCategory && typeof product.subCategory === "object") {
        subCategoryVal = product.subCategory.name || String(product.subCategory);
    } else if (product.subCategory) {
        subCategoryVal = String(product.subCategory);
    }

    return {
        id: product._id || product.id || String(product._id || product.id || ""),
        name: product.name || product.productName || product.title || "Untitled",
        price: Number(product.price ?? product.sell_price ?? product.sellingPrice ?? 0) || 0,
        originalPrice: Number(product.originalPrice ?? product.mrp ?? product.price) || 0,
        retailSale: Number(product.productRank ?? 0) || 0,
        productStatus: product.productStatus || [],
        category: categoryVal,
        subCategory: subCategoryVal,
        brand: product.brand || product.manufacturer || "Brand",
        size: product.size || product.sizes || product.productSize || [],
        color: product.color || product.colors || [],
        rating: Number(product.rating ?? product.ratings) || 4,
        reviews: Number(product.reviews ?? 0) || 0,
        image: product.image || product.images?.[0] || "/img/product.jpg" || "https://placehold.co/600x400?text=No+Image",
        images: product.images?.length > 0 ? product.images : ["/img/product.jpg"],
        inStock: (product.stock ?? product.productStock ?? product.quantity ?? 0) > 0,
        stock: Number(product.stock ?? product.productStock ?? product.quantity ?? 0) || 0,
        tags: product.tags || [],
        isNew: isProductNew(product.createdAt || product.created_at || product.createdDate),
        discount: Number(product.discount ?? product.offerPercent ?? 0) || 0,
        gender: product.gender || "unisex",
        description: product.description || product.productDescription || "",
        sku: product.sku || "",
    };
};

/**
 * Determines if a product is new (created within last 30 days)
 * @param {string|Date} createdDate - Product creation date
 * @returns {boolean} True if product is new
 */
export const isProductNew = (createdDate) => {
    if (!createdDate) return true;
    const created = new Date(createdDate);
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return created > monthAgo;
};

/**
 * Formats price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: "৳")
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = "৳") => {
    if (typeof price !== "number") return `${currency}0`;
    return `${currency}${price.toFixed(2)}`;
};

/**
 * Calculates discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current/sale price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Extracts unique values from product array for a given field
 * @param {Array} products - Array of products
 * @param {string} field - Field name to extract
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (products, field) => {
    if (!Array.isArray(products)) return [];

    const values = products
        .map(p => p[field])
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index);

    return ["all", ...values];
};
