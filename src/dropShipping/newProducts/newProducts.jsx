"use client";

import { useGetSubcategory } from "@/src/utlis/useSubcategory";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import Container from "@/src/compronent/shared/Container";
import { CategoryCard } from "@/src/dropShipping/allProducts/allProducts";

const NewProducts = () => {
  const { subcategory, loading } = useGetSubcategory();
  const user = useSelector((state) => state.user.data);
  const menCategory = subcategory?.filter(
    (cat) => cat?.category?.name === "Men's Fashion",
  );
  const womenCategory = subcategory?.filter(
    (cat) => cat?.category?.name === "Women’s Fashion",
  );
  const childrenCategory = subcategory?.filter(
    (cat) => cat?.category?.name === "Children Fashion",
  );

  const groupedCategories = [
    {
      title: "ছেলেদের পণ্য — Men's Fashion",
      items: menCategory,
    },
    {
      title: "মেয়েদের পণ্য — Women's Fashion",
      items: womenCategory,
    },
    {
      title: "বাচ্চাদের পণ্য — Children's Fashion",
      items: childrenCategory,
    },
  ];

  return (
    <>
      {(user?.role === "DROPSHIPPING" ||
        user?.roles?.includes("DROPSHIPPING")) && (
        <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Animated Gradient Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(16,185,129,0.15)_0%,transparent_50%)] animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-[radial-gradient(at_70%_60%,rgba(45,212,191,0.15)_0%,transparent_50%)] animate-pulse-slower"></div>

            {/* Subtle Moving Orbs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-float-delay"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-float-slow"></div>
          </div>

          <Container className="relative z-10 space-y-16 md:space-y-20 py-0">
            {groupedCategories.map((group, index) => (
              <div key={index}>
                {/* Section Title */}
                <h1 className="text-center font-black px-4 py-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 text-emerald-800 uppercase tracking-wider sm:tracking-widest break-words animate-fade-up">
                  {group.title}
                </h1>

                {/* Responsive Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {group.items?.map((cat, idx) => (
                    <CategoryCard
                      key={cat?._id}
                      idx={idx}
                      name={cat?.name || ""}
                      path={`/sub-category/${cat?._id}?pageType=new-products`}
                      image={cat?.image || "/placeholder.png"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Container>
        </section>
      )}
    </>
  );
};

export default NewProducts;
