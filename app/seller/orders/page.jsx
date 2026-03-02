'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {

  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [search, setSearch] = useState(""); // ✅ search state

  // ✅ fetch orders from DB
  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/order/admin");
      const data = await res.json();

      if (data.success) setOrders(data.orders);

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // ✅ action handler with real-time DB sync
  const handleAction = async (orderId, action) => {

    setProcessing(`${orderId}-${action}`);

    try {

      const res = await fetch("/api/order/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();
      alert(data.message);

      // ⭐ Refresh from DB
      await fetchSellerOrders();

    } catch (error) {
      console.log(error);
    }

    setProcessing(null);
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // ✅ Filter Orders (Name OR Phone)
  const filteredOrders = orders.filter((order) => {
    const name = order.address?.fullName?.toLowerCase() || "";
    const phone = order.address?.phoneNumber?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    return (
      name.includes(searchText) ||
      phone.includes(searchText)
    );
  });

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">

      {loading ? <Loading /> :

        <div className="md:p-10 p-4 space-y-5">

          <h2 className="text-lg font-medium">Orders</h2>

          {/* ✅ SEARCH SECTION */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by booking name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-4">

            {filteredOrders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (

              filteredOrders.map((order, index) => (

                <div
                  key={index}
                  className="grid md:grid-cols-4 gap-6 border border-gray-300 rounded-lg p-5 shadow-sm bg-white"
                >

                  {/* ===== PRODUCT ===== */}
                  <div className="flex gap-4">

                    <Image
                      className="w-16 h-16 object-cover rounded"
                      src={order.items[0]?.product?.image?.[0] || assets.box_icon}
                      alt="product"
                      width={64}
                      height={64}
                    />

                    <div>
                      <p className="font-semibold">
                        {order.items.map(item =>
                          `${item.product?.name} x ${item.quantity}`
                        ).join(", ")}
                      </p>

                      <p className="text-gray-500">
                        Items: {order.items.length}
                      </p>
                    </div>

                  </div>

                  {/* ===== CUSTOMER ===== */}
                  <div className="text-sm">

                    <p className="font-semibold">
                      {order.address?.fullName}
                    </p>

                    <p>{order.address?.area}</p>
                    <p>{order.address?.city}, {order.address?.state}</p>
                    <p>{order.address?.phoneNumber}</p>

                    {order.address?.email && (
                      <p className="text-blue-600 break-all">
                        {order.address.email}
                      </p>
                    )}

                  </div>

                  {/* ===== AMOUNT ===== */}
                  <div className="flex items-center text-lg font-bold">
                    {currency}{order.amount}
                  </div>

                  {/* ===== STATUS + ACTIONS ===== */}
                  <div className="text-sm">

                    <p>
                      Date: {new Date(order.date).toLocaleDateString()}
                    </p>

                    <p>Status: <b>{order.status}</b></p>

                    <p>Payment: <b>{order.paymentStatus}</b></p>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <button
                        disabled={processing}
                        onClick={() => handleAction(order._id, "accept")}
                        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {processing === `${order._id}-accept`
                          ? "⏳..."
                          : "Accept"}
                      </button>

                      <button
                        disabled={processing}
                        onClick={() => handleAction(order._id, "reject")}
                        className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {processing === `${order._id}-reject`
                          ? "⏳..."
                          : "Reject"}
                      </button>

                      <button
                        disabled={processing}
                        onClick={() => handleAction(order._id, "payment")}
                        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {processing === `${order._id}-payment`
                          ? "⏳..."
                          : "Approve Payment"}
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      }

      <Footer />

    </div>
  );
};

export default Orders;
