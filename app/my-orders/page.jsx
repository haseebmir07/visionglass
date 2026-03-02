'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

const MyOrders = () => {

  const { currency, getToken } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const fetchOrders = async () => {

    try {

      const token = await getToken();

      const res = await fetch("/api/order/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setUserEmail(data.email);
      }

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">

        <div className="space-y-5">

          <h2 className="text-lg font-medium mt-6">
            My Orders
          </h2>

          {loading ? <Loading /> : (

            <div className="space-y-4 text-sm">

              {orders.length === 0 && (
                <p className="py-6 text-gray-500">
                  No orders yet.
                </p>
              )}

              {orders.map((order, index) => (

                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm"
                >

                  <div className="grid md:grid-cols-3 gap-6">

                    {/* ===== PRODUCT SECTION ===== */}
                    <div>

                      <div className="flex gap-3 flex-wrap mb-3">

                        {order.items.map((item, i) => (

                          <Image
                            key={i}
                            src={item.product?.image?.[0]}
                            alt={item.product?.name}
                            width={70}
                            height={70}
                            className="rounded border object-cover"
                          />

                        ))}

                      </div>

                      <p className="font-semibold">
                        {order.items
                          .map(item =>
                            `${item.product?.name} x ${item.quantity}`
                          )
                          .join(", ")}
                      </p>

                      <p className="text-gray-500">
                        Items: {order.items.length}
                      </p>

                    </div>


                    {/* ===== CUSTOMER SECTION ===== */}
                    <div className="text-sm">

                      <p className="text-blue-600 break-all">
                        Email: {userEmail}
                      </p>

                      <p className="font-semibold mt-2">
                        {order.address.fullName}
                      </p>

                      <p>{order.address.area}</p>
                      <p>{order.address.city}, {order.address.state}</p>
                      <p>{order.address.phoneNumber}</p>

                    </div>


                    {/* ===== ORDER INFO SECTION ===== */}
                    <div className="text-sm space-y-1">

                      <p>
                        <strong>Total:</strong> {currency}{order.amount}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>

                      <p>
                        <strong>Payment:</strong> {order.paymentStatus}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
};

export default MyOrders;
