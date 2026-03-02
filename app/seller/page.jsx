'use client'

import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const categories = [
   "LED Mirrors",
  "Frame Mirrors",
  "LED With Frame Mirrors",
  "Shower Cubicles",
  "Openable Shower Partitions",
  "Sliding Shower Partitions",
  "Fixed Shower Partitions",
  "Fixed Partitions",
  "Fixed & Door Partitions",
  "Office Partition",
  "Sliding Door Partitions",
  "Glass Canopy",
  "Glass Railing System",
  "Fluted Glass",
  "Frosted Glass",
  "Clear Glass",
  "Extra Clear Glass",
  "Tinted Glass",
  "One-Way Glass",
  "Designer Glass",
  "Designer Partition Glass",
  "Sandwich Laminated Glass",
  "Tempered Glass",
  "Lacqued Glass",
  "Etched Glass",
];

const AddProduct = () => {

  const { getToken, fetchProductData } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [sizes, setSizes] = useState([""]);
  const [loading, setLoading] = useState(false);

  const MAX_SIZE = 1024 * 1024;

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.filter(Boolean).length)
      return toast.error("Please upload at least 1 image");

    setLoading(true);

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);

      // ✅ Send dynamic sizes
      formData.append(
        "sizes",
        JSON.stringify(
          sizes.filter(s => s.trim() !== "")
        )
      );

      files.forEach(file => {
        if (file) formData.append('images', file);
      });

      const { data } = await axios.post(
        '/api/product/add',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {

        toast.success("Product added successfully!");

        // ✅ REFRESH PRODUCTS
        await fetchProductData();

        // Reset form
        setFiles([]);
        setName('');
        setDescription('');
        setCategory(categories[0]);
        setPrice('');
        setOfferPrice('');
        setSizes([""]);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILE HANDLER =================

  const handleFileChange = (file, index, inputElement) => {

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      inputElement.value = null;
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image must be less than 1MB");
      inputElement.value = null;
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
  };

  // ================= UI =================

  return (

    <div className="flex-1 min-h-screen flex flex-col justify-between">

      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-6 max-w-lg"
      >

        {/* ================= IMAGES ================= */}

        <div>
          <p className="text-base font-medium">
            Product Images (Max 1MB each)
          </p>

          <div className="flex gap-3 mt-2">
            {[...Array(4)].map((_, i) => (
              <label key={i}>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={e =>
                    handleFileChange(
                      e.target.files[0],
                      i,
                      e.target
                    )
                  }
                />
                <Image
                  src={
                    files[i]
                      ? URL.createObjectURL(files[i])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                  className="cursor-pointer border rounded object-cover"
                />
              </label>
            ))}
          </div>
        </div>

        {/* ================= NAME ================= */}

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full border p-3 rounded"
          required
        />

        {/* ================= DESCRIPTION ================= */}

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full border p-3 rounded"
          required
        />

        {/* ================= CATEGORY + PRICE ================= */}

        <div className="flex gap-4 flex-wrap">

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>

          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            value={offerPrice}
            onChange={e => setOfferPrice(e.target.value)}
            placeholder="Offer Price"
            className="border p-2 rounded"
            required
          />

        </div>

        {/* ================= DYNAMIC DIMENSIONS ================= */}

        <div>
          <p className="text-base font-medium mb-2">
            Mirror Dimensions
          </p>

          {sizes.map((size, index) => (
            <div key={index} className="flex gap-2 mb-2">

              <input
                type="text"
                value={size}
                placeholder="Example: 24 x 36 inch"
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[index] = e.target.value;
                  setSizes(updated);
                }}
                className="border p-2 rounded w-full"
              />

              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = sizes.filter((_, i) => i !== index);
                    setSizes(updated);
                  }}
                  className="px-3 bg-red-500 text-white rounded"
                >
                  X
                </button>
              )}

            </div>
          ))}

          <button
            type="button"
            onClick={() => setSizes([...sizes, ""])}
            className="mt-2 px-4 py-2 bg-black text-white rounded"
          >
            + Add Dimension
          </button>
        </div>

        {/* ================= SUBMIT ================= */}

        <button
          disabled={loading}
          className={`px-8 py-3 rounded text-white font-medium flex items-center justify-center gap-2 transition
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
            }`}
        >

          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Adding...
            </>
          ) : (
            "ADD PRODUCT"
          )}

        </button>

      </form>

    </div>
  );
};

export default AddProduct;