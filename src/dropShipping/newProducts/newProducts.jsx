"use client";
import { useGetSubcategory } from '@/src/utlis/useSubcategory';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const NewProducts = () => {
    const { subcategory, loading } = useGetSubcategory();
    const user = useSelector((state) => state.user.data);
    const menCategory = subcategory?.filter(
        cat => cat?.category?.name === "Men's Fashion"
    );
    const womenCategory = subcategory?.filter(
        cat => cat?.category?.name === "Women’s Fashion"
    );
    const childrenCategory = subcategory?.filter(
        cat => cat?.category?.name === "Children Fashion"
    );

    return (<>
        {(user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) &&
            <div className="container space-y-16 mb-10">
                {/* Men's Products */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center font-black px-2 py-3 text-3xl mb-8 text-emerald-800 uppercase tracking-widest">
                        ছেলেদের পণ্য — Men's Fashion
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* 🔹 ACTUAL DATA */}
                        {
                            menCategory?.map(cat => (
                                <Link
                                    key={cat?._id}
                                    href={`/sub-category/${cat?._id}?pageType=new-products`}
                                    className="group shadow-md hover:shadow-xl hover:shadow-emerald-500/10 rounded-[2rem] px-4 py-5 bg-white border-2 border-transparent hover:border-emerald-500 transition-all duration-300 flex flex-col items-center"
                                >
                                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                                        <Image
                                            src={cat?.image}
                                            alt={cat?.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h2 className="text-center text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                                        {cat?.name}
                                    </h2>
                                </Link>
                            ))}
                    </div>
                </div>

                {/* Women's Products */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center font-black px-2 py-3 text-3xl mb-8 text-emerald-800 uppercase tracking-widest">
                        মেয়েদের পণ্য — Women's Fashion
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* 🔹 ACTUAL DATA */}
                        {
                            womenCategory?.map(cat => (
                                <Link
                                    key={cat?._id}
                                    href={`/sub-category/${cat?._id}?pageType=new-products`}
                                    className="group shadow-md hover:shadow-xl hover:shadow-emerald-500/10 rounded-[2rem] px-4 py-5 bg-white border-2 border-transparent hover:border-emerald-500 transition-all duration-300 flex flex-col items-center"
                                >
                                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                                        <Image
                                            src={cat?.image}
                                            alt={cat?.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h2 className="text-center text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                                        {cat?.name}
                                    </h2>
                                </Link>
                            ))}
                    </div>
                </div>

                {/* Children's Products */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center font-black px-2 py-3 text-3xl mb-8 text-emerald-800 uppercase tracking-widest">
                        বাচ্চাদের পণ্য — Children's Fashion
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* 🔹 ACTUAL DATA */}
                        {
                            childrenCategory?.map(cat => (
                                <Link
                                    key={cat?._id}
                                    href={`/sub-category/${cat?._id}?pageType=new-products`}
                                    className="group shadow-md hover:shadow-xl hover:shadow-emerald-500/10 rounded-[2rem] px-4 py-5 bg-white border-2 border-transparent hover:border-emerald-500 transition-all duration-300 flex flex-col items-center"
                                >
                                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                                        <Image
                                            src={cat?.image}
                                            alt={cat?.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h2 className="text-center text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                                        {cat?.name}
                                    </h2>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>}
    </>
    );
};

export default NewProducts;
