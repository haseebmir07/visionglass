'use client';

import React, { useEffect, useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {

  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getToken
  } = useAppContext();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "/api/user/get-address",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0)
          setSelectedAddress(data.addresses[0]._id);
      }
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">

        {/* ================= CART TABLE ================= */}
        <div className="flex-1">

          <div className="flex justify-between border-b pb-6 mb-8">
            <h2 className="text-3xl text-gray-600">
              Your <span className="text-orange-600 font-medium">Cart</span>
            </h2>
            <p className="text-xl">{getCartCount()} Items</p>
          </div>

          <table className="w-full">

            <thead>
              <tr className="text-gray-600">
                <th className="text-left pb-4">Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>

              {Object.keys(cartItems).map((id) => {

                const product = products.find(p => p._id === id);
                if (!product) return null;

                return Object.keys(cartItems[id]).map((dimension) => {

                  const quantity = cartItems[id][dimension];
                  if (quantity <= 0) return null;

                  return (
                    <tr key={id + dimension}>

                      {/* PRODUCT INFO */}
                      <td className="flex gap-4 py-4">

                        <Image
                          src={product.image[0]}
                          width={60}
                          height={60}
                          alt=""
                        />

                        <div>
                          <p className="font-medium">{product.name}</p>

                          {/* ✅ SHOW SELECTED DIMENSION */}
                          <p className="text-sm text-gray-500">
                            Size: {dimension}
                          </p>

                          <button
                            className="text-orange-600 text-sm mt-1"
                            onClick={() =>
                              updateCartQuantity(id, dimension, 0)
                            }
                          >
                            Remove
                          </button>
                        </div>

                      </td>

                      {/* PRICE */}
                      <td>₹{product.offerPrice}</td>

                      {/* QUANTITY */}
                      <td>
                        <div className="flex gap-2 items-center">

                          <button
                            onClick={() =>
                              updateCartQuantity(id, dimension, quantity - 1)
                            }
                            className="px-2 border"
                          >
                            -
                          </button>

                          <span>{quantity}</span>

                          <button
                            onClick={() =>
                              addToCart(id, dimension)
                            }
                            className="px-2 border"
                          >
                            +
                          </button>

                        </div>
                      </td>

                      {/* SUBTOTAL */}
                      <td>
                        ₹{(product.offerPrice * quantity).toFixed(2)}
                      </td>

                    </tr>
                  );
                });
              })}

            </tbody>

          </table>

          {/* ================= ADDRESS SECTION ================= */}

          <div className="mt-10">
            <h3 className="text-xl font-medium mb-4">
              Shipping Address
            </h3>

            {addresses.length === 0 ? (

              <div className="border p-6 rounded text-center">
                <p>No address found</p>
                <button
                  onClick={() => router.push("/add-address")}
                  className="mt-3 bg-orange-600 text-white px-4 py-2 rounded"
                >
                  Add Address
                </button>
              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-4">

                {addresses.map(addr => (

                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr._id)}
                    className={`border p-4 rounded cursor-pointer transition ${
                      selectedAddress === addr._id
                        ? "border-orange-600 bg-orange-50"
                        : ""
                    }`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.area}</p>
                    <p>{addr.city}, {addr.state}</p>
                    <p>{addr.phoneNumber}</p>
                  </div>

                ))}

                <div
                  onClick={() => router.push("/add-address")}
                  className="border border-dashed p-4 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  + Add New Address
                </div>

              </div>

            )}

          </div>

          <button
            onClick={() => router.push("/all-products")}
            className="mt-6 text-orange-600"
          >
            ← Continue Shopping
          </button>

        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <OrderSummary selectedAddress={selectedAddress} />

      </div>
    </>
  );
};

export default Cart;