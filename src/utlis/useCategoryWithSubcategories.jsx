"use client";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CategoryAllGet } from "../hook/usecategory";
import { SubCategoryAllGet } from "../hook/useSubcategory";

export const useCategoryWithSubcategories = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchCategoriesAndSubcategories = useCallback(async () => {
        try {
            setLoading(true);
            const categoriesData = await CategoryAllGet(dispatch);
            const subcategoriesData = await SubCategoryAllGet(dispatch);

            // Normalize categories data
            const normalizedCategories = (categoriesData?.data || []).map(cat => ({
                id: cat._id,
                name: cat.categoryName || cat.name,
                image: cat.categoryImage || '',
            }));

            // Normalize subcategories data
            const normalizedSubcategories = (subcategoriesData?.data || []).map(subcat => ({
                id: subcat._id,
                name: subcat.subcategoryName || subcat.name,
                categoryId: subcat.categoryId || subcat.category,
                image: subcat.subcategoryImage || '',
            }));

            setCategories(normalizedCategories);
            setSubcategories(normalizedSubcategories);
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
