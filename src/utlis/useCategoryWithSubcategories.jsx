"use client";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CategoryAllGet } from "../hook/usecategory";
import { SubCategoryAllGet } from "../hook/useSubcategory";

export const useCategoryWithSubcategories = (initialCategories = null, initialSubcategories = null) => {
    const normalizeCategories = (data) => (data || []).map(cat => ({
        id: cat._id,
        name: cat.categoryName || cat.name,
        slug: cat.slug || cat.categorySlug || '',
        image: cat.categoryImage || '',
    }));

    const normalizeSubcats = (data) => (data || []).map(subcat => ({
        id: subcat._id,
        name: subcat.subcategoryName || subcat.name,
        slug: subcat.slug || subcat.subcategorySlug || '',
        categoryId: subcat.categoryId || subcat.category,
        image: subcat.subcategoryImage || '',
    }));

    const [categories, setCategories] = useState(initialCategories?.length > 0 ? normalizeCategories(initialCategories) : []);
    const [subcategories, setSubcategories] = useState(initialSubcategories?.length > 0 ? normalizeSubcats(initialSubcategories) : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchCategoriesAndSubcategories = useCallback(async () => {
        // Skip if we already have initial data or are already fetching
        if (categories.length > 0 && subcategories.length > 0) {
            return;
        }
        try {
            setLoading(true);
            const categoriesData = await CategoryAllGet(dispatch);
            const subcategoriesData = await SubCategoryAllGet(dispatch);

            // Normalize categories data
            const normCategories = normalizeCategories(categoriesData?.data || []);

            // Normalize subcategories data
            const normSubcategories = normalizeSubcats(subcategoriesData?.data || []);

            setCategories(normCategories);
            setSubcategories(normSubcategories);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories and subcategories:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCategoriesAndSubcategories();
    }, [fetchCategoriesAndSubcategories]);

    // Get subcategories for a specific category
    const getSubcategoriesForCategory = useCallback((categoryId) => {
        return subcategories.filter(sub =>
            sub.categoryId === categoryId || sub.categoryId?._id === categoryId
        );
    }, [subcategories]);

    return {
        categories,
        subcategories,
        loading,
        error,
        refetch: fetchCategoriesAndSubcategories,
        getSubcategoriesForCategory,
    };
};
