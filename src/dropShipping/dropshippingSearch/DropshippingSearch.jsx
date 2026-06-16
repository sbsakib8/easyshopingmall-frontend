"use client";

import { UrlBackend } from "@/src/confic/urlExport";
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
  Type,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { dsCartAdd } from "@/src/redux/dropshippingCartSlice";
import Container from "@/src/compronent/shared/Container";

// ─── Image download helper ────────────────────────────────────────────────────
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
  } catch {
    toast.error("Download failed");
  }
};

// ─── Product Card (reused pattern from subCategoryProducts) ──────────────────
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
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden w-full h-32 md:h-44">
        <Image
          src={
            product.images?.[0] ||
            (Array.isArray(product.image) ? product.image[0] : product.image) ||
            "/img/product.jpg"
          }
          alt={product.productName}
          width={200}
          height={200}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top actions */}
        <div className="absolute top-2 right-2 md:flex flex-col gap-1.5 z-20 hidden">
          <button
            onClick={(e) =>
              handleDownloadImage(e, product.images?.[0], product.productName)
            }
            className="bg-black/60 hover:bg-black/80 backdrop-blur-sm shadow-md p-1.5 rounded-xl text-white transition-all active:scale-90"
            title="Save Image"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
            disabled={wishlistLoading}
            className={`shadow-md p-1.5 rounded-xl transition-all active:scale-90 backdrop-blur-sm ${
              isWishlisted
                ? "bg-red-500/70 text-white"
                : "bg-black/60 hover:bg-black/80 text-white"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Out of stock */}
        {product.productStock < 1 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] md:text-xs font-semibold tracking-wider">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Color chips if available */}
        {product.color?.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {product.color.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="text-[8px] px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-2 md:p-3.5">
        <h3 className="font-semibold text-white/90 group-hover:text-emerald-300 transition-colors line-clamp-2 text-[10px] md:text-sm md:leading-tight mb-1">
          {product.productName}
        </h3>
        <p className="text-[10px] text-white/40 font-medium mb-2 uppercase hidden md:block">
          {product.brand || "No Brand"}
        </p>

        <div className="hidden md:flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">{renderStars(ratingValue)}</div>
          <p className="text-sm font-bold text-emerald-400">
            ৳
            {(user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING"))
              ? (product.dropshippingPrice ?? product.price)
              : product.price}
          </p>
        </div>

        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.productStock < 1}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-600 text-white py-2 px-2 rounded-xl font-medium text-[9px] md:text-xs tracking-wider md:flex items-center justify-center gap-1.5 shadow-md active:scale-[0.97] transition-all hidden"
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
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
        style={{ animationDelay: `${i * 40}ms` }}
      >
        <div className="h-32 md:h-44 bg-white/10" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-white/10 rounded-full w-4/5" />
          <div className="h-3 bg-white/10 rounded-full w-3/5" />
          <div className="h-3 bg-white/10 rounded-full w-2/5" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ mode }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4 py-16">
    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      {mode === "image" ? (
        <Camera className="w-9 h-9 text-white/20" />
      ) : (
        <Search className="w-9 h-9 text-white/20" />
      )}
    </div>
    <h3 className="text-xl font-black text-white/50">No Products Found</h3>
    <p className="text-white/30 text-sm max-w-xs">
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

  const [mode, setMode] = useState("text"); // "text" | "image"
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
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
      setQuery(q);
      handleTextSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Text search ────────────────────────────────────────────────────────────
  const handleTextSearch = useCallback(
    async (searchQuery) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;
      setLoading(true);
      setSearched(true);
      setDetectedColors([]);
      try {
        const res = await fetch(`${UrlBackend}/products/search-product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skyTitle: q, page: 1, limit: 30 }),
          credentials: "include",
        });
        const json = await res.json();
        setResults(json.data || []);
      } catch {
        toast.error("Search failed. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  // ── Image search ───────────────────────────────────────────────────────────
  const handleImageSearch = useCallback(async () => {
    if (!imageFile) return;
    
    // Extract name without extension and clean up hyphens/underscores
    const nameWithoutExt = imageFile.name.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt.replace(/[-_]/g, " ").trim();
    
    // Update the query so they see what we searched for
    setQuery(cleanName);
    
    // Execute a standard text search using the extracted file name
    await handleTextSearch(cleanName);
  }, [imageFile, handleTextSearch]);

  // ── Image file handling ────────────────────────────────────────────────────
  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setImageFile(file);
    setResults([]);
    setSearched(false);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResults([]);
    setSearched(false);
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
    if (e.key === "Enter") handleTextSearch();
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <Container className="relative z-10 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Dropshipping Finder
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            Search by keyword or upload an image — discover products instantly
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex gap-1">
            <button
              id="mode-text"
              onClick={() => {
                setMode("text");
                setResults([]);
                setSearched(false);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "text"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Type className="w-4 h-4" />
              Sky Search
            </button>
            <button
              id="mode-image"
              onClick={() => {
                setMode("image");
                setResults([]);
                setSearched(false);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "image"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Camera className="w-4 h-4" />
              Image Search
            </button>
          </div>
        </div>

        {/* ── TEXT SEARCH INPUT ── */}
        {mode === "text" && (
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              {/* Glow ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/5 border border-white/15 group-focus-within:border-emerald-500/50 rounded-2xl transition-colors duration-300">
                <Search className="absolute left-4 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  ref={inputRef}
                  id="sky-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholders[placeholderIdx]}
                  className="w-full bg-transparent text-white placeholder-white/25 pl-12 pr-36 py-4 text-base outline-none rounded-2xl"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
                    className="absolute right-24 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  id="sky-search-btn"
                  onClick={() => handleTextSearch()}
                  disabled={!query.trim() || loading}
                  className="absolute right-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── IMAGE SEARCH UPLOAD ── */}
        {mode === "image" && (
          <div className="max-w-lg mx-auto space-y-4">
            {!imagePreview ? (
              <div
                id="image-drop-zone"
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-white/15 bg-white/3 hover:border-emerald-500/50 hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragOver ? "bg-emerald-500/20" : "bg-white/5"
                  }`}
                >
                  <Upload
                    className={`w-7 h-7 transition-colors ${
                      isDragOver ? "text-emerald-400" : "text-white/30"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-white/70 font-semibold mb-1">
                    Drop an image here
                  </p>
                  <p className="text-white/30 text-sm">
                    or <span className="text-emerald-400 underline underline-offset-2">browse files</span>
                  </p>
                  <p className="text-white/20 text-xs mt-2">
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
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <div className="relative h-52 md:h-64 w-full">
                  <Image
                    src={imagePreview}
                    alt="Search image preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{imageFile?.name}</span>
                    </div>
                    {query && (
                      <span className="text-emerald-400 text-xs font-medium mt-1">
                        Will search for: "{query}"
                      </span>
                    )}
                  </div>
                  <button
                    id="image-search-btn"
                    onClick={handleImageSearch}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
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
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-white/30 text-xs uppercase tracking-widest">Detected colors:</span>
            {detectedColors.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold capitalize"
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
          <div className="space-y-5">
            {/* Results header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                <h2 className="text-white/80 font-bold text-lg">
                  {results.length} Products Found
                </h2>
              </div>
              {mode === "image" && (
                <span className="text-white/30 text-xs">
                  Matched by image color analysis
                </span>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {results.map((product) => (
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
        ) : !searched ? (
          /* Initial idle state */
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center space-y-3 py-8">
            <div className="w-16 h-16 rounded-3xl bg-white/3 border border-white/8 flex items-center justify-center">
              {mode === "image" ? (
                <Camera className="w-7 h-7 text-white/15" />
              ) : (
                <Search className="w-7 h-7 text-white/15" />
              )}
            </div>
            <p className="text-white/20 text-sm">
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }
  >
    <DropshippingSearchContent />
  </Suspense>
);

export default DropshippingSearch;
