'use client'

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2, Eye, Save, X, Loader2 } from "lucide-react";

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
  "Glass Hardware",
  "Mirror Fixing",
  "Mirror Cladding ",
  "Digital Print Glass",
  "Frameless Partition",
  "Profile System Partition",
  "With Frame Partition",
  "90° Shower Partition",
  "Glass Blocks",
  "Spider Laminated Glass",
  "Balcony Railing",
  "Staircase Railing",
  "Curved Railing",
  "Diamond Coating",
  "Nano Coating",
  "Safety Glass",
  "Skylight Glass Work",
  "Glass Facade",
  "SoundProof Glass",
  "Laminated Glass",
  "Glass Pillar",

];

const ProductList = () => {

  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImages, setEditImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH =================

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "/api/product/seller-list",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setProducts(data.products);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  // ================= START EDIT =================

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      offerPrice: product.offerPrice,
      sizes: product.sizes || []
    });
    setExistingImages(product.image || []);
    setEditImages([]);
  };

  // ================= REMOVE IMAGE =================

  const removeImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  // ================= SAVE UPDATE =================

  const saveUpdate = async (id) => {

    setSavingId(id);

    try {

      const token = await getToken();
      const formData = new FormData();

      Object.entries(editData).forEach(([k, v]) => {
        if (k !== "sizes") {
          formData.append(k, v);
        }
      });

      // ✅ Save sizes
      formData.append(
        "sizes",
        JSON.stringify(editData.sizes || [])
      );

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      editImages.forEach(file =>
        file && formData.append("images", file)
      );

      formData.append("id", id);

      const { data } = await axios.put(
        "/api/product/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Updated!");
        setEditingId(null);
        fetchProducts();
      }

    } catch (err) {
      toast.error(err.message);
    }

    setSavingId(null);
  };

  // ================= DELETE =================

  const deleteProduct = async (id) => {

    setDeletingId(id);

    try {
      const token = await getToken();

      await axios.delete(
        "/api/product/delete",
        {
          data: { id },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Deleted!");
      fetchProducts();

    } catch (err) {
      toast.error(err.message);
    }

    setDeletingId(null);
  };

  // ================= UI =================

  return (

    <div className="flex-1 min-h-screen flex flex-col justify-between">

      {loading ? <Loading /> :

        <div className="md:p-10 p-4 space-y-6">

          <h2 className="text-lg font-medium">All Products</h2>

          {products.map(product => (

            <div key={product._id} className="border rounded p-6">

              {editingId === product._id ? (

                <div className="space-y-5">

                  {/* IMAGE GRID */}
                  <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => {

                      const img = existingImages[i];

                      return (
                        <div key={i} className="relative">

                          <label>
                            <input
                              type="file"
                              hidden
                              onChange={e => {
                                const arr = [...editImages];
                                arr[i] = e.target.files[0];
                                setEditImages(arr);
                              }}
                            />
                            <Image
                              src={
                                editImages[i]
                                  ? URL.createObjectURL(editImages[i])
                                  : img || assets.upload_area
                              }
                              width={100}
                              height={100}
                              className="border rounded cursor-pointer"
                              alt=""
                            />
                          </label>

                          {img && (
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                            >
                              ✕
                            </button>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* FORM FIELDS */}

                  <input
                    value={editData.name}
                    onChange={e =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="border p-2 w-full"
                  />

                  <textarea
                    value={editData.description}
                    onChange={e =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="border p-2 w-full"
                  />

                  <select
                    value={editData.category}
                    onChange={e =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    className="border p-2"
                  >
                    {categories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={editData.price}
                    onChange={e =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="border p-2"
                  />

                  <input
                    type="number"
                    value={editData.offerPrice}
                    onChange={e =>
                      setEditData({ ...editData, offerPrice: e.target.value })
                    }
                    className="border p-2"
                  />

                  {/* ================= DYNAMIC DIMENSIONS ================= */}

                  <div>
                    <p className="font-medium mb-2">Mirror Dimensions</p>

                    {(editData.sizes || []).map((size, index) => (
                      <div key={index} className="flex gap-2 mb-2">

                        <input
                          type="text"
                          value={size}
                          onChange={(e) => {
                            const updated = [...editData.sizes];
                            updated[index] = e.target.value;
                            setEditData({ ...editData, sizes: updated });
                          }}
                          className="border p-2 w-full"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const updated = editData.sizes.filter((_, i) => i !== index);
                            setEditData({ ...editData, sizes: updated });
                          }}
                          className="px-3 bg-red-500 text-white rounded"
                        >
                          X
                        </button>

                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setEditData({
                          ...editData,
                          sizes: [...(editData.sizes || []), ""]
                        })
                      }
                      className="px-4 py-2 bg-black text-white rounded mt-2"
                    >
                      + Add Dimension
                    </button>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-2">

                    <button
                      onClick={() => saveUpdate(product._id)}
                      disabled={savingId === product._id}
                      className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded"
                    >
                      {savingId === product._id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Save size={16} />}
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 px-5 py-2 bg-gray-500 text-white rounded"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                <div className="flex justify-between">

                  <div className="flex gap-4">

                    <Image
                      src={product.image?.[0]}
                      width={80}
                      height={80}
                      alt=""
                    />

                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.category}</p>
                      <p>₹{product.offerPrice}</p>
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => startEdit(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      disabled={deletingId === product._id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded"
                    >
                      {deletingId === product._id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Trash2 size={16} />}
                      Delete
                    </button>

                    <button
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded"
                    >
                      <Eye size={16} />
                      View
                    </button>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      }

      <Footer />

    </div>
  );
};

export default ProductList;