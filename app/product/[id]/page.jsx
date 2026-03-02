"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const Product = () => {

  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const [selectedDimension, setSelectedDimension] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  useEffect(() => {
    const product = products.find(p => p._id === id);
    setProductData(product);
  }, [id, products]);

  const handleAddToCart = () => {

    let finalDimension = selectedDimension;

    if (isCustom) {
      if (!customWidth || !customHeight) {
        toast.error("Please enter custom width and height");
        return;
      }
      finalDimension = `Custom: ${customWidth} x ${customHeight} inch`;
    }

    if (!finalDimension) {
      toast.error("Please select mirror dimension");
      return;
    }

    addToCart(productData._id, finalDimension);
    toast.success(`${productData.name} (${finalDimension}) added to cart 🛒`);
  };

  if (!productData) return <Loading />;

  const hasDiscount =
    productData.price &&
    productData.price > productData.offerPrice;

  const discountPercent = hasDiscount
    ? Math.round(
        ((productData.price - productData.offerPrice) /
          productData.price) *
          100
      )
    : 0;

  return (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* ================= LEFT SIDE ================= */}
          <div className="px-5 lg:px-16 xl:px-20">

            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4 group cursor-zoom-in">

              <Image
                src={mainImage || productData.image[0]}
                alt="product"
                width={1280}
                height={720}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />

            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition"
                >
                  <Image
                    src={image}
                    alt="thumbnail"
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex flex-col">

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {productData.name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 mt-3 leading-relaxed">
              {productData.description}
            </p>

            {/* ================= PRICE SECTION ================= */}
            <div className="mt-6 border-b pb-6">

              <div className="flex items-center gap-4">

                <p className="text-3xl font-bold text-orange-500">
                  ₹{productData.offerPrice}
                </p>

                {hasDiscount && (
                  <p className="text-lg text-gray-500 line-through">
                    ₹{productData.price}
                  </p>
                )}

                {hasDiscount && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    {discountPercent}% OFF
                  </span>
                )}

              </div>

              {hasDiscount && (
                <p className="text-sm text-gray-500 mt-1">
                  You save ₹{productData.price - productData.offerPrice}
                </p>
              )}

            </div>

            {/* ================= DIMENSION SELECTION ================= */}
            <div className="mt-6">

              <p className="text-lg font-medium mb-4">
                Select Mirror Dimension
              </p>

              <div className="grid grid-cols-2 gap-3">

                {(productData.sizes || [
                  "12 x 18 inch",
                  "18 x 24 inch",
                  "24 x 36 inch",
                  "36 x 48 inch"
                ]).map((dimension, index) => (

                  <button
                    key={index}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedDimension(dimension);
                    }}
                    className={`px-5 py-3 border rounded-lg text-sm transition ${
                      selectedDimension === dimension && !isCustom
                        ? "bg-black text-white border-black"
                        : "hover:border-black"
                    }`}
                  >
                    {dimension}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setIsCustom(true);
                    setSelectedDimension(null);
                  }}
                  className={`px-5 py-3 border rounded-lg text-sm transition ${
                    isCustom
                      ? "bg-black text-white border-black"
                      : "hover:border-black"
                  }`}
                >
                  Custom Size
                </button>

              </div>

              {isCustom && (
                <div className="flex gap-4 mt-4">
                  <input
                    type="number"
                    placeholder="Width (inch)"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="border px-4 py-2 rounded-md w-full"
                  />
                  <input
                    type="number"
                    placeholder="Height (inch)"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="border px-4 py-2 rounded-md w-full"
                  />
                </div>
              )}

            </div>

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-4 mt-10">

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition rounded-lg"
              >
                Buy Now
              </button>

            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Product;