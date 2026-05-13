"use client";
import { useGetSubcategory } from '@/src/utlis/useSubcategory';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const BoostProducts = () => {
    const { subcategory, loading } = useGetSubcategory();
    const user = useSelector((state) => state.user.data);
    
    // Group subcategories by parent category name dynamically
    const groupedCategories = subcategory?.reduce((acc, cat) => {
        const categoryName = cat?.category?.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(cat);
        return acc;
    }, {});

    // Organize into large groups and combine small groups
    const finalGroups = [];
    let smallCategories = [];
    let smallCategoryNames = [];

    if (groupedCategories) {
        Object.entries(groupedCategories).forEach(([name, subcats]) => {
            if (subcats.length >= 3) {
                finalGroups.push({ title: name, items: subcats });
            } else {
                smallCategories = [...smallCategories, ...subcats];
                smallCategoryNames.push(name);
            }
        });

        if (smallCategories.length > 0) {
            let combinedTitle = smallCategoryNames.join(" & ");
            if (smallCategoryNames.length > 3) {
                combinedTitle = `${smallCategoryNames[0]}, ${smallCategoryNames[1]} & Others`;
            }
            finalGroups.push({ title: combinedTitle, items: smallCategories });
        }
    }

    return (<>
        {(user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) &&
            <div className="container space-y-16 mb-10 mt-8">
                {finalGroups.map((group, index) => (
                    <div key={index} className="flex flex-col justify-center items-center">
                        <h1 className="text-center font-black px-2 py-3 text-3xl mb-8 text-emerald-800 uppercase tracking-widest">
                            {group.title} (Boosted)
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {group.items.map(cat => (
                                <Link
                                    key={cat?._id}
                                    href={`/sub-category/${cat?._id}?pageType=boost-products`}
                                    className="group shadow-md hover:shadow-xl hover:shadow-emerald-500/10 rounded-[2rem] px-4 py-5 bg-white border-2 border-transparent hover:border-emerald-500 transition-all duration-300 flex flex-col items-center"
                                >
                                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                                        <Image
                                            src={cat?.image || '/placeholder.png'}
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
                ))}
            </div>}
    </>
    );
};

export default BoostProducts;
