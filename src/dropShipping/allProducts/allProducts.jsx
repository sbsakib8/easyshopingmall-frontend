"use client";
import { useGetSubcategory } from '@/src/utlis/useSubcategory';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AllProducts = () => {
  const { subcategory, loading } = useGetSubcategory();

  const menCategory = subcategory?.filter(
    cat => cat?.category?.name === "Men's Fashion"
  );

  return (
    <div className="container">
      {/* Men's Products */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center font-bold px-2 py-3 text-2xl mb-5">
          ছেলেদের পণ্য
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* 🔹 LOADING SKELETON */}
          {loading &&
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="shadow-md rounded-2xl px-3 py-2 min-h-40 min-w-80 animate-pulse"
              >
                <div className="bg-gray-300 rounded-sm h-40" />
                <div className="h-5 bg-gray-300 rounded mt-5 mx-auto w-3/4" />
              </div>
            ))}

          {/* 🔹 ACTUAL DATA */}
          {
            menCategory?.map(cat => (
              <Link
                key={cat?._id}
                href={`/sub-category/${cat?._id}`}
                className="shadow-md rounded-2xl px-3 py-2 min-h-40 hover:scale-105 duration-75"
              >
                <Image
                  src={cat?.image}
                  alt="category image"
                  width={200}
                  height={200}
                  className="rounded-sm w-full max-h-40 object-cover"
                />
                <h2 className="text-center text-lg font-bold mt-5">
                  {cat?.name}
                </h2>
              </Link>
            ))}

        </div>
      </div>
    </div>
  );
};

export default AllProducts;
