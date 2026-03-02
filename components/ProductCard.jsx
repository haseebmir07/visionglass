'use client'

import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {

    const { currency, router } = useAppContext()
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        setLoading(true)

        setTimeout(() => {
            router.push('/product/' + product._id)
        }, 500)
    }

    return (
        <>
            {/* ⭐ Premium Loader Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md animate-fadeIn">

                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 animate-pulse">

                        <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>

                        <p className="text-gray-600 font-medium">
                            Bringing to you the Art....
                        </p>

                        <div className="flex gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                        </div>

                    </div>
                </div>
            )}

            {/* 🔥 LUXURY CARD */}
            <div
                onClick={handleClick}
                className="
                    group relative flex flex-col items-start gap-0.5 
                    max-w-[220px] w-full cursor-pointer
                    transition-all duration-500 ease-out
                    hover:-translate-y-2
                "
            >

                {/* IMAGE CONTAINER */}
                <div className="
                    relative bg-gray-500/10 rounded-2xl 
                    w-full h-56 
                    flex items-center justify-center 
                    overflow-hidden
                    transition-all duration-500
                    group-hover:shadow-2xl
                ">

                    {/* IMAGE WRAPPER FOR ZOOM */}
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src={product.image[0]}
                            alt={product.name}
                            fill
                            className="
                                object-cover
                                transition-transform duration-700 ease-out
                                group-hover:scale-125
                                group-hover:brightness-110
                            "
                        />
                    </div>

                    {/* GRADIENT OVERLAY ON HOVER */}
                    <div className="
                        absolute inset-0 bg-gradient-to-t 
                        from-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 
                        transition duration-500
                    "></div>

                    {/* ❤️ Heart Icon */}
                    <button className="
                        absolute top-3 right-3 
                        bg-white/80 backdrop-blur-md 
                        p-2 rounded-full shadow-md
                        hover:scale-110 transition
                    ">
                        <Image className="h-3 w-3" src={assets.heart_icon} alt="heart_icon" />
                    </button>
                </div>

                {/* PRODUCT NAME */}
                <p className="md:text-base font-semibold pt-3 w-full truncate transition group-hover:text-orange-600">
                    {product.name}
                </p>

                {/* DESCRIPTION */}
                <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
                    {product.description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs">4.5</p>

                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Image
                                key={index}
                                className="h-3 w-3"
                                src={index < 4 ? assets.star_icon : assets.star_dull_icon}
                                alt="star"
                            />
                        ))}
                    </div>
                </div>

              {/* PRICE + BUTTON */}
<div className="flex items-end justify-between w-full mt-2">

    {/* PRICE SECTION */}
    <div className="flex flex-col">

        {/* Offer Price */}
        <p className="text-base font-bold text-orange-600">
            {currency}{product.offerPrice}
        </p>

        {/* Original Price + Discount */}
        {product.price && product.price > product.offerPrice && (
            <div className="flex items-center gap-2">

                <span className="text-xs text-gray-500 line-through">
                    {currency}{product.price}
                </span>

                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    {Math.round(
                        ((product.price - product.offerPrice) / product.price) * 100
                    )}% OFF
                </span>

            </div>
        )}

    </div>

    {/* BUY BUTTON */}
    <button className="
        max-sm:hidden 
        px-4 py-1.5 
        text-white 
        bg-black 
        rounded-full 
        text-xs 
        opacity-0 translate-y-3
        group-hover:opacity-100 
        group-hover:translate-y-0
        transition-all duration-500
    ">
        Buy now
    </button>

</div>
            </div>
        </>
    )
}

export default ProductCard
