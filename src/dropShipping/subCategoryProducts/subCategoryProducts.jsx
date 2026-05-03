"use client"
import { addToWishlistApi, removeFromWishlistApi } from '@/src/hook/useWishlist';
import { isProductNew } from '@/src/utlis/filterHelpers';
import { useGetProduct } from '@/src/utlis/userProduct';
import { useWishlist } from '@/src/utlis/useWishList';
import { ArrowDownToLine, Heart, Star, Search, Sparkles, ShoppingCart, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { dsCartAdd } from '@/src/redux/dropshippingCartSlice';

// Helper for image download
const handleDownloadImage = async (e, imageUrl, productName) => {
  e.stopPropagation();
  if (!imageUrl) return;

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${productName || "product"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Image download failed:", error);
    toast.error("Download failed");
  }
};

const ProductCard = React.memo(({ product, viewMode, toggleWishlist, wishlist, router, dispatch, dsCartItems, user }) => {
  if (!product) return null;

  const isWishlisted = useMemo(() => {
    return (wishlist || []).some((item) => item.id === product._id || item._id === product._id);
  }, [wishlist, product._id]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user?._id) {
      toast.error("Please login to add to cart");
      return;
    }
    
    dispatch(dsCartAdd({ 
      productId: product, 
      quantity: 1, 
      price: product.price || 0,
      sellingPrice: product.price || 0,
      profit: 0
    }));
    
    toast.success("Added to dropshipping cart");
  };

  const ratingValue = Number(product.rating || product.ratings || 0);
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
          ? "text-yellow-400 fill-current"
          : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <div
      onClick={() => router.push(`/productdetails/${product._id}`)}
      className={`group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all cursor-pointer ${viewMode === "list" ? "flex" : "flex flex-col h-full"}`}
    >
      <div className={`relative ${viewMode === "list" ? "w-48 shrink-0" : "w-full"}`}>
        <img
          src={product.images?.[0] || "/banner/img/placeholder.png"}
          alt={product.productName}
          className={`w-full object-cover ${viewMode === "list" ? "h-full" : "h-40 sm:h-48"}`}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">NEW</span>
          )}
          {product.productStatus && product.productStatus.length > 0 && !product.productStatus.includes("none") && (
            <span className={`${product.productStatus.includes("hot") ? 'bg-red-500' : 'bg-blue-500'} text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider`}>
              {Array.isArray(product.productStatus) ? product.productStatus[0] : product.productStatus}
            </span>
          )}
        </div>

        {product.productStock < 1 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-[10px] uppercase">Out of Stock</span>
          </div>
        )}
      </div>

      <div className={`p-3 flex flex-col ${viewMode === "list" ? "flex-1" : "flex-1"}`}>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-primary-color line-clamp-2 transition-colors">
            {product.productName}
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wide">{product.brand || 'No Brand'}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {renderStars(ratingValue)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">({ratingValue})</span>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-400">Tk</span>
            <span className="text-lg font-black text-slate-900">{product.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => handleDownloadImage(e, product.images?.[0], product.productName)}
              className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors group/btn"
            >
              <ArrowDownToLine className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-bold">Save</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`flex items-center justify-center py-2 rounded-lg transition-all ${isWishlisted ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 hover:text-red-500"}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.productStock < 1}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2.5 rounded-lg font-black flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

const ProductSkeleton = ({ viewMode }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden animate-pulse ${viewMode === "list" ? "flex" : "flex flex-col h-full"}`}>
    <div className={`bg-slate-200 ${viewMode === "list" ? "w-48 h-full" : "w-full h-40 sm:h-48"}`} />
    <div className="p-4 space-y-3 flex-1">
      <div className="h-4 bg-slate-200 rounded-full w-3/4" />
      <div className="h-3 bg-slate-200 rounded-full w-1/2" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 bg-slate-200 rounded-full" />)}
      </div>
      <div className="h-6 bg-slate-200 rounded-lg w-1/3 mt-4" />
      <div className="h-10 bg-slate-200 rounded-lg w-full" />
    </div>
  </div>
);

const SubCategoryProductsContent = ({ id }) => {
  const router = useRouter();
  const params = useSearchParams();
  const pageType = params.get('pageType');
  const dispatch = useDispatch();

  const viewMode = useSelector((state) => state.shop.viewMode);
  const dsCartItems = useSelector((state) => state.dropshippingCart.items);
  const user = useSelector((state) => state.user?.data);
  const { wishlist } = useWishlist();

  const [page, setPage] = useState(1);
  const limit = 30;

  const formData = useMemo(() => ({
    page,
    limit,
    search: "",
    subCategoryId: id,
  }), [page, id]);

  useEffect(() => {
    setPage(1);
  }, [id]);

  const { product: products, totalCount, loading: productsLoading } = useGetProduct(formData);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (pageType === 'new-products') {
      return products.filter(product => isProductNew(product.createdAt));
    }
    return products;
  }, [products, pageType]);

  const totalPages = Math.ceil((totalCount || 0) / limit);

  const toggleWishlist = useCallback(async (product) => {
    if (!user?._id) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    try {
      const exists = (wishlist || []).some((i) => i.id === product._id || i._id === product._id);
      if (exists) {
        await removeFromWishlistApi(product._id, dispatch);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistApi(product._id, dispatch);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist");
    }
  }, [wishlist, dispatch, user?._id]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  const showStartDots = page > 3;
  const showEndDots = pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages;

  if (!productsLoading && filteredProducts.length < 1) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm min-h-[50vh]">
        <div className="mb-8 relative">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center">
            <Search className="w-12 h-12 text-slate-300" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-3 max-w-sm">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Products Found</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            We couldn't find any products in this category. New items are arriving soon!
          </p>
        </div>

        <button
          onClick={() => router.push('/all-products')}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black shadow-md hover:shadow-lg transition-all"
        >
          Explore All Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="container mx-auto px-2 sm:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {productsLoading
          ? [...Array(10)].map((_, i) => <ProductSkeleton key={i} viewMode={viewMode} />)
          : filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              viewMode={viewMode}
              product={product}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
              router={router}
              dispatch={dispatch}
              dsCartItems={dsCartItems}
              user={user}
            />
          ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap px-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            <Loader2 className={`w-4 h-4 rotate-180 ${productsLoading ? 'animate-spin' : ''}`} />
          </button>

          {showStartDots && (
            <button onClick={() => setPage(1)} className="w-10 h-10 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:border-emerald-600">1</button>
          )}
          {showStartDots && <span className="text-slate-400 font-black">...</span>}

          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl font-black text-sm transition-all border ${page === p ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-transparent text-white shadow-md scale-110" : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"}`}
            >
              {p}
            </button>
          ))}

          {showEndDots && <span className="text-slate-400 font-black">...</span>}
          {showEndDots && (
            <button onClick={() => setPage(totalPages)} className="w-10 h-10 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:border-primary-color">{totalPages}</button>
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            <Loader2 className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

const SubCategoryProducts = (props) => (
  <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
    <SubCategoryProductsContent {...props} />
  </Suspense>
);

export default SubCategoryProducts;