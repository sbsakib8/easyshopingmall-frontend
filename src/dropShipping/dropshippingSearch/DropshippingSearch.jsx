"use client";

import {
  addToWishlistApi,
  removeFromWishlistApi,
} from "@/src/hook/useWishlist";
import { useWishlist } from "@/src/utlis/useWishList";
import {
  ArrowDownToLine,
  Camera,
  Heart,
  ImageIcon,
  Loader2,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Type,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { dsCartAdd } from "@/src/redux/dropshippingCartSlice";
import {
  fetchDropshippingSearch,
  setSearchQuery,
  setMode,
  clearResults,
} from "@/src/redux/dropshippingSearchSlice";
import Container from "@/src/compronent/shared/Container";

// ─── Image download helper ────────────────────────────────────────────────────
const handleDownloadImage = async (e, imageUrl, productName) => {
  e.stopPropagation();
  if (!imageUrl) return;
  try {
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${productName || "product"}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    toast.error("Download failed");
  }
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, wishlist, dispatch, user, wishlistLoading }) => {
  const router = useRouter();
  if (!product) return null;

  const isWishlisted = (wishlist || []).some(
    (item) => item?._id === product._id || item?.id === product._id
  );

  const ratingValue = Number(product.rating || product.ratings || 0);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`size-2.5 lg:size-3.5 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const handleAddToCart = () => {
    if (!user?._id) {
      toast.error("Please login to add to cart");
      return;
    }
    dispatch(
      dsCartAdd({
        productId: product,
        quantity: 1,
        price: product.dropshippingPrice ?? product.price ?? 0,
        sellingPrice: product.dropshippingPrice ?? product.price ?? 0,
        profit: 0,
      })
    );
    toast.success("Added to dropshipping cart");
  };

  const toggleWishlist = async () => {
    if (!user?._id) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product._id, dispatch);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistApi(product._id, dispatch);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div
      onClick={() => router.push(`/productdetails/${product._id}`)}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-400/40 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden w-full">
        <Image
          src={
            product.images?.[0] ||
            (Array.isArray(product.image) ? product.image[0] : product.image) ||
            "/img/product.jpg"
          }
          alt={product.productName}
          width={200}
          height={200}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top actions - visible on mobile */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col gap-1 sm:gap-1.5 z-20">
          <button
            onClick={(e) =>
              handleDownloadImage(e, product.images?.[0], product.productName)
            }
            className="bg-white/90 hover:bg-white shadow-md p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-gray-600 hover:text-emerald-600 transition-all backdrop-blur-sm"
            title="Save Image"
          >
            <ArrowDownToLine className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
            disabled={wishlistLoading}
            className={`shadow-md p-1 sm:p-1.5 rounded-lg sm:rounded-xl transition-all backdrop-blur-sm ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Out of stock */}
        {product.productStock < 1 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-600 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-xs font-semibold tracking-wider">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Color chips */}
        {product.color?.length > 0 && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex gap-0.5 sm:gap-1">
            {product.color.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-1.5 sm:p-2 md:p-3.5">
        <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2 text-[9px] sm:text-[10px] md:text-sm md:leading-tight mb-0.5 sm:mb-1 leading-tight">
          {product.productName}
        </h3>
        <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium mb-1 sm:mb-2 uppercase hidden md:block">
          {product.brand || "No Brand"}
        </p>

        <div className="hidden sm:flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-0.5 sm:gap-1">{renderStars(ratingValue)}</div>
          <p className="text-xs sm:text-sm font-bold text-emerald-600">
            ৳
            {(user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING"))
              ? (product.dropshippingPrice ?? product.price)
              : product.price}
          </p>
        </div>

        {/* Mobile price */}
        <div className="sm:hidden mt-auto">
          <p className="text-[10px] font-bold text-emerald-600">
            ৳
            {(user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING"))
              ? (product.dropshippingPrice ?? product.price)
              : product.price}
          </p>
        </div>

        <div className="mt-auto hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.productStock < 1}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-200 text-white py-1.5 sm:py-2 px-2 rounded-xl font-medium text-[8px] sm:text-[9px] md:text-xs tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-md active:scale-[0.97] transition-all"
          >
            <ShoppingCart className="size-3" />
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const SearchSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="bg-white border border-slate-100 rounded-3xl overflow-hidden animate-pulse shadow-sm"
        style={{ animationDelay: `${i * 40}ms` }}
      >
        <div className="h-32 md:h-44 bg-slate-100" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-4/5" />
          <div className="h-3 bg-slate-100 rounded-full w-3/5" />
          <div className="h-3 bg-slate-100 rounded-full w-2/5" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ mode }) => (
  <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[40vh] text-center space-y-3 sm:space-y-4 py-10 sm:py-16 px-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 sm:mb-4">
      {mode === "image" ? (
        <Camera className="w-7 h-7 sm:w-9 sm:h-9 text-slate-300" />
      ) : (
        <Search className="w-7 h-7 sm:w-9 sm:h-9 text-slate-300" />
      )}
    </div>
    <h3 className="text-lg sm:text-xl font-black text-slate-800">No Products Found</h3>
    <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xs">
      {mode === "image"
        ? "No products matched the colors in your image. Try a different photo."
        : "No products matched your search. Try different keywords."}
    </p>
  </div>
);

// ─── Main search component ────────────────────────────────────────────────────
const placeholders = [
  "Search by product name...",
  "Try 'blue shirt'...",
  "Search 'cotton saree'...",
  "Find 'leather bag'...",
  "Search 'running shoes'...",
];

const DropshippingSearchContent = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user?.data);
  const { wishlist, loading: wishlistLoading } = useWishlist();

  // Redux state
  const {
    query,
    mode,
    results,
    titleMatches,
    skyMatches,
    loading,
    searched,
    error,
  } = useSelector((state) => state.dropshippingSearch);

  // Local UI state
  const [detectedColors, setDetectedColors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Cycle placeholders
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Auto-search if ?q= param is set
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      dispatch(setSearchQuery(q));
      dispatch(fetchDropshippingSearch({ query: q, mode: "text" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show error toast
  useEffect(() => {
    if (error) toast.error("Search failed. Please try again.");
  }, [error]);

  // ── Search handlers ────────────────────────────────────────────────────────
  const handleTextSearch = useCallback(
    (searchQuery) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;
      setDetectedColors([]);
      dispatch(fetchDropshippingSearch({ query: q, mode: "text" }));
    },
    [query, dispatch]
  );

  const handleSkySearch = useCallback(
    (searchQuery) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;
      setDetectedColors([]);
      dispatch(fetchDropshippingSearch({ query: q, mode: "sky" }));
    },
    [query, dispatch]
  );

  // ── Grouped results from Redux ────────────────────────────────────────────
  const groupedResults = useCallback(() => {
    const sections = [];
    if (titleMatches.length > 0) {
      sections.push({ label: "Search by title", products: titleMatches });
    }
    if (skyMatches.length > 0) {
      sections.push({ label: "Related products", products: skyMatches });
    }
    return sections;
  }, [titleMatches, skyMatches]);

  // ── Image search ───────────────────────────────────────────────────────────
  const handleImageSearch = useCallback(async () => {
    if (!imageFile) return;
    const nameWithoutExt = imageFile.name.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt.replace(/[-_]/g, " ").trim();
    dispatch(setSearchQuery(cleanName));
    dispatch(fetchDropshippingSearch({ query: cleanName, mode: "text" }));
  }, [imageFile, dispatch]);

  // ── Image file handling ────────────────────────────────────────────────────
  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setImageFile(file);
    dispatch(clearResults());
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    dispatch(clearResults());
    setDetectedColors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (mode === "sky") handleSkySearch();
      else handleTextSearch();
    }
  };

  const handleModeChange = (newMode) => {
    dispatch(setMode(newMode));
    dispatch(clearResults());
    if (newMode !== "image") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleQueryChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleClearQuery = () => {
    dispatch(setSearchQuery(""));
    dispatch(clearResults());
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
      {/* Decorative background elements - hidden on mobile to prevent overflow */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-teal-100/40 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-12 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50 text-emerald-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-emerald-200/50 mb-2">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Dropshipping Finder
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium max-w-md mx-auto px-2">
            Search by keyword or upload an image — discover products instantly
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white border border-slate-100 rounded-2xl p-1 flex gap-1 shadow-sm">
            <button
              id="mode-text"
              onClick={() => handleModeChange("text")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                mode === "text"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Search by title
            </button>
            <button
              id="mode-sky"
              onClick={() => handleModeChange("sky")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                mode === "sky"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Search by sky
            </button>
            <button
              id="mode-image"
              onClick={() => handleModeChange("image")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                mode === "image"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Image Search
            </button>
          </div>
        </div>

        {/* ── TEXT SEARCH INPUT ── */}
        {(mode === "text" || mode === "sky") && (
          <div className="max-w-2xl mx-auto px-2 sm:px-0">
            <div className="relative group">
              {/* Glow ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white border border-slate-200 group-focus-within:border-emerald-500/50 rounded-2xl shadow-sm transition-colors">
                <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  ref={inputRef}
                  id="sky-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === "sky" ? "Search by sky title..." : placeholders[placeholderIdx]}
                  className="w-full bg-transparent text-slate-800 placeholder-slate-300 pl-10 sm:pl-12 pr-20 sm:pr-36 py-3 sm:py-4 text-sm sm:text-base outline-none rounded-2xl"
                />
                {query && (
                  <button
                    onClick={handleClearQuery}
                    className="absolute right-16 sm:right-24 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  id="sky-search-btn"
                  onClick={() => mode === "sky" ? handleSkySearch() : handleTextSearch()}
                  disabled={!query.trim() || loading}
                  className="absolute right-1.5 sm:right-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-md"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="hidden sm:inline">Search</span>
                  )}
                  <Search className="w-4 h-4 sm:hidden" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── IMAGE SEARCH UPLOAD ── */}
        {mode === "image" && (
          <div className="max-w-lg mx-auto space-y-4 px-2 sm:px-0">
            {!imagePreview ? (
              <div
                id="image-drop-zone"
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 sm:gap-4 border-2 border-dashed rounded-3xl p-6 sm:p-8 md:p-10 cursor-pointer transition-all ${
                  isDragOver
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${
                    isDragOver ? "bg-emerald-100" : "bg-slate-50"
                  }`}
                >
                  <Upload
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-colors ${
                      isDragOver ? "text-emerald-500" : "text-slate-300"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-slate-700 font-semibold text-sm sm:text-base mb-1">
                    Drop an image here
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    or <span className="text-emerald-600 underline underline-offset-2">browse files</span>
                  </p>
                  <p className="text-slate-300 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                    JPG, PNG, WEBP supported
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id="image-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm">
                <div className="relative h-40 sm:h-52 md:h-64 w-full">
                  <Image
                    src={imagePreview}
                    alt="Search image preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 hover:bg-white text-gray-600 p-1.5 rounded-full backdrop-blur-sm shadow-md transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                      <ImageIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">{imageFile?.name}</span>
                    </div>
                    {query && (
                      <span className="text-emerald-600 text-[10px] sm:text-xs font-medium mt-1 pl-6">
                        Will search for: &quot;{query}&quot;
                      </span>
                    )}
                  </div>
                  <button
                    id="image-search-btn"
                    onClick={handleImageSearch}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-md w-full sm:w-auto justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Find Similar
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Detected Colors badge ── */}
        {detectedColors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
            <span className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Detected colors:</span>
            {detectedColors.map((c) => (
              <span
                key={c}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-semibold capitalize"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* ── RESULTS ── */}
        {loading ? (
          <SearchSkeleton />
        ) : searched && results.length === 0 ? (
          <EmptyState mode={mode} />
        ) : results.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {groupedResults().map((section, sIdx) => (
              <div key={sIdx} className="space-y-4 sm:space-y-5">
                {/* Section header */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                  <h2 className="text-slate-800 font-black text-base sm:text-lg">
                    {section.label}
                  </h2>
                  <span className="text-slate-400 text-xs sm:text-sm font-medium">
                    ({section.products.length})
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-5">
                  {section.products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      wishlist={wishlist}
                      wishlistLoading={wishlistLoading}
                      dispatch={dispatch}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !searched ? (
          /* Initial idle state */
          <div className="flex flex-col items-center justify-center min-h-[25vh] sm:min-h-[30vh] text-center space-y-3 py-6 sm:py-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              {mode === "image" ? (
                <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
              ) : (
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
              )}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium px-4">
              {mode === "text"
                ? "Type a product name or keyword above"
                : "Upload a product image to find similar items"}
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  );
};

const DropshippingSearch = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-spin" />
      </div>
    }
  >
    <DropshippingSearchContent />
  </Suspense>
);

export default DropshippingSearch;
