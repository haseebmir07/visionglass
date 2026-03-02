import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const isLoading = !products || products.length === 0;

  // 🔥 Extract unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const unique = [...new Set(products.map(p => p.category))];
    return ["All", ...unique];
  }, [products]);

  // 🔥 Filtered products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="flex flex-col items-center pt-14 w-full">

      {/* Title */}
      <p className="text-2xl font-medium text-left w-full">
        Popular products
      </p>

      {/* 🔥 CATEGORY FILTER SECTION */}
      {!isLoading && (
        <div className="flex flex-wrap gap-3 mt-6 w-full">

          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-1.5 rounded-full text-sm transition-all duration-300
                ${
                  selectedCategory === category
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {category}
            </button>
          ))}

        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        
        {isLoading
          ? [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-52 w-full"
              />
            ))
          : filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>

      {!isLoading && (
        <button
          onClick={() => router.push("/all-products")}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          See more
        </button>
      )}

    </div>
  );
};

export default HomeProducts;
