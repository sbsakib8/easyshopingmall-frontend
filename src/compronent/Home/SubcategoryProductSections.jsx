"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, ShoppingBag, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { addToCartApi } from "@/src/hook/useCart";
import { setQuickViewProduct } from "@/src/redux/shopSlice";
import { toBengaliPrice, toBengaliDiscount } from "@/src/utlis/bengali";
import CenterPromoBanner from "./CenterPromoBanner";

/* ─────────────────────────────────────────────
   Auto-Scrolling Product Card Row
───────────────────────────────────────────── */
function SubcategoryRow({ subcategory, products }) {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const animFrameRef = useRef(null);
  const posRef = useRef(0);
  const isPausedRef = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  /* ── Auto-scroll (requestAnimationFrame infinite loop) ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length < 2) return;

    const SPEED = 0.6; // px per frame — adjust for faster/slower

    const animate = () => {
      if (!isPausedRef.current && track) {
        posRef.current += SPEED;
        // Reset when we've scrolled one "half" (duplicate set)
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [products.length]);

  /* ── Manual arrow scroll (pauses then resumes) ── */
  const CARD_W = 320;
  const manualScroll = (dir) => {
    isPausedRef.current = true;
    const step = dir === "left" ? -CARD_W : CARD_W;
    posRef.current = Math.max(0, posRef.current + step);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
    setTimeout(() => { isPausedRef.current = false; }, 1800);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user?._id) {
      toast.error("কার্টে যোগ করতে অনুগ্রহ করে লগইন করুন");
      return;
    }
    try {
      await addToCartApi(
        { userId: user._id, productId: product._id || product.id, quantity: 1, price: product.price },
        dispatch
      );
      toast.success(`${product.productName || product.name || "পণ্য"} কার্টে যোগ করা হয়েছে!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "কার্টে যোগ করতে সমস্যা হয়েছে");
    }
  };

  const handleCardClick = (product) => {
    dispatch(setQuickViewProduct(product));
    router.push(`/productdetails/${product._id || product.id}`);
  };

  const categoryName =
    typeof subcategory.category === "object"
      ? subcategory.category?.name
      : subcategory.category || "";
  const subcategoryName = subcategory.name || subcategory.subcategoryName || "পণ্য";
  const viewAllUrl = `/shop?subcategory=${encodeURIComponent(subcategoryName)}${
    categoryName ? `&category=${encodeURIComponent(categoryName)}` : ""
  }`;

  /* Duplicate products for seamless infinite loop */
  const loopProducts = products.length >= 2 ? [...products, ...products] : products;

  return (
    <div className="my-8">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          {/* Accent bar */}
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
          <div className="w-9 h-9 rounded-full border-2 border-primary/20 overflow-hidden shrink-0 shadow-md bg-primary/10 flex items-center justify-center">
            {subcategory.image ? (
              <Image src={subcategory.image} alt={subcategoryName} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink leading-none">{subcategoryName}</h3>
            <p className="text-[11px] text-muted mt-0.5">{products.length}টি পণ্য পাওয়া গেছে</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={viewAllUrl}
            className="hidden sm:flex text-xs font-semibold text-primary hover:text-primary-dark border border-primary/30 hover:border-primary rounded-full px-3 py-1.5 transition-all items-center gap-1 group"
          >
            সব দেখুন
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          {/* Arrow buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => manualScroll("left")}
              className="w-8 h-8 rounded-full bg-white border border-line shadow hover:bg-primary hover:text-white hover:border-primary text-ink/60 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              aria-label="Prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => manualScroll("right")}
              className="w-8 h-8 rounded-full bg-white border border-line shadow hover:bg-primary hover:text-white hover:border-primary text-ink/60 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrolling Track ── */}
      <div
        ref={wrapperRef}
        className="relative overflow-hidden"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onTouchStart={() => { isPausedRef.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isPausedRef.current = false; }, 2000); }}
      >
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-bg to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-bg to-transparent z-10" />

        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 py-2 will-change-transform"
          style={{ width: "max-content" }}
        >
          {loopProducts.map((product, i) => {
            const id = product._id || product.id;
            const imageSrc = product.images?.[0] || product.image || "/img/product.jpg";
            const title = product.productName || product.name || "Product";
            const price = product.price || 0;
            const oldPrice =
              product.retailSale ||
              product.oldPrice ||
              (product.discount && price ? Math.round(price / (1 - product.discount / 100)) : null);
            const discountPercent =
              product.discount ||
              (oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null);

            return (
              <div
                key={`${id}-${i}`}
                onClick={() => handleCardClick(product)}
                className="shrink-0 w-[170px] sm:w-[240px] md:w-[280px] lg:w-[300px] bg-card rounded-xl sm:rounded-2xl border border-line shadow-xs hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                {/* Image Section */}
                <div className="relative w-full h-[110px] sm:h-[150px] overflow-hidden bg-slate-50">
                  <Image
                    src={imageSrc}
                    alt={title}
                    width={300}
                    height={160}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {discountPercent && discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow">
                      {toBengaliDiscount(discountPercent)}
                    </span>
                  )}
                  {/* Quick add button — appears on hover */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    title="কার্টে যোগ করুন"
                    aria-label="Add to cart"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-90 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Info Section */}
                <div className="p-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1.5">
                    {title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-primary">{toBengaliPrice(price)}</span>
                      {oldPrice && oldPrice > price && (
                        <span className="text-[11px] text-muted line-through">{toBengaliPrice(oldPrice)}</span>
                      )}
                    </div>
                    {/* Mobile add-to-cart */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="sm:hidden w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile "সব দেখুন" link */}
      <div className="sm:hidden text-center mt-3">
        <Link href={viewAllUrl} className="text-xs font-semibold text-primary underline underline-offset-2">
          সব দেখুন →
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function SubcategoryProductSections({ initialData }) {
  const products = initialData?.products || [];
  const subcategories = initialData?.subcategories || [];

  const subcategorySections = useMemo(() => {
    if (!products.length) return [];

    const subMap = new Map();
    subcategories.forEach((sub) => {
      const name = (sub.name || sub.subcategoryName || "").trim();
      if (name) subMap.set(name.toUpperCase(), { subInfo: sub, products: [] });
    });

    products.forEach((p) => {
      let subName = null;
      if (Array.isArray(p.subCategory) && p.subCategory.length > 0) {
        const item = p.subCategory[0];
        subName = typeof item === "string" ? item : item?.name;
      } else if (typeof p.subCategory === "object" && p.subCategory?.name) {
        subName = p.subCategory.name;
      } else if (typeof p.subCategory === "string") {
        subName = p.subCategory;
      }

      if (subName) {
        const key = subName.trim().toUpperCase();
        if (!subMap.has(key)) {
          subMap.set(key, {
            subInfo: { name: subName.trim(), category: p.category, image: p.images?.[0] || "" },
            products: [],
          });
        }
        const entry = subMap.get(key);
        if (entry.products.length < 20) entry.products.push(p);
      }
    });

    const result = [];
    subMap.forEach((val) => {
      if (val.products.length > 0) result.push({ subcategory: val.subInfo, products: val.products });
    });

    if (result.length === 0 && products.length > 0) {
      result.push({
        subcategory: { name: "জনপ্রিয় পণ্য", image: products[0]?.images?.[0] || "" },
        products: products.slice(0, 20),
      });
    }

    return result;
  }, [products, subcategories]);

  if (!subcategorySections.length) return null;

  const middleIndex = Math.max(1, Math.floor(subcategorySections.length / 2));

  return (
    <div className="container mx-auto px-4 max-w-7xl my-6">
      {subcategorySections.map((section, idx) => (
        <React.Fragment key={idx}>
          {idx === middleIndex && <CenterPromoBanner />}
          <SubcategoryRow subcategory={section.subcategory} products={section.products} />
        </React.Fragment>
      ))}
      {subcategorySections.length === 1 && <CenterPromoBanner />}
    </div>
  );
}
