"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import AddtoCartBtn from "@/src/helper/Buttons/AddtoCartBtn";
import { fuzzyFilterAndSort } from "@/src/utlis/fuzzySearch";
import { useWishlist } from "@/src/utlis/useWishList";
import { cn } from "@/src/utlis/utils";
import { addToCartApi } from "../../hook/useCart";
import {
  addToWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
} from "../../hook/useWishlist";
import { setQuickViewProduct } from "../../redux/shopSlice";
import { PopularProductsSkeleton } from "../loading/HomeSkeleton";
import Container from "../shared/Container";
import Section from "../shared/Section";

const isProductNew = (createdDate) => {
  if (!createdDate) return true;
  const created = new Date(createdDate);
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return created > monthAgo;
};

const PRODUCTS_PER_PAGE = 24;

const PopularProducts = ({ initialData }) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [localWishlist, setLocalWishlist] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState(initialData?.products || []);
  const [errorState, setErrorState] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(
    !initialData?.products?.length,
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const { wishlist } = useWishlist();
  const user = useSelector((state) => state.user.data);

  const shopCategories = initialData?.categories || [];
  const shopSubcategories = initialData?.subcategories || [];

  const subcategoryLookup = useMemo(() => {
    const lookup = {};
    (shopSubcategories || []).forEach((sc) => {
      const name = (sc.subcategoryName || sc.name || "").toUpperCase();
      if (name) lookup[name] = sc;
    });
    return lookup;
  }, [shopSubcategories]);

  const manualFetch = useCallback(async () => {
    try {
      setLoadingLocal(true);
      setErrorState(false);
      const res = await ProductAllGet({ page: 1, limit: 80 });
      const fetchedProducts =
        res.data || res.products || (Array.isArray(res) ? res : []);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Manual fetch error:", err);
      setErrorState(true);
    } finally {
      setLoadingLocal(false);
    }
  }, []);

  useEffect(() => {
    if (initialData?.products?.length) {
      setProducts(initialData.products);
      setLoadingLocal(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (!products.length && !errorState && !loadingLocal) {
      manualFetch();
    }
  }, [products.length, errorState, loadingLocal, manualFetch]);

  useEffect(() => {
    getWishlistApi(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setLocalWishlist(new Set((wishlist || []).map((item) => item.id)));
  }, [wishlist]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, debouncedSearchTerm]);

  const loading = loadingLocal;
  const isError = errorState;

  if (loading && !isError) return <PopularProductsSkeleton />;

  const mergedData = useMemo(() => {
    if (!products || !shopCategories) return { products: [], categories: [] };

    const categories = shopCategories.map((c) => ({
      id: c.name?.toUpperCase(),
      name: c.name?.toUpperCase(),
      icon: c.icon || <Sparkles className="w-4 h-4" />,
      color: c.color || "from-slate-500 to-gray-600",
    }));

    const productsData = products.map((p) => {
      let categoryName = "GENERAL";
      if (Array.isArray(p.category) && p.category.length > 0) {
        const cat = p.category[0];
        categoryName =
          (typeof cat === "string" ? cat : cat?.name)?.toUpperCase() ||
          "GENERAL";
      } else if (typeof p.category === "object" && p.category?.name) {
        categoryName = p.category.name?.toUpperCase() || "GENERAL";
      } else if (typeof p.category === "string") {
        categoryName = p.category.toUpperCase();
      }

      let subCategoryName = null;
      if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
        const subCat = p.subCategory[0];
        subCategoryName =
          (typeof subCat === "string" ? subCat : subCat?.name)?.toUpperCase() ||
          null;
      } else if (typeof p.subCategory === "object" && p.subCategory?.name) {
        subCategoryName = p.subCategory.name?.toUpperCase() || null;
      } else if (typeof p.subCategory === "string") {
        subCategoryName = p.subCategory.toUpperCase();
      }

      return {
        id: p._id,
        name: p.productName,
        image: p.images?.[0] || "",
        price: p.price,
        originalPrice: p.oldPrice || p.price,
        rating: p.ratings,
        productStatus: p.productStatus,
        retailSale: p.productRank,
        reviews: p.reviews,
        category: categoryName,
        subCategory: subCategoryName,
        badge: p.tags?.[0] || "New",
        tags: p.tags || [],
        isNew: isProductNew(p.createdAt || p.created_at || p.createdDate),
        discount:
          p.discount ||
          (p.oldPrice && p.price
            ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
            : 0),
      };
    });

    return { products: productsData, categories };
  }, [products, shopCategories]);

  if (!mergedData.categories.some((cat) => cat.id === "ALL")) {
    mergedData.categories.unshift({
      id: "ALL",
      name: "ALL",
      icon: <Sparkles className="w-4 h-4" />,
      color: "from-slate-500 to-gray-600",
    });
  }

  const currentProducts = useMemo(() => {
    if (activeCategory === "ALL") {
      const productsByCategory = {};

      mergedData.products.forEach((p) => {
        if (!productsByCategory[p.category]) {
          productsByCategory[p.category] = {};
        }

        const subCatKey = p.subCategory || "NO_SUBCATEGORY";
        if (!productsByCategory[p.category][subCatKey]) {
          productsByCategory[p.category][subCatKey] = [];
        }
        productsByCategory[p.category][subCatKey].push(p);
      });

      const result = [];
      Object.keys(productsByCategory).forEach((catName) => {
        const subcategories = productsByCategory[catName];
        Object.keys(subcategories).forEach((subCatName) => {
          result.push(...subcategories[subCatName].slice(0, 5));
        });
      });

      const seen = new Set();
      return result.filter((p) => {
        const id = p.id || p._id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    const categoryProducts = mergedData.products.filter(
      (p) => p.category === activeCategory,
    );

    const productsBySubCategory = {};
    categoryProducts.forEach((p) => {
      const subCatKey = p.subCategory || "NO_SUBCATEGORY";
      if (!productsBySubCategory[subCatKey]) {
        productsBySubCategory[subCatKey] = [];
      }
      productsBySubCategory[subCatKey].push(p);
    });

    const result = [];
    Object.keys(productsBySubCategory).forEach((subCatName) => {
      result.push(...productsBySubCategory[subCatName].slice(0, 5));
    });

    return result;
  }, [mergedData.products, activeCategory]);

  const filteredProducts = useMemo(() => {
    return fuzzyFilterAndSort(currentProducts, debouncedSearchTerm);
  }, [currentProducts, debouncedSearchTerm]);

  const { renderItems, totalPages } = useMemo(() => {
    const allItems = [];

    filteredProducts.forEach((p) => {
      allItems.push({ _type: "product", data: p, key: p.id });
    });

    if (filteredProducts.length > 0 && currentPage === 1) {
      let seeMoreUrl = "/shop";
      let seeMoreLabel = "All Products";
      if (activeCategory !== "ALL") {
        seeMoreUrl = `/shop?category=${encodeURIComponent(activeCategory)}`;
        seeMoreLabel = activeCategory;
      }
      allItems.push({
        _type: "seeMore",
        key: "seeMore-single",
        subCategoryName: seeMoreLabel,
        seeMoreUrl,
      });
    }

    const total = Math.max(1, Math.ceil(allItems.length / PRODUCTS_PER_PAGE));
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedItems = allItems.slice(start, start + PRODUCTS_PER_PAGE);

    return { renderItems: paginatedItems, totalPages: total };
  }, [filteredProducts, activeCategory, currentPage]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      Trending: "bg-gradient-to-r from-pink-500 to-rose-500",
      Hot: "bg-gradient-to-r from-red-500 to-orange-500",
      New: "bg-gradient-to-r from-green-500 to-emerald-500",
      Sale: "bg-gradient-to-r from-purple-500 to-violet-500",
      Bestseller: "bg-gradient-to-r from-blue-500 to-indigo-500",
      Featured: "bg-gradient-to-r from-amber-500 to-yellow-500",
      Premium: "bg-gradient-to-r from-gray-700 to-gray-900",
      Popular: "bg-gradient-to-r from-teal-500 to-cyan-500",
      Sport: "bg-gradient-to-r from-orange-500 to-red-500",
      Luxury: "bg-gradient-to-r from-purple-600 to-pink-600",
      Organic: "bg-gradient-to-r from-green-600 to-lime-600",
      Eco: "bg-gradient-to-r from-emerald-600 to-teal-600",
      Smart: "bg-gradient-to-r from-indigo-600 to-blue-600",
      Exclusive: "bg-gradient-to-r from-violet-600 to-purple-600",
    };
    return colors[badge] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const toggleWishlist = async (id) => {
    if (!user?._id) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    setLocalWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });

    try {
      const isInWishlist = localWishlist.has(id);

      if (isInWishlist) {
        await removeFromWishlistApi(id, dispatch);
      } else {
        await addToWishlistApi(id, dispatch);
      }

      await getWishlistApi(dispatch);
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user?._id) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCartApi(
        {
          userId: user._id,
          productId: product.id,
          quantity: 1,
          price: product.price,
        },
        dispatch,
      );
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      const msg = err?.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
    }
  };

  const renderSeeMoreCard = (item) => (
    <Link
      key={item.key}
      href={item.seeMoreUrl}
      className="group bg-white rounded-md shadow-md overflow-hidden hover:shadow-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary transition-all duration-300 min-h-[280px]"
    >
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <ArrowRight className="w-7 h-7 text-primary" />
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors duration-300">
          See More
        </span>
        <span className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-[140px]">
          {item.subCategoryName}
        </span>
      </div>
    </Link>
  );

  const renderProductCard = (product) => (
    <div
      key={product.key}
      onClick={() => {
        dispatch(setQuickViewProduct(product.data));
        router.push(`/productdetails/${product.data.id}`);
      }}
      className="group bg-white rounded-md shadow-md overflow-hidden hover:shadow-xl cursor-pointer"
    >
      <div className="relative h-32">
        <Image
          src={product.data.image || "/img/product.jpg"}
          alt={product.data.name}
          width={400}
          height={400}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-0 left-0 flex justify-between w-full">
          <div className="flex items-start">
            {product.data.isNew && (
              <span className="bg-primary text-primary-content px-1 py-1 rounded text-[8px] font-semibold">
                NEW
              </span>
            )}

            {product.data.retailSale > product.data.price ? (
              <span className="bg-accent text-accent-content px-1 py-1 mx-[2px] rounded text-[8px] font-semibold">
                -{product.data.retailSale - product.data.price}৳
              </span>
            ) : null}
          </div>

          {product.data.productStatus?.length > 0 && (
            <span
              className={` ${
                product.data?.productStatus?.includes("hot")
                  ? "text-red-500"
                  : "text-blue-400 "
              } max-h-6  bg-black px-1 py-1 rounded-md text-xs font-bold ${
                product.data?.productStatus?.includes("none") ? "hidden" : ""
              }`}
            >
              {product.data?.productStatus}
            </span>
          )}
        </div>

        <div
          className={`absolute ${
            product.data.productStatus?.length > 0 ? "top-6" : "top-0"
          }  bg-white rounded-md right-0 space-y-2`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.data.id);
            }}
            className={`p-2 cursor-pointer rounded-lg
      ${
        localWishlist.has(product.data.id)
          ? "text-red-500 bg-red-100"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      }`}
          >
            <Heart
              className="w-3 h-3"
              fill={localWishlist.has(product.data.id) ? "red" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.data.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {product.data.category}
          </p>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {renderStars(product.data.rating)}
            </div>
            <span className="text-xs text-gray-500">
              ({product.data.rating})
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-bold text-red-600">
              Tk {product.data.price}
            </span>
            {product.data.retailSale > product.data.price && (
              <span className="text-xs text-gray-400 line-through">
                Tk {product.data.retailSale.toFixed(2)}
              </span>
            )}
          </div>

          <AddtoCartBtn
            productId={product.data.id}
            className="w-full py-1.5 px-2 bg-primary/80 hover:bg-primary rounded font-medium text-xs cursor-pointer mt-auto"
          >
            <span className="flex items-center justify-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </span>
          </AddtoCartBtn>
        </div>
      </div>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-primary hover:text-white cursor-pointer",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-400 text-sm">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              currentPage === page
                ? "bg-primary text-white shadow-lg"
                : "text-gray-600 hover:bg-primary hover:text-white",
            )}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-400 text-sm">...</span>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-primary hover:text-white cursor-pointer",
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <Section className="pt-0 md:pt-0">
      <Container className="space-y-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary via-primary/60 to-secondary/30 bg-clip-text text-transparent leading-relaxed">
              Popular Products
            </h1>
            <p className="text-slate-400 text-sm sm:text-sm md:text-base lg:text-lg">
              Discover amazing products across all categories
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
              <input
                type="search"
                placeholder="Search products by title, tags, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 text-slate-400 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="w-full overflow-hidden flex items-center justify-center">
            <div
              className={cn(
                "flex items-center gap-3 pb-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin",
              )}
            >
              {mergedData.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 snap-start bg-gray-100 border border-gray-200 text-gray-600 text-xs md:text-sm lg:text-base uppercase",
                    {
                      "bg-primary text-primary-content shadow-lg":
                        activeCategory === cat.id,
                      "hover:shadow hover:bg-gray-200":
                        activeCategory !== cat.id,
                    },
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 pt-4">
          {renderItems.map((item) =>
            item._type === "seeMore"
              ? renderSeeMoreCard(item)
              : renderProductCard(item),
          )}

          {filteredProducts.length === 0 && !isError && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 px-4 bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div
                  className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/10 blur-[120px] rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-10 relative">
                  <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-emerald-50 transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                    <Search className="w-20 h-20 text-emerald-600 animate-[bounce_3s_infinite]" />
                    <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-pulse" />
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-lg px-6">
                  <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    Data is Coming!{" "}
                    <span className="inline-block animate-bounce">✨</span>
                  </h3>
                  <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed">
                    We're meticulously curating our latest collection. Stay
                    tuned! In the meantime, try adjusting your search or explore
                    other categories.
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-6">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("ALL");
                    }}
                    className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-bold text-lg shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-400"
                  >
                    Check All Products
                  </button>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-12 py-5 bg-white/50 border border-slate-200 text-slate-700 backdrop-blur-sm rounded-2xl font-bold text-lg hover:bg-white hover:border-emerald-200 transition-all duration-400 shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="col-span-full text-center py-16 bg-red-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-red-200">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Failed to load products
              </h3>
              <p className="text-gray-600 mb-8">
                There was a problem connecting to the server. Please try again.
              </p>
              <button
                onClick={manualFetch}
                className="px-8 py-3 bg-red-500 text-accent-content rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all shadow-lg shadow-red-200 font-bold"
              >
                Retry Fetching Data
              </button>
            </div>
          )}
        </div>

        {renderPagination()}
      </Container>
    </Section>
  );
};

export default PopularProducts;
