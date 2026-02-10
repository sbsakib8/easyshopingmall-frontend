"use client"
import { useGetSubcategory } from '@/src/utlis/useSubcategory';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AllProducts = () => {
    const { subcategory, loading } = useGetSubcategory()
    const menCategory = subcategory?.filter(cat=>cat.category.name==="Men's Fashion")
    console.log(menCategory)
    if(loading)return
    return (
        <div className=' container'>
            {/* ছেলেদের পণ্য */}
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-center font-bold px-2 py-3 text-2xl mb-5'>ছেলেদের পণ্য</h1>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {
                    menCategory.map(cat=> <Link href={`/sub-category/${cat?._id}`} className='shadow-md rounded-2xl px-3 py-2 min-h-40 hover:scale-105 duration-75'>
                        <Image
                        src={cat?.image}
                        alt='category image'
                        width={200}
                        height={200}
                        
                        className='rounded-sm w-full max-h-40 object-cover'
                        />
                      <h2 className="text-center text-lg font-bold mt-5">{cat?.name}</h2>
                   </Link>)
                    }
                </div>
            </div>
        </div>
    );
};

export default AllProducts;